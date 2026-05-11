const prisma = require('../config/prisma');
const { success, paginate } = require('../utils/response');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');
const { generateDevisNumber } = require('../utils/numbering');
const { generateDevisPDF } = require('../services/pdf.service');
const { sendEmail } = require('../services/email.service');

const devisInclude = {
  client: { include: { user: { select: { firstName: true, lastName: true, email: true } }, company: true } },
  lines: { include: { formation: { select: { id: true, title: true } } }, orderBy: { sortOrder: 'asc' } },
};

const computeTotals = (lines, tvaRate) => {
  const totalHT = lines.reduce((sum, l) => sum + Number(l.unitPrice) * l.quantity, 0);
  const totalTVA = totalHT * (Number(tvaRate) / 100);
  const totalTTC = totalHT + totalTVA;
  return { totalHT, totalTVA: parseFloat(totalTVA.toFixed(2)), totalTTC: parseFloat(totalTTC.toFixed(2)) };
};

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, clientId } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      where.clientId = client?.id;
    } else {
      if (clientId) where.clientId = clientId;
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.devis.findMany({ where, skip: Number(skip), take: Number(limit), include: devisInclude, orderBy: { createdAt: 'desc' } }),
      prisma.devis.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.id }, include: devisInclude });
    if (!devis) throw new NotFoundError('Devis');
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      if (devis.clientId !== client?.id) throw new ForbiddenError();
    }
    success(res, devis);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { clientId, lines, tvaRate = 20, validUntil, notes } = req.body;
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundError('Client');
    const number = await generateDevisNumber();
    const { totalHT, totalTVA, totalTTC } = computeTotals(lines, tvaRate);

    const devis = await prisma.devis.create({
      data: {
        number,
        clientId,
        totalHT,
        tvaRate,
        totalTVA,
        totalTTC,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes,
        lines: {
          create: lines.map((l, i) => ({
            formationId: l.formationId || null,
            description: l.description,
            quantity: l.quantity || 1,
            unitPrice: l.unitPrice,
            total: Number(l.unitPrice) * (l.quantity || 1),
            sortOrder: i,
          })),
        },
      },
      include: devisInclude,
    });
    success(res, devis, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await prisma.devis.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new NotFoundError('Devis');
    if (['ACCEPTED', 'REJECTED'].includes(existing.status)) {
      throw new ValidationError('Ce devis ne peut plus être modifié');
    }
    const { lines, tvaRate = existing.tvaRate, validUntil, notes, status } = req.body;
    let totals = {};
    if (lines) {
      totals = computeTotals(lines, tvaRate);
      await prisma.devisLine.deleteMany({ where: { devisId: req.params.id } });
    }

    const devis = await prisma.devis.update({
      where: { id: req.params.id },
      data: {
        ...totals,
        tvaRate,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        notes,
        status,
        ...(lines && {
          lines: {
            create: lines.map((l, i) => ({
              formationId: l.formationId || null,
              description: l.description,
              quantity: l.quantity || 1,
              unitPrice: l.unitPrice,
              total: Number(l.unitPrice) * (l.quantity || 1),
              sortOrder: i,
            })),
          },
        }),
      },
      include: devisInclude,
    });
    success(res, devis);
  } catch (err) {
    next(err);
  }
};

const send = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.id }, include: devisInclude });
    if (!devis) throw new NotFoundError('Devis');
    const updated = await prisma.devis.update({ where: { id: req.params.id }, data: { status: 'SENT' }, include: devisInclude });
    await sendEmail({
      to: devis.client.user.email,
      subject: `Votre devis ${devis.number} — Ad Cognita`,
      template: 'devis',
      data: { devis, firstName: devis.client.user.firstName },
    });
    success(res, updated);
  } catch (err) {
    next(err);
  }
};

const accept = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.id } });
    if (!devis) throw new NotFoundError('Devis');
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      if (devis.clientId !== client?.id) throw new ForbiddenError();
    }
    if (devis.status !== 'SENT') throw new ValidationError('Seul un devis envoyé peut être accepté');
    const updated = await prisma.devis.update({ where: { id: req.params.id }, data: { status: 'ACCEPTED' }, include: devisInclude });
    success(res, updated);
  } catch (err) {
    next(err);
  }
};

const reject = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.id } });
    if (!devis) throw new NotFoundError('Devis');
    if (devis.status !== 'SENT') throw new ValidationError('Seul un devis envoyé peut être refusé');
    const updated = await prisma.devis.update({ where: { id: req.params.id }, data: { status: 'REJECTED' } });
    success(res, updated);
  } catch (err) {
    next(err);
  }
};

const downloadPDF = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.id }, include: devisInclude });
    if (!devis) throw new NotFoundError('Devis');
    const pdfBuffer = await generateDevisPDF(devis);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${devis.number}.pdf"` });
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, send, accept, reject, downloadPDF };
