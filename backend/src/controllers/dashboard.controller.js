const prisma = require('../config/prisma');
const { success } = require('../utils/response');
const { startOfMonth, endOfMonth, startOfYear, subMonths } = require('date-fns');

const adminDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);

    const [
      totalClients, newClientsThisMonth,
      totalFormations, activeFormations,
      devisPending, devisAccepted,
      facturesUnpaid, facturesPaid,
      sessionsUpcoming, unreadMessages,
      recentActivity,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { createdAt: { gte: startMonth, lte: endMonth } } }),
      prisma.formation.count(),
      prisma.formation.count({ where: { status: 'PUBLISHED' } }),
      prisma.devis.count({ where: { status: { in: ['DRAFT', 'SENT'] } } }),
      prisma.devis.count({ where: { status: 'ACCEPTED' } }),
      prisma.facture.findMany({ where: { status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] } }, select: { totalTTC: true } }),
      prisma.facture.findMany({ where: { status: 'PAID', createdAt: { gte: startOfYear(now) } }, select: { totalTTC: true } }),
      prisma.session.count({ where: { startDate: { gte: now }, status: 'SCHEDULED' } }),
      prisma.message.count({ where: { readAt: null } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { firstName: true, lastName: true } } } }),
    ]);

    const caUnpaid = facturesUnpaid.reduce((s, f) => s + Number(f.totalTTC), 0);
    const caPaid = facturesPaid.reduce((s, f) => s + Number(f.totalTTC), 0);

    // Évolution CA sur 6 mois
    const caByMonth = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const month = subMonths(now, 5 - i);
        return prisma.facture.aggregate({
          _sum: { totalTTC: true },
          where: { status: 'PAID', createdAt: { gte: startOfMonth(month), lte: endOfMonth(month) } },
        }).then((r) => ({ month: month.toISOString().slice(0, 7), total: Number(r._sum.totalTTC || 0) }));
      })
    );

    success(res, {
      clients: { total: totalClients, newThisMonth: newClientsThisMonth },
      formations: { total: totalFormations, active: activeFormations },
      devis: { pending: devisPending, accepted: devisAccepted },
      factures: { unpaidAmount: caUnpaid, paidYTD: caPaid },
      sessions: { upcoming: sessionsUpcoming },
      messages: { unread: unreadMessages },
      caByMonth,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

const clientDashboard = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
    if (!client) return success(res, {});

    const [devis, factures, inscriptions, unreadMessages, notifications] = await Promise.all([
      prisma.devis.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: 'desc' }, take: 5,
        select: { id: true, number: true, totalTTC: true, status: true, createdAt: true },
      }),
      prisma.facture.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: 'desc' }, take: 5,
        select: { id: true, number: true, totalTTC: true, status: true, dueDate: true },
      }),
      prisma.inscription.findMany({
        where: { clientId: client.id },
        include: { session: { include: { formation: { select: { title: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where: { toUserId: req.user.id, readAt: null } }),
      prisma.notification.findMany({ where: { userId: req.user.id, readAt: null }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    const facturesUnpaid = factures.filter((f) => ['SENT', 'PARTIAL', 'OVERDUE'].includes(f.status));
    success(res, { devis, factures, inscriptions, facturesUnpaid, unreadMessages, notifications });
  } catch (err) {
    next(err);
  }
};

const adminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.user.findMany({ skip: Number(skip), take: Number(limit), select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

const auditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, entity, userId } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({ where, skip: Number(skip), take: Number(limit), include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count({ where }),
    ]);
    res.json({ success: true, data, meta: { total } });
  } catch (err) {
    next(err);
  }
};

module.exports = { adminDashboard, clientDashboard, adminUsers, auditLogs };
