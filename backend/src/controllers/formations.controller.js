const prisma = require('../config/prisma');
const { success, paginate } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (req.user.role !== 'ADMIN') where.status = 'PUBLISHED';
    else if (status) where.status = status;
    if (category) where.category = category;
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [data, total] = await Promise.all([
      prisma.formation.findMany({ where, skip: Number(skip), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.formation.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const formation = await prisma.formation.findUnique({
      where: { id: req.params.id },
      include: { sessions: { orderBy: { startDate: 'asc' } }, documents: true },
    });
    if (!formation) throw new NotFoundError('Formation');
    if (req.user.role !== 'ADMIN' && formation.status !== 'PUBLISHED') throw new NotFoundError('Formation');
    success(res, formation);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const formation = await prisma.formation.create({ data: req.body });
    success(res, formation, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const exists = await prisma.formation.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new NotFoundError('Formation');
    const formation = await prisma.formation.update({ where: { id: req.params.id }, data: req.body });
    success(res, formation);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const exists = await prisma.formation.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new NotFoundError('Formation');
    await prisma.formation.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
    success(res, { message: 'Formation archivée' });
  } catch (err) {
    next(err);
  }
};

const listSessions = async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { formationId: req.params.id },
      include: { _count: { select: { inscriptions: true } } },
      orderBy: { startDate: 'asc' },
    });
    success(res, sessions);
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const session = await prisma.session.create({
      data: { ...req.body, formationId: req.params.id },
    });
    success(res, session, 201);
  } catch (err) {
    next(err);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const session = await prisma.session.update({ where: { id: req.params.sessionId }, data: req.body });
    success(res, session);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove, listSessions, createSession, updateSession };
