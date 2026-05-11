const prisma = require('../config/prisma');
const { success, paginate } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { siret: { contains: search } }] }
      : {};
    const [data, total] = await Promise.all([
      prisma.company.findMany({ where, skip: Number(skip), take: Number(limit), include: { _count: { select: { clients: true, contacts: true } } }, orderBy: { name: 'asc' } }),
      prisma.company.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { clients: { include: { user: { select: { firstName: true, lastName: true, email: true } } } }, contacts: true },
    });
    if (!company) throw new NotFoundError('Entreprise');
    success(res, company);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const company = await prisma.company.create({ data: req.body });
    success(res, company, 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const exists = await prisma.company.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new NotFoundError('Entreprise');
    const company = await prisma.company.update({ where: { id: req.params.id }, data: req.body });
    success(res, company);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const exists = await prisma.company.findUnique({ where: { id: req.params.id } });
    if (!exists) throw new NotFoundError('Entreprise');
    await prisma.company.delete({ where: { id: req.params.id } });
    success(res, { message: 'Entreprise supprimée' });
  } catch (err) {
    next(err);
  }
};

const listContacts = async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({ where: { companyId: req.params.id }, orderBy: { isPrimary: 'desc' } });
    success(res, contacts);
  } catch (err) {
    next(err);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact.create({ data: { ...req.body, companyId: req.params.id } });
    success(res, contact, 201);
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact.update({ where: { id: req.params.contactId }, data: req.body });
    success(res, contact);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove, listContacts, createContact, updateContact };
