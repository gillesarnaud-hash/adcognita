const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { success, paginate } = require('../utils/response');
const { NotFoundError, ConflictError } = require('../utils/errors');

const clientInclude = {
  user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, lastLoginAt: true, createdAt: true } },
  company: true,
  _count: { select: { devis: true, factures: true, inscriptions: true } },
};

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ];
    const [data, total] = await Promise.all([
      prisma.client.findMany({ where, skip: Number(skip), take: Number(limit), include: clientInclude, orderBy: { createdAt: 'desc' } }),
      prisma.client.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: { ...clientInclude, devis: { orderBy: { createdAt: 'desc' }, take: 5 }, factures: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!client) throw new NotFoundError('Client');
    success(res, client);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, companyId, status, notes } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictError('Cet email est déjà utilisé');
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed, firstName, lastName, phone, role: 'CLIENT' } });
    const client = await prisma.client.create({
      data: { userId: user.id, companyId, status: status || 'prospect', notes },
      include: clientInclude,
    });
    success(res, client, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) throw new NotFoundError('Client');
    const { firstName, lastName, phone, companyId, status, notes } = req.body;
    const [updatedClient] = await prisma.$transaction([
      prisma.client.update({ where: { id: req.params.id }, data: { companyId, status, notes }, include: clientInclude }),
      prisma.user.update({ where: { id: client.userId }, data: { firstName, lastName, phone } }),
    ]);
    success(res, updatedClient);
  } catch (err) {
    next(err);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) throw new NotFoundError('Client');
    await prisma.user.update({ where: { id: client.userId }, data: { isActive: false } });
    await prisma.client.update({ where: { id: req.params.id }, data: { status: 'inactive' } });
    success(res, { message: 'Client désactivé' });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({
      where: { userId: req.user.id },
      include: clientInclude,
    });
    if (!client) throw new NotFoundError('Profil client');
    success(res, client);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, deactivate, getMyProfile };
