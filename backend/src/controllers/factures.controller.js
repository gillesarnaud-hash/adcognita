const prisma = require('../config/prisma');
const { success, paginate } = require('../utils/response');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/errors');
const { generateFactureNumber } = require('../utils/numbering');
const { generateFacturePDF } = require('../services/pdf.service');
const { sendEmail } = require('../services/email.service');

const factureInclude = {
  client: { include: { user: { select: { firstName: true, lastName: true, email: true } }, company: true } },
  lines: { include: { formation: { select: { id: true, title: true } } }, orderBy: { sortOrder: 'asc' } },
  paiements: { orderBy: { date: 'desc' } },
  devis: { select: { id: true, number: true } },
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
      prisma.facture.findMany({ where, skip: Number(skip), take: Number(limit), include: factureInclude, orderBy: { createdAt: 'desc' } }),
      prisma.facture.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({ where: { id: req.params.id }, include: factureInclude });
    if (!facture) throw new NotFoundError('Facture');
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      if (facture.clientId !== client?.id) throw new ForbiddenError();
    }
    success(res, facture);
  } catch (err) {
    next(err);
  }
};

const createFromDevis = async (req, res, next) => {
  try {
    const devis = await prisma.devis.findUnique({ where: { id: req.params.devisId }, include: { lines: true } });
    if (!devis) throw new NotFoundError('Devis');
    if (devis.status !== 'ACCEPTED') throw new ValidationError('Le devis doit être accepté pour être facturé');
    const number = await generateFactureNumber();
    const { dueDate, notes } = req.body;
    const facture = await prisma.facture.create({
      data: {
        number,
        devisId: devis.id,
        clientId: devis.clientId,
        totalHT: devis.totalHT,
        tvaRate: devis.tvaRate,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        lines: {
          create: devis.lines.map((l) => ({
            formationId: l.formationId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            total: l.total,
            sortOrder: l.sortOrder,
          })),
        },
      },
      include: factureInclude,
    });
    success(res, facture, 201);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { clientId, lines, tvaRate = 20, dueDate, notes } = req.body;
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundError('Client');
    const number = await generateFactureNumber();
    const totalHT = lines.reduce((s, l) => s + Number(l.unitPrice) * l.quantity, 0);
    const totalTVA = parseFloat((totalHT * (tvaRate / 100)).toFixed(2));
    const totalTTC = parseFloat((totalHT + totalTVA).toFixed(2));
    const facture = await prisma.facture.create({
      data: {
        number, clientId, totalHT, tvaRate, totalTVA, totalTTC,
        dueDate: dueDate ? new Date(dueDate) : null, notes,
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
      include: factureInclude,
    });
    success(res, facture, 201);
  } catch (err) {
    next(err);
  }
};

const send = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({ where: { id: req.params.id }, include: factureInclude });
    if (!facture) throw new NotFoundError('Facture');
    const updated = await prisma.facture.update({ where: { id: req.params.id }, data: { status: 'SENT' }, include: factureInclude });
    await sendEmail({
      to: facture.client.user.email,
      subject: `Votre facture ${facture.number} — Ad Cognita`,
      template: 'facture',
      data: { facture, firstName: facture.client.user.firstName },
    });
    success(res, updated);
  } catch (err) {
    next(err);
  }
};

const addPaiement = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({ where: { id: req.params.id }, include: { paiements: true } });
    if (!facture) throw new NotFoundError('Facture');
    if (facture.status === 'CANCELLED') throw new ValidationError('Facture annulée');
    const paiement = await prisma.paiement.create({
      data: { factureId: req.params.id, ...req.body, date: req.body.date ? new Date(req.body.date) : new Date() },
    });
    const totalPaid = facture.paiements.reduce((s, p) => s + Number(p.amount), 0) + Number(req.body.amount);
    const newStatus = totalPaid >= Number(facture.totalTTC) ? 'PAID' : 'PARTIAL';
    await prisma.facture.update({ where: { id: req.params.id }, data: { status: newStatus } });
    success(res, paiement, 201);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({ where: { id: req.params.id } });
    if (!facture) throw new NotFoundError('Facture');
    if (facture.status === 'PAID') throw new ValidationError('Une facture payée ne peut être annulée que par avoir');
    await prisma.facture.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
    success(res, { message: 'Facture annulée' });
  } catch (err) {
    next(err);
  }
};

const downloadPDF = async (req, res, next) => {
  try {
    const facture = await prisma.facture.findUnique({ where: { id: req.params.id }, include: factureInclude });
    if (!facture) throw new NotFoundError('Facture');
    const pdfBuffer = await generateFacturePDF(facture);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${facture.number}.pdf"` });
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, createFromDevis, send, addPaiement, cancel, downloadPDF };
