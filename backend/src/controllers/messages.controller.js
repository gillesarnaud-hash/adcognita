const prisma = require('../config/prisma');
const { success, paginate } = require('../utils/response');
const { NotFoundError, ForbiddenError } = require('../utils/errors');
const { sendEmail } = require('../services/email.service');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, box = 'inbox' } = req.query;
    const skip = (page - 1) * limit;
    const where = box === 'sent' ? { fromUserId: req.user.id } : { toUserId: req.user.id };
    const [data, total] = await Promise.all([
      prisma.message.findMany({
        where, skip: Number(skip), take: Number(limit),
        include: {
          from: { select: { firstName: true, lastName: true, role: true } },
          to: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where }),
    ]);
    paginate(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const message = await prisma.message.findUnique({
      where: { id: req.params.id },
      include: {
        from: { select: { id: true, firstName: true, lastName: true, role: true } },
        to: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });
    if (!message) throw new NotFoundError('Message');
    if (message.fromUserId !== req.user.id && message.toUserId !== req.user.id) throw new ForbiddenError();
    if (message.toUserId === req.user.id && !message.readAt) {
      await prisma.message.update({ where: { id: message.id }, data: { readAt: new Date() } });
    }
    success(res, message);
  } catch (err) {
    next(err);
  }
};

const send = async (req, res, next) => {
  try {
    const { toUserId, subject, content } = req.body;
    const recipient = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!recipient) throw new NotFoundError('Destinataire');
    const message = await prisma.message.create({
      data: { fromUserId: req.user.id, toUserId, subject, content },
      include: {
        from: { select: { firstName: true, lastName: true } },
        to: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    await prisma.notification.create({
      data: { userId: toUserId, type: 'MESSAGE', title: 'Nouveau message', content: `${message.from.firstName} : ${subject}`, link: `/messages/${message.id}` },
    });
    await sendEmail({
      to: recipient.email,
      subject: `[Ad Cognita] Nouveau message : ${subject}`,
      template: 'message',
      data: { firstName: recipient.firstName, senderName: `${message.from.firstName} ${message.from.lastName}`, subject, preview: content.slice(0, 200) },
    });
    success(res, message, 201);
  } catch (err) {
    next(err);
  }
};

const listNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const where = { userId: req.user.id };
    if (unreadOnly === 'true') where.readAt = null;
    const notifications = await prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, readAt: null } });
    success(res, { notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

const markNotificationsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user.id, readAt: null }, data: { readAt: new Date() } });
    success(res, { message: 'Notifications marquées comme lues' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, send, listNotifications, markNotificationsRead };
