/* ============================================================
   Quote document — on-screen preview + real PDF download.
   PDF is generated client-side with jsPDF (loaded from CDN).
   ============================================================ */

const QuoteDoc = (() => {

  const BRAND = [29, 78, 216];     // accent blue
  const INK   = [17, 24, 39];
  const MUTED = [138, 145, 158];
  const BODY  = [60, 68, 82];

  const COMPANY = {
    name: 'INTEL SURVEILLANCE',
    tagline: 'Commercial Alarm · Fire · CCTV',
    licensed: 'Licensed NY · NJ · PA · DE · MD · VA',
    contact: 'dispatch@intelsurveillance.com  ·  (410) 555-0100',
  };

  const TERMS = 'This quote is valid for 30 days from the date above. Pricing includes materials, installation labor, and standard functional testing. Permits and after-hours or escorted site access, where required, are billed separately. A 50% deposit is due on acceptance with the balance on completion. All work carries a 1-year parts & labor warranty.';

  function fmtDate(d) {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  /* Same dates used by the on-screen document and the PDF. */
  function meta() {
    const today = new Date();
    const valid = new Date(today.getTime() + 30 * 86400000);
    return { date: fmtDate(today), valid: fmtDate(valid) };
  }

  function ready() { return !!(window.jspdf && window.jspdf.jsPDF); }

  function download(q) {
    if (!q) return;
    if (!ready()) { if (window.App) App.toast('PDF engine still loading — try again in a moment'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const W = doc.internal.pageSize.getWidth();   // 612
    const M = 54;
    const RIGHT = W - M;
    const m = meta();

    // top accent bar
    doc.setFillColor(...BRAND);
    doc.rect(0, 0, W, 7, 'F');

    let y = 66;

    // company block (left)
    doc.setFont('helvetica', 'bold').setFontSize(19).setTextColor(...INK);
    doc.text(COMPANY.name, M, y);
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED);
    doc.text(COMPANY.tagline, M, y + 15);
    doc.text(COMPANY.licensed, M, y + 27);
    doc.text(COMPANY.contact, M, y + 39);

    // QUOTE block (right)
    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...BRAND);
    doc.text('QUOTE', RIGHT, y, { align: 'right' });
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...BODY);
    doc.text('Quote #  ' + q.id, RIGHT, y + 17, { align: 'right' });
    doc.text('Date  ' + m.date, RIGHT, y + 30, { align: 'right' });
    doc.text('Valid until  ' + m.valid, RIGHT, y + 43, { align: 'right' });

    y += 74;
    doc.setDrawColor(225, 228, 233).setLineWidth(1);
    doc.line(M, y, RIGHT, y);

    y += 28;
    // prepared for (left)
    doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...MUTED);
    doc.text('PREPARED FOR', M, y);
    doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...INK);
    doc.text(q.company, M, y + 18);
    doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...BODY);
    doc.text('Attn: ' + q.contact, M, y + 33);
    if (q.address) doc.text(q.address, M, y + 46);

    // scope (right)
    doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...MUTED);
    doc.text('SCOPE OF WORK', RIGHT, y, { align: 'right' });
    doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...BODY);
    doc.text(doc.splitTextToSize(q.title, 230), RIGHT, y + 16, { align: 'right' });

    y += 74;
    // table header
    doc.setFillColor(246, 247, 249);
    doc.rect(M, y, RIGHT - M, 26, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(90, 98, 110);
    doc.text('DESCRIPTION', M + 12, y + 17);
    doc.text('AMOUNT', RIGHT - 12, y + 17, { align: 'right' });
    y += 26;

    // rows
    doc.setFont('helvetica', 'normal').setFontSize(10);
    q.lines.forEach(l => {
      const wrapped = doc.splitTextToSize(l.d, RIGHT - M - 130);
      const rowH = Math.max(26, wrapped.length * 13 + 12);
      doc.setTextColor(...BODY);
      doc.text(wrapped, M + 12, y + 17);
      doc.setTextColor(...INK).setFont('helvetica', 'bold');
      doc.text(l.a, RIGHT - 12, y + 17, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += rowH;
      doc.setDrawColor(238, 240, 243);
      doc.line(M, y, RIGHT, y);
    });

    // total box
    y += 16;
    const boxW = 230, boxX = RIGHT - boxW;
    doc.setFillColor(...BRAND);
    doc.roundedRect(boxX, y, boxW, 40, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal').setFontSize(10);
    doc.text('Project total', boxX + 16, y + 24);
    doc.setFont('helvetica', 'bold').setFontSize(16);
    doc.text(q.total, boxX + boxW - 16, y + 26, { align: 'right' });

    y += 66;
    // terms
    doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...MUTED);
    doc.text('TERMS', M, y);
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...BODY);
    doc.text(doc.splitTextToSize(TERMS, RIGHT - M), M, y + 14);

    // acceptance signature line
    y += 96;
    doc.setDrawColor(190, 196, 205);
    doc.line(M, y, M + 220, y);
    doc.line(RIGHT - 160, y, RIGHT, y);
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED);
    doc.text('Authorized signature', M, y + 13);
    doc.text('Date', RIGHT - 160, y + 13);

    // footer
    const FY = doc.internal.pageSize.getHeight() - 40;
    doc.setDrawColor(232, 234, 238);
    doc.line(M, FY, RIGHT, FY);
    doc.setFontSize(7.5).setTextColor(...MUTED);
    doc.text(COMPANY.name + '  ·  ' + COMPANY.contact, M, FY + 14);
    doc.text('Prepared by AutoNestLabs', RIGHT, FY + 14, { align: 'right' });

    doc.save('Intel-Surveillance-Quote-' + q.id + '.pdf');
    if (window.App) App.toast('PDF downloaded — Intel-Surveillance-Quote-' + q.id + '.pdf');
  }

  return { download, meta, ready, TERMS, COMPANY };
})();
