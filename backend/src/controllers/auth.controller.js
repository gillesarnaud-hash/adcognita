const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { success } = require('../utils/response');
const { UnauthorizedError, ConflictError, NotFoundError, ValidationError } = require('../utils/errors');
const { sendEmail } = require('../services/email.service');

const signAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

const signRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictError('Cet email est déjà utilisé');

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName, phone, role: 'CLIENT' },
    });
    await prisma.client.create({ data: { userId: user.id } });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await sendEmail({
      to: user.email,
      subject: 'Bienvenue sur Ad Cognita',
      template: 'welcome',
      data: { firstName: user.firstName },
    });

    success(res, { accessToken, refreshToken, user: publicUser(user) }, 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedError('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Email ou mot de passe incorrect');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    success(res, { accessToken, refreshToken, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new UnauthorizedError('Refresh token manquant');

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new UnauthorizedError('Refresh token invalide');
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Session expirée');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) throw new UnauthorizedError();

    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    await prisma.refreshToken.create({
      data: {
        token: newRefresh,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    success(res, { accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    success(res, { message: 'Déconnecté' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    // Ne pas révéler si l'email existe
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExpires: expires },
      }).catch(() => {}); // champ optionnel selon migration
      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        template: 'resetPassword',
        data: { firstName: user.firstName, token, baseUrl: process.env.FRONTEND_URL },
      });
    }
    success(res, { message: 'Si cet email existe, un lien a été envoyé.' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { client: { include: { company: true } } },
    });
    success(res, publicUser(user));
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, phone },
    });
    success(res, publicUser(user));
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new ValidationError('Mot de passe actuel incorrect');
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    success(res, { message: 'Mot de passe mis à jour' });
  } catch (err) {
    next(err);
  }
};

const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone,
  role: u.role,
  isActive: u.isActive,
  lastLoginAt: u.lastLoginAt,
  createdAt: u.createdAt,
  client: u.client,
});

module.exports = { register, login, refresh, logout, forgotPassword, getMe, updateMe, changePassword };
