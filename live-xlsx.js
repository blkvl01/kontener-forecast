// Élő Excel: olyan .xlsx, amelyben két Power Query-lekérdezés (Konténerek, Fuvarlevelek) az excel-feed függvényből
// húzza a mai napot vagy az aktuális hetet (range: 'day' | 'week'), megnyitáskor és ötpercenként frissül, az „Összesítő” lap pedig ezekből számol.
// Használat: KFLive.build({ feedUrl: 'https://…/functions/v1/excel-feed?t=…', author }) → Blob.
// A lekérdezések (M-kód) a „Frissítés” lapon is olvashatók: ha az Excel nem fogadná el a beágyazottakat, ott másolhatók be
// (Adatok → Adatok lekérése → Más forrásból → Üres lekérdezés → Speciális szerkesztő).
(() => {
  'use strict';
  const X = window.KFXlsx;
  const xml = X.xml;
  const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const mq = s => String(s).replace(/"/g, '""');

  // Oszlopok: [kulcs, fejléc, típus]. A típus a lekérdezés oszloptípusa (d: dátum, t: idő, i: egész, s: szöveg).
  // Ugyanaz a sorrend és fejléc, mint a supabase/functions/excel-feed/rows.js CONTAINER_COLS / PDD_COLS.
  const KC = [
    ['date', 'Dátum', 'd'], ['dow', 'Nap', 's'], ['id', 'Konténer', 's'], ['prio', 'Prioritás', 's'], ['fwd', 'Szállító', 's'], ['plate', 'Rendszám', 's'],
    ['t1', 'T1 / MRN', 's'], ['phone', 'Sofőr telefon', 's'], ['npdd', 'Fuvarlevél (db)', 'i'], ['ctns', 'Colli', 'i'], ['kg', 'Súly (kg)', 'i'],
    ['state', 'Állapot', 's'], ['ramp', 'Rámpa', 's'], ['seen', 'Pre-alert', 't'], ['truck', 'Rendszám + T1', 't'], ['eta', 'ETA', 't'],
    ['arr', 'Megérkezett', 't'], ['dev', 'Eltérés az ETA-tól (perc)', 'i'], ['req', 'Nyitáskérés', 't'], ['appr', 'Nyitható', 't'], ['open', 'Nyitás', 't'],
    ['rel', 'Elengedve', 't'], ['sto1', 'Betárolás kezdete', 't'], ['sto', 'Betárolva', 't'], ['d1', 'Nyitáskérés → nyitható (perc)', 'i'],
    ['d2', 'Nyitható → nyitás (perc)', 'i'], ['d3', 'Nyitás → betárolva (perc)', 'i'], ['dt', 'Átfutás: érkezés → betárolva (perc)', 'i'], ['note', 'Megjegyzés', 's']
  ];
  const PC = [
    ['date', 'Dátum', 'd'], ['id', 'Konténer', 's'], ['no', 'Fuvarlevél', 's'], ['px', 'Prefix', 's'], ['ctns', 'Colli', 'i'], ['kg', 'Súly (kg)', 'i'],
    ['sto', 'Betárolva', 't'], ['arr', 'Konténer megérkezett', 't'], ['state', 'Konténer állapota', 's']
  ];
  // Hibatűrő átalakítás: egy váratlan érték üres cella lesz, nem dönti el az egész lekérdezést.
  const TF = {
    d: 'each try Date.FromText(_, [Format = "yyyy-MM-dd", Culture = "en-US"]) otherwise null, type nullable date',
    t: `each try DateTime.FromText(_, [Format = "yyyy-MM-dd'T'HH:mm:ss", Culture = "en-US"]) otherwise (try DateTime.FromText(_, [Culture = "en-US"]) otherwise null), type nullable datetime`,
    i: 'each try Int64.From(Number.FromText(_, "en-US")) otherwise null, Int64.Type',
    s: 'each _, type text'
  };

  function mCode(name, cols, base, token, sheet, range) {
    const tf = cols.map(([, h, t]) => `{"${mq(h)}", ${TF[t]}}`).join(',\r\n        ');
    return `${name} = let
    Forras = Csv.Document(Web.Contents("${mq(base)}", [Query = [t = "${mq(token)}", sheet = "${sheet}", r = "${range}"]]), [Delimiter = ",", Encoding = 65001, QuoteStyle = QuoteStyle.Csv]),
    Fejlec = Table.PromoteHeaders(Forras, [PromoteAllScalars = true]),
    Uresek = Table.ReplaceValue(Fejlec, "", null, Replacer.ReplaceValue, Table.ColumnNames(Fejlec)),
    Tipusok = Table.TransformColumns(Uresek, {
        ${tf}})
in
    Tipusok;`;
  }

  // ---------- a Power Query csomag (MS-QDEFF): verzió, csomag (ZIP), engedélyek, metaadat, kötések ----------
  const u32 = n => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, true); return b; };
  const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; };
  const lp = b => cat(u32(b.length), b);
  function dataMashup(m, names) {
    const te = new TextEncoder();
    const pkg = X.zipBytes([
      ['[Content_Types].xml', '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="text/xml" /><Default Extension="config" ContentType="application/xml" /><Default Extension="m" ContentType="application/x-ms-m" /></Types>'],
      ['Config/Package.xml', '<?xml version="1.0" encoding="utf-8"?><Package xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Version>2.0.0.0</Version><MinVersion>2.0.0.0</MinVersion><Culture>hu-HU</Culture></Package>'],
      ['Formulas/Section1.m', `section Section1;\r\n\r\n${m}\r\n`]
    ]);
    const perm = te.encode('<?xml version="1.0" encoding="utf-8"?><PermissionList xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CanEvaluateFuturePackages>false</CanEvaluateFuturePackages><FirewallEnabled>false</FirewallEnabled><WorkbookGroupType xsi:nil="true" /></PermissionList>');
    const stamp = new Date().toISOString().replace(/\.(\d+)Z$/, (_, f) => `.${f}0000Z`);   // az Excel 7 tizedesjegyes másodpercet vár, pl. 2026-11-10T11:30:00.1230000Z
    const items = names.map(n => `<Item><ItemLocation><ItemType>Formula</ItemType><ItemPath>Section1/${n}</ItemPath></ItemLocation><StableEntries><Entry Type="FillEnabled" Value="l1" /><Entry Type="FillToDataModelEnabled" Value="l0" /><Entry Type="FillObjectType" Value="sTable" /><Entry Type="FillTarget" Value="s${n}" /><Entry Type="FillStatus" Value="sComplete" /><Entry Type="FillLastUpdated" Value="d${stamp}" /><Entry Type="ResultType" Value="sTable" /></StableEntries></Item>`).join('');
    const metaXml = te.encode(`<?xml version="1.0" encoding="utf-8"?><LocalPackageMetadataFile xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Items><Item><ItemLocation><ItemType>AllFormulas</ItemType><ItemPath /></ItemLocation><StableEntries /></Item>${items}</Items></LocalPackageMetadataFile>`);
    const meta = cat(u32(0), lp(metaXml), u32(0));
    return cat(u32(0), lp(pkg), lp(perm), lp(meta), u32(0));
  }
  function utf16(text) {
    const b = new Uint8Array(2 + text.length * 2);
    b[0] = 0xff; b[1] = 0xfe;
    for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); b[2 + 2 * i] = c & 255; b[3 + 2 * i] = c >> 8; }
    return b;
  }
  const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };

  function build({ feedUrl, author, range = 'day' }) {
    if (range !== 'week') range = 'day';
    const u = new URL(feedUrl);
    const token = u.searchParams.get('t') || '';
    const base = u.origin + u.pathname;
    const qs = [['Kontenerek', KC, 'containers'], ['Fuvarlevelek', PC, 'pdd']];
    const ms = qs.map(([n, c, s]) => mCode(n, c, base, token, s, range));
    const mAll = ms.map(m => `shared ${m}`).join('\r\n\r\n');

    const dataSheet = ([name, cols], i) => {
      const last = X.colName(cols.length - 1);
      return { name: i ? 'Fuvarlevelek' : 'Konténerek', cols: cols.map(([, h]) => Math.min(34, Math.max(11, h.length + 3))), rows: [cols.map(([, h]) => ({ v: h, s: { font: { b: true, sz: 9 } } }))], freeze: { row: 1, col: 3 }, tables: 1, last, ref: `A1:${last}2` };
    };
    const ds = qs.map((q, i) => dataSheet(q, i));

    const G = { font: { sz: 9, color: 'FF6B7280' } };
    const K = (label, f, s) => [{ v: label, s: G }, { f, v: 0, s }];
    const int = { font: { b: true, sz: 14 }, fmt: '#,##0', h: 'left' };
    const sum = {
      name: 'Összesítő', cols: [30, 14, 3, 60], tabSelected: true, heights: { 0: 24 }, rows: [
        [{ v: range === 'week' ? 'Konténer Forecast · aktuális hét' : 'Konténer Forecast · mai nap', s: { font: { b: true, sz: 16 } } }],
        [{ v: 'Az adatok megnyitáskor és ötpercenként frissülnek (Adatok → Összes frissítése). Frissítéshez az internet kell.', s: G }],
        null,
        K('Konténer', 'COUNTA(Kontenerek[Konténer])', int),
        K('Fuvarlevél', 'SUM(Kontenerek[Fuvarlevél (db)])', int),
        K('Colli', 'SUM(Kontenerek[Colli])', int),
        K('Súly (t)', 'SUM(Kontenerek[Súly (kg)])/1000', { font: { b: true, sz: 14 }, fmt: '#,##0.0', h: 'left' }),
        K('Megérkezett', 'COUNT(Kontenerek[Megérkezett])', int),
        K('Betárolva', 'COUNT(Kontenerek[Betárolva])', int),
        K('Betárolt fuvarlevél', 'COUNT(Fuvarlevelek[Betárolva])', int)
      ]
    };
    const help = {
      name: 'Frissítés', cols: [120], rows: [
        [{ v: 'Ha az Összesítő üres marad', s: { font: { b: true, sz: 12 } } }],
        [{ v: 'A fájl személyes: a lekérdezésekben a te hozzáférésed van. Ne add tovább; a hozzáférést a tagság visszavonásával lehet megszüntetni.', s: G }],
        [{ v: 'Első megnyitáskor az Excel adatvédelmi szintet kérhet a forrásra: válaszd a „Szervezeti” vagy „Nyilvános” szintet, és engedélyezd a frissítést.', s: G }],
        [{ v: 'Ha a beágyazott lekérdezés nem fut, készíts kettőt kézzel (Adatok → Adatok lekérése → Más forrásból → Üres lekérdezés → Speciális szerkesztő) az alábbi kódokkal:', s: G }],
        null,
        ...ms.flatMap(m => [...m.replace(/^[A-Za-z]+ = /, 'let\n').split('\n'), ''].map(l => [{ v: l, s: { font: { name: 'Consolas', sz: 9 } } }]))
      ]
    };
    const sheets = [sum, ...ds, help];
    const conn = (i, n) => `<connection id="${i}" keepAlive="1" name="Query - ${n}" description="Kapcsolat a(z) ${n} lekérdezéshez a munkafüzetben." type="5" refreshedVersion="6" background="1" saveData="1" refreshOnLoad="1" interval="5"><dbPr connection="Provider=Microsoft.Mashup.OleDb.1;Data Source=$Workbook$;Location=${n};Extended Properties=&quot;&quot;" command="SELECT * FROM [${n}]"/></connection>`;
    const names = qs.map(q => q[0]);
    const parts = [
      ['xl/connections.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<connections xmlns="${NS}">${names.map((n, i) => conn(i + 1, n)).join('')}</connections>`],
      ['customXml/item1.xml', utf16(`<?xml version="1.0" encoding="UTF-16"?><DataMashup xmlns="http://schemas.microsoft.com/DataMashup">${b64(dataMashup(mAll, names))}</DataMashup>`)],
      ['customXml/itemProps1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<ds:datastoreItem ds:itemID="{6E6B5E6A-4F0A-4C57-9D0E-3C2E5A7B1F10}" xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml"><ds:schemaRefs><ds:schemaRef ds:uri="http://schemas.microsoft.com/DataMashup"/></ds:schemaRefs></ds:datastoreItem>'],
      ['customXml/_rels/item1.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/customXmlProps" Target="itemProps1.xml"/></Relationships>`]
    ];
    qs.forEach(([n, cols], i) => {
      const k = i + 1, last = X.colName(cols.length - 1), ref = `A1:${last}2`;
      const si = sheets.indexOf(ds[i]) + 1;
      parts.push(
        [`xl/worksheets/_rels/sheet${si}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/table" Target="../tables/table${k}.xml"/></Relationships>`],
        [`xl/tables/table${k}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<table xmlns="${NS}" id="${k}" name="${n}" displayName="${n}" ref="${ref}" tableType="queryTable" totalsRowShown="0"><autoFilter ref="${ref}"/><tableColumns count="${cols.length}">${cols.map(([, h], j) => `<tableColumn id="${j + 1}" uniqueName="${j + 1}" name="${xml(h)}" queryTableFieldId="${j + 1}"/>`).join('')}</tableColumns><tableStyleInfo name="TableStyleLight1" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>`],
        [`xl/tables/_rels/table${k}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/queryTable" Target="../queryTables/queryTable${k}.xml"/></Relationships>`],
        [`xl/queryTables/queryTable${k}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<queryTable xmlns="${NS}" name="ExternalData_${k}" connectionId="${k}" autoFormatId="16" applyNumberFormats="0" applyBorderFormats="0" applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="0"><queryTableRefresh nextId="${cols.length + 1}"><queryTableFields count="${cols.length}">${cols.map(([, h], j) => `<queryTableField id="${j + 1}" name="${xml(h)}" tableColumnId="${j + 1}"/>`).join('')}</queryTableFields></queryTableRefresh></queryTable>`]
      );
    });
    const ct = t => `application/vnd.openxmlformats-officedocument.spreadsheetml.${t}+xml`;
    const types = `<Override PartName="/xl/connections.xml" ContentType="${ct('connections')}"/><Override PartName="/customXml/itemProps1.xml" ContentType="application/vnd.openxmlformats-officedocument.customXmlProperties+xml"/>`
      + qs.map((_, i) => `<Override PartName="/xl/tables/table${i + 1}.xml" ContentType="${ct('table')}"/><Override PartName="/xl/queryTables/queryTable${i + 1}.xml" ContentType="${ct('queryTable')}"/>`).join('');
    return X.book(sheets, {
      title: 'Konténer Forecast – élő', author, parts, types, shared: true,
      names: qs.map(([, cols], i) => `<definedName name="ExternalData_${i + 1}" localSheetId="${sheets.indexOf(ds[i])}" hidden="1">'${xml(ds[i].name)}'!$A$1:$${X.colName(cols.length - 1)}$2</definedName>`).join(''),
      wbRels: [{ type: `${REL}/connections`, target: 'connections.xml' }, { type: `${REL}/customXml`, target: '../customXml/item1.xml' }]
    });
  }

  window.KFLive = { build, mCode: (base, token, range = 'day') => ({ Kontenerek: mCode('Kontenerek', KC, base, token, 'containers', range), Fuvarlevelek: mCode('Fuvarlevelek', PC, base, token, 'pdd', range) }) };
})();
