const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');

const fmt = (n) => Number(n).toFixed(2).replace('.', ',') + ' €';
const fmtDate = (d) => d ? format(new Date(d), 'dd/MM/yyyy', { locale: fr }) : '—';

const buildDocument = (doc, { title, number, client, lines, totalHT, tvaRate, totalTVA, totalTTC, date, extra = {} }) => {
  const green = '#2d6a4f';
  const light = '#f5f5f5';

  // Header
  doc.rect(0, 0, 595, 80).fill(green);
  doc.fillColor('white').fontSize(20).font('Helvetica-Bold').text('Ad Cognita', 40, 24);
  doc.fontSize(9).font('Helvetica').text('Organisme de formation professionnelle', 40, 48);
  doc.fillColor('white').fontSize(9).text('contact@adcognita.fr', 400, 30, { align: 'right', width: 155 });
  doc.text('www.adcognita.fr', 400, 44, { align: 'right', width: 155 });

  // Title band
  doc.fillColor(green).fontSize(16).font('Helvetica-Bold').text(title, 40, 100);
  doc.fillColor('#666').fontSize(10).font('Helvetica').text(`N° ${number}`, 40, 122);
  doc.text(`Date : ${fmtDate(date)}`, 400, 100, { align: 'right', width: 155 });
  if (extra.validUntil) doc.text(`Valide jusqu'au : ${fmtDate(extra.validUntil)}`, 400, 115, { align: 'right', width: 155 });
  if (extra.dueDate) doc.text(`Échéance : ${fmtDate(extra.dueDate)}`, 400, 115, { align: 'right', width: 155 });

  // Client block
  doc.rect(40, 148, 250, 80).fill(light);
  doc.fillColor('#333').fontSize(9).font('Helvetica-Bold').text('DESTINATAIRE', 52, 156);
  doc.font('Helvetica').text(`${client.user.firstName} ${client.user.lastName}`, 52, 170);
  if (client.company) doc.text(client.company.name, 52, 183);
  doc.text(client.user.email, 52, client.company ? 196 : 183);

  // Lines table header
  const tableTop = 250;
  doc.rect(40, tableTop, 515, 22).fill(green);
  doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
  doc.text('Description', 50, tableTop + 7);
  doc.text('Qté', 360, tableTop + 7, { width: 40, align: 'center' });
  doc.text('P.U. HT', 405, tableTop + 7, { width: 65, align: 'right' });
  doc.text('Total HT', 475, tableTop + 7, { width: 70, align: 'right' });

  // Lines
  let y = tableTop + 22;
  lines.forEach((line, i) => {
    if (i % 2 === 0) doc.rect(40, y, 515, 20).fill('#fafafa');
    doc.fillColor('#333').fontSize(9).font('Helvetica');
    doc.text(line.description, 50, y + 6, { width: 305 });
    doc.text(String(line.quantity), 360, y + 6, { width: 40, align: 'center' });
    doc.text(fmt(line.unitPrice), 405, y + 6, { width: 65, align: 'right' });
    doc.text(fmt(line.total), 475, y + 6, { width: 70, align: 'right' });
    y += 20;
  });

  // Totals
  y += 16;
  doc.rect(350, y, 205, 20).fill(light);
  doc.fillColor('#333').fontSize(9).font('Helvetica').text('Total HT', 360, y + 6).text(fmt(totalHT), 475, y + 6, { width: 70, align: 'right' });
  y += 20;
  doc.rect(350, y, 205, 20).fill(light);
  doc.text(`TVA (${tvaRate}%)`, 360, y + 6).text(fmt(totalTVA), 475, y + 6, { width: 70, align: 'right' });
  y += 20;
  doc.rect(350, y, 205, 24).fill(green);
  doc.fillColor('white').font('Helvetica-Bold').text('TOTAL TTC', 360, y + 8).text(fmt(totalTTC), 475, y + 8, { width: 70, align: 'right' });

  // Footer
  doc.fillColor('#999').fontSize(8).font('Helvetica').text(
    'Ad Cognita — SIRET : 000 000 000 00000 — N° de déclaration d\'activité : 00 00 00000 00 — certifié Qualiopi',
    40, 760, { align: 'center', width: 515 }
  );
};

const generateDevisPDF = (devis) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    buildDocument(doc, { title: 'DEVIS', number: devis.number, client: devis.client, lines: devis.lines, totalHT: devis.totalHT, tvaRate: devis.tvaRate, totalTVA: devis.totalTVA, totalTTC: devis.totalTTC, date: devis.createdAt, extra: { validUntil: devis.validUntil } });
    doc.end();
  });

const generateFacturePDF = (facture) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    buildDocument(doc, { title: 'FACTURE', number: facture.number, client: facture.client, lines: facture.lines, totalHT: facture.totalHT, tvaRate: facture.tvaRate, totalTVA: facture.totalTVA, totalTTC: facture.totalTTC, date: facture.createdAt, extra: { dueDate: facture.dueDate } });
    doc.end();
  });

module.exports = { generateDevisPDF, generateFacturePDF };
