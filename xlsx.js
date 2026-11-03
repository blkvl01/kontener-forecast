// Kis .xlsx-író a böngészőben (a CSP miatt külső könyvtár nem tölthető): stílusregiszter, munkalapok, ZIP (tömörítés nélkül).
// Használat: KFXlsx.book([{ name, cols, rows, freeze, filter, landscape }]) → Blob.
// Cella: null | { v, s, f } — v: szám vagy szöveg, s: stílusleíró, f: képlet (angol függvénynév, v a gyorsítótárazott érték).
(() => {
  'use strict';

  const xml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
    // XML-ben tiltott vezérlőkarakterek
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const colName = n => { let s = ''; for (n += 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s; return s; };

  // ---------- stílusok ----------
  function Styles() {
    const fonts = ['<font><sz val="10"/><color rgb="FF1F2430"/><name val="Calibri"/><family val="2"/></font>'];
    const fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
    const borders = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
    const fmts = [];
    const xfs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
    const memo = new Map();
    const idx = (list, x) => { let i = list.indexOf(x); if (i < 0) { list.push(x); i = list.length - 1; } return i; };
    const BUILTIN = { General: 0, '0': 1, '0.00': 2, '#,##0': 3, '#,##0.00': 4, '0%': 9 };
    function fmtId(code) {
      if (code == null) return 0;
      if (code in BUILTIN) return BUILTIN[code];
      let i = fmts.indexOf(code);
      if (i < 0) { fmts.push(code); i = fmts.length - 1; }
      return 164 + i;
    }
    const side = (n, b) => (b ? `<${n} style="${b.style || 'thin'}"><color rgb="${b.color || 'FF1F2430'}"/></${n}>` : `<${n}/>`);
    function id(st) {
      if (!st) return 0;
      const key = JSON.stringify(st);
      if (memo.has(key)) return memo.get(key);
      const f = st.font || {};
      const font = `<font>${f.b ? '<b/>' : ''}${f.i ? '<i/>' : ''}<sz val="${f.sz || 10}"/><color rgb="${f.color || 'FF1F2430'}"/><name val="${f.name || 'Calibri'}"/><family val="${f.name && /Consolas|Mono/.test(f.name) ? 3 : 2}"/></font>`;
      const fontId = idx(fonts, font);
      const fillId = st.fill ? idx(fills, `<fill><patternFill patternType="solid"><fgColor rgb="${st.fill}"/><bgColor indexed="64"/></patternFill></fill>`) : 0;
      const b = st.border || {};
      const borderId = st.border ? idx(borders, `<border>${side('left', b.left)}${side('right', b.right)}${side('top', b.top)}${side('bottom', b.bottom)}<diagonal/></border>`) : 0;
      const numFmtId = fmtId(st.fmt);
      const al = st.h || st.v || st.wrap || st.indent ? `<alignment${st.h ? ` horizontal="${st.h}"` : ''}${st.v ? ` vertical="${st.v}"` : ''}${st.wrap ? ' wrapText="1"' : ''}${st.indent ? ` indent="${st.indent}"` : ''}/>` : '';
      const x = `<xf numFmtId="${numFmtId}" fontId="${fontId}" fillId="${fillId}" borderId="${borderId}" xfId="0"${numFmtId ? ' applyNumberFormat="1"' : ''} applyFont="1"${fillId ? ' applyFill="1"' : ''}${borderId ? ' applyBorder="1"' : ''}${al ? ' applyAlignment="1">' + al + '</xf>' : '/>'}`;
      xfs.push(x);
      memo.set(key, xfs.length - 1);
      return xfs.length - 1;
    }
    function toXml() {
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
${fmts.length ? `<numFmts count="${fmts.length}">${fmts.map((c, i) => `<numFmt numFmtId="${164 + i}" formatCode="${xml(c)}"/>`).join('')}</numFmts>` : ''}
<fonts count="${fonts.length}">${fonts.join('')}</fonts>
<fills count="${fills.length}">${fills.join('')}</fills>
<borders count="${borders.length}">${borders.join('')}</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
    }
    return { id, toXml };
  }

  // ---------- munkalap ----------
  function sheetXml(sh, styles) {
    const rows = sh.rows.map((row, r) => {
      if (!row) return '';
      const cells = row.map((c, k) => {
        if (c == null) return '';
        const ref = colName(k) + (r + 1);
        const s = styles.id(c.s);
        const sa = s ? ` s="${s}"` : '';
        if (c.f) {
          const cached = c.v == null || c.v === '' ? '' : typeof c.v === 'number' ? `<v>${c.v}</v>` : `<v>${xml(c.v)}</v>`;
          return `<c r="${ref}"${sa}${typeof c.v === 'string' ? ' t="str"' : ''}><f>${xml(c.f)}</f>${cached}</c>`;
        }
        if (c.v == null || c.v === '') return s ? `<c r="${ref}"${sa}/>` : '';
        if (typeof c.v === 'number' && isFinite(c.v)) return `<c r="${ref}"${sa}><v>${c.v}</v></c>`;
        return `<c r="${ref}"${sa} t="inlineStr"><is><t xml:space="preserve">${xml(c.v)}</t></is></c>`;
      }).join('');
      const ht = sh.heights && sh.heights[r] ? ` ht="${sh.heights[r]}" customHeight="1"` : '';
      return `<row r="${r + 1}"${ht}>${cells}</row>`;
    }).join('');
    const fz = sh.freeze;
    const pane = fz ? `<pane${fz.col ? ` xSplit="${fz.col}"` : ''}${fz.row ? ` ySplit="${fz.row}"` : ''} topLeftCell="${colName(fz.col || 0)}${(fz.row || 0) + 1}" activePane="${fz.row && fz.col ? 'bottomRight' : fz.row ? 'bottomLeft' : 'topRight'}" state="frozen"/>` : '';
    const cols = sh.cols ? `<cols>${sh.cols.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>` : '';
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<sheetViews><sheetView workbookViewId="0" showGridLines="0"${sh.tabSelected ? ' tabSelected="1"' : ''} zoomScale="${sh.zoom || 100}">${pane}</sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
${cols}<sheetData>${rows}</sheetData>
${sh.filter ? `<autoFilter ref="${sh.filter}"/>` : ''}
<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
<pageSetup paperSize="9" orientation="${sh.landscape ? 'landscape' : 'portrait'}" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;
  }

  // ---------- ZIP (tárolt, tömörítés nélkül) ----------
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  function zip(files) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let off = 0;
    const d = new Date();
    const dosT = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    const dosD = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    for (const [name, text] of files) {
      const nm = enc.encode(name), data = enc.encode(text), crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, dosT, true); h.setUint16(12, dosD, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nm.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), nm, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, dosT, true); c.setUint16(14, dosD, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), nm);
      off += 30 + nm.length + data.length;
    }
    const csize = central.reduce((s, b) => s + b.length, 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, csize, true); e.setUint32(16, off, true);
    return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function book(sheets, meta = {}) {
    const styles = Styles();
    const ws = sheets.map(sh => sheetXml(sh, styles));
    const names = sheets.map(sh => sh.name.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31));
    const abs = r => r.split(':').map(x => x.replace(/^([A-Z]+)(\d+)$/, (_, c, n) => `$${c}$${n}`)).join(':');
    const defs = sheets.map((sh, i) => (sh.filter ? `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${xml(names[i])}'!${abs(sh.filter)}</definedName>` : '')).join('');
    const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    const files = [
      ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
      ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
      ['docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(meta.title || '')}</dc:title><dc:creator>${xml(meta.author || 'Konténer Forecast')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`],
      ['docProps/app.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Konténer Forecast</Application></Properties>`],
      ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>${names.map((n, i) => `<sheet name="${xml(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>${defs ? `<definedNames>${defs}</definedNames>` : ''}<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`],
      ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
      ...ws.map((x, i) => [`xl/worksheets/sheet${i + 1}.xml`, x]),
      ['xl/styles.xml', styles.toXml()]
    ];
    return zip(files);
  }

  // Helyi idő („2026-11-03T08:45:00”) → Excel dátumszám (1899-12-30 alapú, időzóna nélkül).
  function serial(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s);
    if (!m) return null;
    return Date.UTC(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) / 864e5 + 25569;
  }

  window.KFXlsx = { book, serial, colName };
})();
