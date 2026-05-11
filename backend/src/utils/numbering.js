const prisma = require('../config/prisma');
const { format } = require('date-fns');

async function generateDevisNumber() {
  const year = format(new Date(), 'yyyy');
  const prefix = `DEV-${year}-`;
  const last = await prisma.devis.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: 'desc' },
  });
  const seq = last ? parseInt(last.number.split('-').pop(), 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, '0')}`;
}

async function generateFactureNumber() {
  const year = format(new Date(), 'yyyy');
  const prefix = `FAC-${year}-`;
  const last = await prisma.facture.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: 'desc' },
  });
  const seq = last ? parseInt(last.number.split('-').pop(), 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, '0')}`;
}

module.exports = { generateDevisNumber, generateFactureNumber };
