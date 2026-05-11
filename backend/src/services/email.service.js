const nodemailer = require('nodemailer');
const logger = require('../config/logger');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

const templates = {
  welcome: (data) => ({
    subject: 'Bienvenue sur Ad Cognita',
    html: `<p>Bonjour ${data.firstName},</p><p>Votre compte Ad Cognita a été créé avec succès. Vous pouvez dès maintenant accéder à votre espace client.</p><p>Cordialement,<br>L'équipe Ad Cognita</p>`,
  }),
  devis: (data) => ({
    subject: `Votre devis ${data.devis.number}`,
    html: `<p>Bonjour ${data.firstName},</p><p>Votre devis <strong>${data.devis.number}</strong> d'un montant de <strong>${Number(data.devis.totalTTC).toFixed(2)} € TTC</strong> est disponible dans votre espace client.</p><p>Cordialement,<br>Ad Cognita</p>`,
  }),
  facture: (data) => ({
    subject: `Votre facture ${data.facture.number}`,
    html: `<p>Bonjour ${data.firstName},</p><p>Votre facture <strong>${data.facture.number}</strong> d'un montant de <strong>${Number(data.facture.totalTTC).toFixed(2)} € TTC</strong> est disponible dans votre espace client.</p><p>Cordialement,<br>Ad Cognita</p>`,
  }),
  message: (data) => ({
    subject: `[Ad Cognita] Nouveau message : ${data.subject}`,
    html: `<p>Bonjour ${data.firstName},</p><p>Vous avez reçu un message de <strong>${data.senderName}</strong> :</p><blockquote>${data.preview}…</blockquote><p>Connectez-vous à votre espace client pour lire le message complet.</p><p>Cordialement,<br>Ad Cognita</p>`,
  }),
  resetPassword: (data) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `<p>Bonjour ${data.firstName},</p><p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe (valable 1h) :</p><p><a href="${data.baseUrl}/reset-password?token=${data.token}">Réinitialiser mon mot de passe</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
  }),
};

const sendEmail = async ({ to, subject, template, data }) => {
  if (process.env.NODE_ENV === 'test') return;
  try {
    const t = getTransporter();
    const { html, subject: tplSubject } = templates[template]?.(data) || { html: '', subject };
    await t.sendMail({
      from: process.env.EMAIL_FROM || 'Ad Cognita <contact@adcognita.fr>',
      to,
      subject: subject || tplSubject,
      html,
    });
    logger.info(`Email envoyé à ${to} — template: ${template}`);
  } catch (err) {
    logger.error(`Erreur envoi email à ${to}:`, err.message);
  }
};

module.exports = { sendEmail };
