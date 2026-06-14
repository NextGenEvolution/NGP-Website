import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';

// ── helpers ──
const ZAR = (n) => 'R' + Number(n).toLocaleString('en-ZA');

function makeInvoiceNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rnd = (Date.now().toString(36) + Math.random().toString(36).slice(2, 5)).slice(-5).toUpperCase();
  return `INV-${ymd}-${rnd}`;
}

// ── build the branded PDF invoice (server-side) ──
export async function buildInvoicePdf({ items, customer, invoiceNo, subtotal, delivery, grand, logoBytes }) {
  const pdf = await PDFDocument.create();
  // Compact, content-fitted page height (single full page — no wasted space / phantom 2nd page)
  const billBottom = 132 + 28 + 12 * 4 + (customer.notes ? 12 : 0); // bill-to block bottom
  const detailsBottom = 132 + 14 + 13 * 4;                          // invoice-details block bottom
  let _y = Math.max(billBottom, detailsBottom) + 12;                // table start
  _y += 24;                  // table header
  _y += items.length * 30;   // item rows
  _y += 56;                  // totals block
  _y += 28 + 92;             // gap + banking box
  const pageHeight = _y + 34; // footer + bottom margin
  const page = pdf.addPage([595.28, pageHeight]);
  const { width: W, height: H } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const cyan = rgb(45 / 255, 184 / 255, 216 / 255);
  const navy = rgb(4 / 255, 12 / 255, 24 / 255);
  const dark = rgb(28 / 255, 38 / 255, 52 / 255);
  const gray = rgb(110 / 255, 130 / 255, 160 / 255);
  const soft = rgb(247 / 255, 249 / 255, 251 / 255);
  const lineC = rgb(0.88, 0.9, 0.93);
  const white = rgb(1, 1, 1);

  const L = 40, R = W - 40;
  const T = (y) => H - y; // top-based y helper
  const right = (text, xr, yTop, size, f, color) => {
    const w = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x: xr - w, y: T(yTop), size, font: f, color });
  };
  const center = (text, xc, yTop, size, f, color) => {
    const w = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x: xc - w / 2, y: T(yTop), size, font: f, color });
  };
  const left = (text, x, yTop, size, f, color) => page.drawText(text, { x, y: T(yTop), size, font: f, color });

  // header band
  page.drawRectangle({ x: 0, y: H - 100, width: W, height: 100, color: navy });
  if (logoBytes) {
    try {
      const png = await pdf.embedPng(logoBytes);
      const dim = png.scale(64 / png.height);
      page.drawImage(png, { x: L, y: H - 18 - dim.height, width: dim.width, height: dim.height });
    } catch (e) { /* ignore logo failure */ }
  }
  const hx = L + 76;
  left('NEXT GEN EVOLUTION', hx, 44, 18, bold, white);
  left('SCIENCE · STRENGTH · TRANSFORMATION', hx, 58, 7.5, font, cyan);
  left('sales@nextgenevolution.co.za', hx, 72, 8, font, rgb(0.72, 0.78, 0.86));
  left('www.nextgenevolution.co.za', hx, 84, 8, font, rgb(0.72, 0.78, 0.86));
  right('INVOICE', R, 48, 24, bold, white);
  right(invoiceNo, R, 64, 10, font, cyan);

  // BILL TO + INVOICE DETAILS
  let y = 132;
  left('BILL TO', L, y, 8.5, bold, gray);
  let by = y + 14;
  left(`${customer.firstname || ''} ${customer.lastname || ''}`.trim(), L, by, 11, bold, dark); by += 14;
  left(customer.email || '', L, by, 9, font, gray); by += 12;
  left(customer.phone || '', L, by, 9, font, gray); by += 12;
  left(customer.address || '', L, by, 9, font, gray); by += 12;
  left(`${customer.city || ''}, ${customer.province || ''}, ${customer.postal || ''}`, L, by, 9, font, gray); by += 12;
  if (customer.notes) { left(`Notes: ${customer.notes}`, L, by, 9, font, gray); by += 12; }

  const rx = R - 170;
  let ry = y;
  left('INVOICE DETAILS', rx, ry, 8.5, bold, gray); ry += 14;
  const kv = (k, v) => { left(k, rx, ry, 9, font, gray); right(v, R, ry, 9, bold, dark); ry += 13; };
  kv('Invoice No.', invoiceNo);
  kv('Date', new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }));
  kv('Reference', invoiceNo);
  kv('Status', 'AWAITING PAYMENT');

  y = Math.max(by, ry) + 12;

  // items table header — bar spans top-coords [y, y+18]; text baseline centered at y+12
  page.drawRectangle({ x: L, y: T(y + 18), width: R - L, height: 18, color: cyan });
  const hb = y + 12;
  left('DESCRIPTION', L + 6, hb, 8.5, bold, navy);
  center('QTY', 330, hb, 8.5, bold, navy);
  right('UNIT', 450, hb, 8.5, bold, navy);
  right('AMOUNT', R - 6, hb, 8.5, bold, navy);
  y += 24;

  items.forEach((i, idx) => {
    const lineTotal = i.price * i.qty;
    const rowH = 30;
    if (idx % 2 === 0) page.drawRectangle({ x: L, y: T(y + rowH - 6) , width: R - L, height: rowH, color: soft });
    left(i.name, L + 6, y + 6, 10, bold, dark);
    left(`${(i.type || '').toUpperCase()} · ${i.dose || ''}`, L + 6, y + 18, 7.5, font, gray);
    center(String(i.qty), 330, y + 11, 10, font, dark);
    right(ZAR(i.price), 450, y + 11, 10, font, dark);
    right(ZAR(lineTotal), R - 6, y + 11, 10, bold, dark);
    y += rowH;
    page.drawLine({ start: { x: L, y: T(y - 6) }, end: { x: R, y: T(y - 6) }, thickness: 0.5, color: lineC });
  });

  // totals
  y += 14;
  const tx = R - 200;
  left('Subtotal', tx, y, 10, font, gray); right(ZAR(subtotal), R - 6, y, 10, font, dark); y += 16;
  left('Delivery', tx, y, 10, font, gray); right(delivery === 0 ? 'FREE' : ZAR(delivery), R - 6, y, 10, font, dark); y += 10;
  page.drawLine({ start: { x: tx, y: T(y) }, end: { x: R - 6, y: T(y) }, thickness: 1, color: cyan }); y += 16;
  left('TOTAL DUE', tx, y, 12, bold, navy); right(ZAR(grand) + ' ZAR', R - 6, y, 12, bold, cyan);

  // banking box
  y += 28;
  const boxH = 92;
  page.drawRectangle({ x: L, y: T(y + boxH), width: R - L, height: boxH, color: soft, borderColor: cyan, borderWidth: 1 });
  left('BANKING DETAILS', L + 12, y + 18, 9, bold, cyan);
  let bk = y + 36; const bx = L + 12;
  const bank = (k, v) => { left(k, bx, bk, 9, font, gray); left(v, bx + 95, bk, 9, bold, dark); bk += 14; };
  bank('Bank', 'FNB');
  bank('Account Name', 'Next Gen Evolution (Pty) Ltd');
  bank('Account Number', '63150208940');
  bank('Branch Code', '250655');
  const px = L + 300;
  left('USE THIS PAYMENT REFERENCE', px, y + 22, 8.5, font, gray);
  left(invoiceNo, px, y + 40, 13, bold, cyan);
  left('Please quote this reference on your EFT', px, y + 58, 7.5, font, gray);
  left('so we can match your payment to this order.', px, y + 70, 7.5, font, gray);

  // footer (pinned just below the banking box on the compact page)
  const fy = H - 12;
  page.drawLine({ start: { x: L, y: T(fy - 10) }, end: { x: R, y: T(fy - 10) }, thickness: 0.5, color: lineC });
  left('For research use only · Not for human consumption without medical supervision.', L, fy, 7.5, font, gray);
  right('Thank you — Next Gen Evolution', R, fy, 7.5, font, gray);

  return await pdf.save();
}

function buildEmailText({ items, customer, invoiceNo, subtotal, delivery, grand }) {
  const sep = '─'.repeat(44);
  const lines = items.map((i, n) => [
    `${n + 1}. ${i.name}  (x${i.qty})  —  ${ZAR(i.price * i.qty)}`,
    `   Form: ${(i.type || '').toUpperCase()}   |   Dose: ${i.dose || '—'}`,
    i.category ? `   Category: ${i.category}` : '',
    i.desc ? `   ${i.desc}` : '',
  ].filter(Boolean).join('\n')).join('\n\n');
  return [
    `NEW ORDER — INVOICE ${invoiceNo}`,
    `Date: ${new Date().toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'short' })}`,
    '', sep, 'CUSTOMER DETAILS', sep,
    `Name:     ${customer.firstname} ${customer.lastname}`,
    `Email:    ${customer.email}`,
    `Phone:    ${customer.phone}`,
    '', 'DELIVERY ADDRESS',
    `${customer.address}`,
    `${customer.city}, ${customer.province}, ${customer.postal}`,
    customer.notes ? `Notes: ${customer.notes}` : '',
    '', sep, 'ORDER ITEMS', sep, lines, '',
    sep,
    `Subtotal:   ${ZAR(subtotal)}`,
    delivery === 0 ? 'Delivery:   FREE (order over R3,000)' : `Delivery:   ${ZAR(delivery)}`,
    `TOTAL DUE:  ${ZAR(grand)} ZAR`,
    sep, '',
    'BANKING DETAILS',
    'Bank:            FNB',
    'Account Name:    Next Gen Evolution (Pty) Ltd',
    'Account Number:  63150208940',
    'Branch Code:     250655',
    `Payment Ref:     ${invoiceNo}`,
    '', 'The branded PDF invoice is attached.',
  ].filter((l) => l !== null).join('\n');
}

// ── Netlify Function handler ──
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    const items = Array.isArray(data.items) ? data.items : [];
    const customer = data.customer || {};
    if (!items.length || !customer.email || !customer.firstname) {
      return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok: false, error: 'Invalid order data' }) };
    }

    const subtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    const delivery = subtotal >= 3000 ? 0 : 100;
    const grand = subtotal + delivery;
    const invoiceNo = makeInvoiceNumber();

    // fetch the logo from the deployed site (best-effort)
    let logoBytes = null;
    try {
      const site = process.env.URL || process.env.DEPLOY_PRIME_URL;
      if (site) {
        const res = await fetch(site + '/NGE%20Transparent%20logo.png');
        if (res.ok) logoBytes = new Uint8Array(await res.arrayBuffer());
      }
    } catch (e) { /* logo optional */ }

    const pdfBytes = await buildInvoicePdf({ items, customer, invoiceNo, subtotal, delivery, grand, logoBytes });
    const text = buildEmailText({ items, customer, invoiceNo, subtotal, delivery, grand });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Next Gen Evolution Orders" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_TO || 'sales@nextgenevolution.co.za',
      replyTo: customer.email,
      subject: `New Order ${invoiceNo} — ${ZAR(grand)} ZAR`,
      text,
      attachments: [{ filename: `${invoiceNo}.pdf`, content: Buffer.from(pdfBytes), contentType: 'application/pdf' }],
    });

    // Note: invoiceNo intentionally NOT returned to the client (background only)
    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('send-order error:', err);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ ok: false, error: 'Could not process order' }) };
  }
};

function cors() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
