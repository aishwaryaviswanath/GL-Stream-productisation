import { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// SAP HANA Dictionary
// ═══════════════════════════════════════════════════════════════════════
const HANA_TABLES = {
  BKPF:"Accounting Document Header",BSEG:"Accounting Document Line Item",BSEC:"One-Time Account Data",BSET:"Tax Data (Document Segment)",BSAS:"G/L Account Cleared Items",VBRK:"Billing Document Header",VBRP:"Billing Document Item",VBPA:"Sales Document Partner",VBAK:"Sales Document Header",KONV:"Pricing Conditions",EKKO:"Purchasing Document Header",EKPO:"Purchasing Document Item",RBKP:"Invoice Receipt Header",RSEG:"Invoice Receipt Item",MKPF:"Material Document Header",MSEG:"Material Document Item",LIKP:"Delivery Header",LIPS:"Delivery Item",MARC:"Plant Data for Material",MBEW:"Material Valuation",MAKT:"Material Description",LFA1:"Vendor Master (General)",LFB1:"Vendor Master (Company Code)",KNA1:"Customer Master (General)",KNB1:"Customer Master (Company Code)",ADRC:"Address Management",ADR6:"Email Addresses",CEPC:"Profit Center Master",T001:"Company Codes",T001L:"Storage Locations",T001W:"Plants / Branches",T003:"Document Types",T003T:"Document Type Texts",T005:"Countries",T005U:"Region / State Texts",T007A:"Tax Keys",T007S:"Tax Code Texts",T052:"Payment Terms",T059Z:"Withholding Tax Rates",T059O:"WHT Official Codes",T059ZT:"WHT Code Texts",T077Z:"Account Group Texts",T161:"Purchasing Doc Types",T161T:"Purchasing Doc Type Texts",T604N:"Control Code Texts",T683S:"Pricing Procedure Steps",T685T:"Condition Type Texts",TCURR:"Exchange Rates",TCURX:"Currency Decimals",TSPAT:"Division Texts",TKUKT:"Customer Classification Texts",TVFKT:"Billing Type Texts",SKA1:"G/L Account Master",SKAT:"G/L Account Texts",J_1BBRANCH:"Branch Master (India)",J_1IMOVEND:"Vendor PAN (India)",J_1IMOCUST:"Customer PAN (India)",J_1I_SECCO_CIT:"TAN / Section Code (India)",FIWTIN_TAN_EXEM:"WHT Exemption (India)",WITH_ITEM:"Withholding Tax Item",
};
const HANA_FIELDS = {
  BUKRS:"Company Code",GJAHR:"Fiscal Year",BELNR:"Document Number",BUZEI:"Line Item",BUZID:"Identification",BUDAT:"Posting Date",BLDAT:"Document Date",BLART:"Document Type",BSTAT:"Document Status",BKTXT:"Header Text",CPUDT:"Entry Date",CPUTM:"Entry Time",USNAM:"User Name",TCODE:"Transaction Code",WAERS:"Currency",HWAER:"Local Currency",KURSF:"Exchange Rate",MONAT:"Fiscal Period",XBLNR:"Reference Document",AWKEY:"Reference Key",AWTYP:"Reference Type",STBLG:"Reversal Document",STJAH:"Reversal Year",STGRD:"Reversal Reason",XREVERSAL:"Reversal Indicator",XSTOV:"Reversal Flag",BVORG:"Cross-Company No",BRNCH:"Branch",DBBLG:"Recurring Doc No",KNUMV:"Pricing Doc No",AEDAT:"Changed On",XREF1_HD:"Header Ref 1",XREF2_HD:"Header Ref 2",XBLNR_ALT:"Alternative Reference",HKONT:"G/L Account",SAKNR:"G/L Account Number",KOART:"Account Type",SHKZG:"Debit/Credit",DMBTR:"Amount (Local)",WRBTR:"Amount (Doc Currency)",HWBAS:"Tax Base Amount",MWSKZ:"Tax Code",TXGRP:"Tax Group",SGTXT:"Item Text",ZUONR:"Assignment",KOSTL:"Cost Center",PRCTR:"Profit Center",GSBER:"Business Area",BSCHL:"Posting Key",LIFNR:"Vendor Number",KUNNR:"Customer Number",MATNR:"Material Number",EBELN:"Purchase Order",EBELP:"PO Item",VBELN:"Billing/Delivery Doc",WERKS:"Plant",MENGE:"Quantity",MEINS:"Unit of Measure",BPMNG:"PO Quantity",BPRME:"PO Unit",AUGBL:"Clearing Document",AUGDT:"Clearing Date",AUGCP:"Clearing Entry Date",AUGGJ:"Clearing Year",REBZG:"Invoice Reference",REBZJ:"Invoice Ref Year",REBZZ:"Invoice Ref Item",ZTERM:"Payment Terms",ZFBDT:"Baseline Date",NEBTR:"Net Amount",BUPLA:"Business Place",J_1TPBUPL:"Tax Partner BP",GST_PART:"GST Partner",HSN_SAC:"HSN/SAC Code",KOKRS:"Controlling Area",KONTL:"Limit Value",KONTT:"Account Assignment Cat",KTOSL:"Transaction Key",FIPOS:"Budget Item",BVTYP:"Partner Bank Type",ERFMG:"Quantity (Entry)",ERFME:"Unit (Entry)",RSTGR:"Reason Code",SKNTO:"Cash Discount",VORGN:"Transaction Type",XRAGL:"Calculate Interest",XREF1:"Reference Key 1",XREF2:"Reference Key 2",XREF3:"Reference Key 3",XUMSW:"Sales-Related",ZEKKN:"Acct Assignment Seq",UMSKZ:"Special G/L Ind",PEINH:"Price Unit",FMXDOCLN:"Funds Mgmt Line",SECCO:"Section Code",PLC_SUP:"Supply Plant",QSSKZ:"WHT Code",NAME1:"Name 1",NAME2:"Name 2",NAME3:"Name 3",NAME4:"Name 4",ORT01:"City",PSTLZ:"Postal Code",REGIO:"Region / State",STRAS:"Street",LAND1:"Country",SORTL:"Sort Key",ADRNR:"Address Number",ERDAT:"Created On",UPDAT:"Updated On",KTOKK:"Vendor Account Group",STCEG:"VAT Registration",STCD1:"Tax Number 1",STCD3:"Tax No 3 / GSTIN",TELF1:"Telephone",XCPDK:"One-Time Account",ANRED:"Title",ORT02:"District",PFACH:"PO Box",PSTL2:"PO Box Postal Code",MCOD3:"Search Term",KTOKD:"Customer Account Group",KUKLA:"Customer Classification",SPRAS:"Language",AUFSD:"Order Block",FKART:"Billing Type",FKTYP:"Billing Category",KTGRD:"Acct Assign Group",VBTYP:"SD Doc Category",VTWEG:"Distribution Channel",FKDAT:"Billing Date",RFBSK:"Accounting Status",NETWR:"Net Value",KUNRG:"Payer",KUNAG:"Sold-To Party",SPART:"Division",TAXK1:"Tax Classification",FKSTO:"Cancelled",VKORG:"Sales Organization",KURRF:"Exchange Rate (Billing)",WAERK:"Document Currency",ERNAM:"Created By",EXPKZ:"Export Indicator",INCO1:"Incoterms",SFAKN:"Cancelled Billing Doc",POSNR:"Item Number",ARKTX:"Item Description",FKIMG:"Billing Quantity",MWSBP:"Tax Amount",VRKME:"Sales UoM",CMPRE:"Credit Price",VGBEL:"Reference Document",ALAND:"Departure Country",CHARG:"Batch",LGORT:"Storage Location",VOLUM:"Volume",ADDRNUMBER:"Address Number",DATE_FROM:"Valid From",DATE_TO:"Valid To",NATION:"Intl Version",CITY1:"City",POST_CODE1:"Postal Code",STREET:"Street",HOUSE_NUM1:"House Number",HOUSE_NUM2:"House No 2",STR_SUPPL1:"Street Supp 1",STR_SUPPL2:"Street Supp 2",STR_SUPPL3:"Street Supp 3",BUILDING:"Building",COUNTRY:"Country",REGION:"Region",SORT1:"Search Term 1",TEL_NUMBER:"Telephone",PERSNUMBER:"Person Number",CONSNUMBER:"Sequence Number",FLGDEFAULT:"Default Flag",SMTP_ADDR:"Email Address",BSART:"Purchase Order Type",XRECH:"Invoice Indicator",MBLNR:"Material Doc Number",MJAHR:"Material Doc Year",BWART:"Movement Type",BUDAT_MKPF:"Posting Date (Mat Doc)",LFDAT:"Delivery Date",ROUTE:"Route",KMPMG:"Component Qty",BSTNK:"Customer PO Number",MFRGR:"Material Freight Group",STEUC:"Control Code",VERPR:"Moving Average Price",MAKTX:"Material Description",KPOSN:"Condition Item",STUNR:"Step Number",ZAEHK:"Condition Counter",KSCHL:"Condition Type",KBETR:"Condition Rate",MWSK1:"Tax Code (Cond)",KDIFF:"Rounding Diff",KWERT:"Condition Value",KINAK:"Inactive",KSTAT:"Statistical",LGOBE:"Storage Loc Description",J_1IBUZEI:"Indian Line Item",WITHT:"WHT Type",WT_WITHCD:"WHT Code",WT_QSSHH:"WHT Base (Modified)",WT_QBSHH:"WHT Base",WT_QSFHH:"Exempt Amount",WT_WTEXMN:"Min Exempt",WT_QSZRT:"Interest on Late Pmt",WT_ACCO:"WHT Account Number",QSREC:"WHT Recipient Type",QSATZ:"WHT Rate",J_1IINTCHLN:"Interest Challan No",J_1IINTCHDT:"Interest Challan Date",J_1IPANNO:"PAN Number",J_1IPANREF:"PAN Reference",BRANCH:"Branch Code",GSTIN:"GSTIN",SECCODE:"Section Code",TANNO:"TAN Number",FIWTIN_TANEX_SUB:"Exemption Subtype",ACCNO:"Account Number",WT_EXDF:"Exempt From Date",PAN_NO:"PAN (Exemption)",WT_EXDT:"Exempt To Date",WT_EXNR:"Exempt Certificate",WT_EXRT:"Exempt Rate",WT_WTEXRS:"Exempt Reason",FIWTIN_EXEM_THR:"Exempt Threshold",QSCOD:"Official WHT Code",QPROZ:"WHT Percentage",QSATR:"WHT Rate Reduction",XQFOR:"Exemption Formula",FPRCD:"Processing Code",QEKAR:"Account Key",WT_POSIN:"Position Indicator",WT_RATEZ:"Rate for Zero",WITHCD2:"WHT Code 2",BUTXT:"Company Name",KTOPL:"Chart of Accounts",NUMKR:"Number Range",LTEXT:"Description",BEZEI:"Description",TXT20:"Short Text",TXT50:"Long Text",BATXT:"Doc Type Text",VTEXT:"Description",TEXT1:"Description",TEXT40:"Description",PARVW:"Partner Function",TXT30:"Text",KAPPL:"Application",KALSM:"Pricing Procedure",KURST:"Exchange Rate Type",FCURR:"From Currency",UKURS:"Exchange Rate",CURRKEY:"Currency Key",CURRDEC:"Currency Decimals",HWSTE:"Tax Amount (Local)",FWSTE:"Tax Amount (Foreign)",SAKAN:"Alternative Acct No",BILKT:"Group Acct No",KTOKS:"G/L Account Group",FUNC_AREA:"Functional Area",BWKEY:"Valuation Area",KOBLI:"Mandatory",KVEWE:"Usage",MCOD1:"Search Term (Acct)",
};
function categorizeHANA(s){
  if(["BKPF","BSEG","BSEC","BSET","BSAS","WITH_ITEM"].includes(s))return "Accounting";
  if(["VBRK","VBRP","VBPA","VBAK","KONV"].includes(s))return "Billing & Sales";
  if(["EKKO","EKPO","RBKP","RSEG"].includes(s))return "Purchasing & Invoicing";
  if(["MKPF","MSEG","LIKP","LIPS"].includes(s))return "Material & Delivery";
  if(["MARC","MBEW","MAKT"].includes(s))return "Material Master";
  if(["LFA1","LFB1","KNA1","KNB1","ADRC","ADR6"].includes(s))return "Business Partners";
  if(s.startsWith("T0")||s.startsWith("T1")||s.startsWith("T5")||s.startsWith("T6")||["TCURR","TCURX","TSPAT","TKUKT","TVFKT","SKA1","SKAT","T077Z","T683S","T685T"].includes(s))return "Config & Reference Data";
  if(["J_1BBRANCH","J_1IMOVEND","J_1IMOCUST","J_1I_SECCO_CIT","FIWTIN_TAN_EXEM","T059Z","T059O","T059ZT"].includes(s))return "India Localization";
  if(s==="CEPC")return "Controlling";
  return "Other";
}

// ═══════════════════════════════════════════════════════════════════════
// SAP B1 Dictionary
// ═══════════════════════════════════════════════════════════════════════
const B1_TABLES = {
  JDT1:"GL Journal Lines",OJDT:"GL Journal Headers",OACT:"Chart of Accounts",
  OACP:"Posting Periods",OFPR:"Fiscal Periods",
  OCRD:"Business Partner Master",CRD1:"BP Addresses",OCTG:"Payment Terms",OCRG:"BP Groups",
  OINV:"AR Invoice Header",INV1:"AR Invoice Lines",INV4:"AR Invoice Tax Lines",INV12:"AR Invoice GST Details",
  ORIN:"AR Credit Note Header",RIN1:"AR Credit Note Lines",RIN4:"AR Credit Note Tax Lines",RIN12:"AR Credit Note GST Details",
  OPCH:"AP Invoice Header",PCH1:"AP Invoice Lines",PCH4:"AP Invoice Tax Lines",PCH12:"AP Invoice GST Details",
  ORPC:"AP Credit Note Header",RPC1:"AP Credit Note Lines",RPC4:"AP Credit Note Tax Lines",RPC12:"AP Credit Note GST Details",
  ODPI:"Down Payment Invoice Header",DPI1:"Down Payment Invoice Lines",DPI4:"Down Payment Invoice Tax Lines",DPI12:"Down Payment Invoice GST Details",
  ORCT:"Incoming Payment Header",RCT1:"Incoming Payment Lines",RCT2:"Incoming Payment Accounts",
  OVPM:"Outgoing Payment Header",VPM1:"Outgoing Payment Lines",VPM2:"Outgoing Payment Accounts",
  OARG:"AR Aging",OACG:"AP Aging",
  OACS:"Accrual Postings",OITR:"Internal Reconciliation Header",ITR1:"Internal Reconciliation Lines",
  OBNK:"Bank Master",OBTF:"Bank Statements",
  OPOR:"Purchase Order Header",POR1:"Purchase Order Lines",OPDN:"Goods Receipt PO Header",PDN1:"Goods Receipt PO Lines",
  ORDR:"Sales Order Header",RDR1:"Sales Order Lines",ODLN:"Delivery Header",DLN1:"Delivery Lines",
  OQUT:"Sales Quotation Header",QUT1:"Sales Quotation Lines",
  OINM:"Inventory Transactions",OITW:"Item Warehouse Stock",OITB:"Item Groups",
  OITM:"Item Master",OINV_OITM:"Item Master (AR Invoice)",ORIN_OITM:"Item Master (AR Credit Note)",OPCH_OITM:"Item Master (AP Invoice)",ORPC_OITM:"Item Master (AP Credit Note)",ODPI_OITM:"Item Master (Down Payment)",
  OSTA:"Tax Authority",OSTC:"Tax Codes Master",STC1:"Tax Code Details",
  OCHP:"HSN Chapter Master",OSAC:"SAC Service Master",
  OOCR:"Cost Center / Profit Center",OCST:"State Master",OBPL:"Branch / Plant Master",
  NNM1:"Document Numbering Series",ORTT:"Exchange Rates",OCRN:"Currency Master",
  OBGS:"Budget Scenarios",OBGT:"Budget Lines",OATR:"Asset Master",ATR1:"Asset Transactions",
  OUSR:"Users",OADM:"Company Master",
};
const B1_FIELDS = {
  DataBase:"Database Name",created_at:"Record Created At",CreateDate:"Created Date",CreateTS:"Created Timestamp",UpdateDate:"Updated Date",
  TransId:"Transaction ID",BPLId:"Branch / Plant ID",Line_ID:"Line Number",Account:"G/L Account",Debit:"Debit Amount",Credit:"Credit Amount",FCDebit:"Debit (Foreign Currency)",FCCredit:"Credit (Foreign Currency)",ShortName:"Account Short Name",ContraAct:"Contra Account",LineMemo:"Line Memo",TransType:"Transaction Type",RefDate:"Reference Date",OrgBPName:"Original BP Name",OrgAccName:"Original Account Name",Ref1:"Reference 1",Ref2:"Reference 2",Ref3:"Reference 3",Ref3Line:"Reference 3 (Line)",ProfitCode:"Profit Center Code",BaseRef:"Base Reference",LocTotal:"Total (Local Currency)",TaxDate:"Tax Date",Memo:"Memo / Remarks",FcTotal:"Total (Foreign Currency)",TransCurr:"Transaction Currency",StornoToTr:"Reversal Transaction",Number:"Document Number",DueDate:"Due Date",Series:"Document Series",AutoVAT:"Auto VAT",VatDate:"VAT Date",Indicator:"Indicator",UseAutoStorno:"Auto Storno",FCCurrency:"Foreign Currency",VatGroup:"Tax Group",SystemRate:"System Exchange Rate",Project:"Project Code",
  AcctCode:"Account Code",AcctName:"Account Name",Segment_0:"Segment 0",Segment_1:"Segment 1",Segment_2:"Segment 2",Segment_3:"Segment 3",Segment_4:"Segment 4",Segment_5:"Segment 5",Segment_6:"Segment 6",Segment_7:"Segment 7",Segment_8:"Segment 8",Segment_9:"Segment 9",FormatCode:"Format Code",ActType:"Account Type",
  AbsEntry:"Absolute Entry ID",Year:"Fiscal Year",F_RefDate:"Period Start Date",T_RefDate:"Period End Date",Code:"Code",Name:"Name",Category:"Category",
  CardCode:"BP Code",CardName:"BP Name",CardType:"BP Type (Customer/Vendor)",GroupCode:"BP Group Code",Currency:"Currency",Balance:"Balance",OrdersBal:"Orders Balance",DnotesBal:"Delivery Notes Balance",CreditLine:"Credit Limit",DebtLine:"Debt Limit",GroupNum:"Payment Terms Group",Phone1:"Phone Number",E_Mail:"Email Address",Notes:"Notes",ValidFor:"Active",FrozenFor:"Frozen / Inactive",
  Address:"Address Name",AdresType:"Address Type (Bill/Ship)",Street:"Street",Block:"Block",City:"City",State:"State",Country:"Country",ZipCode:"Zip Code",GSTRegnNo:"GST Registration Number",
  PymntGroup:"Payment Group Name",ExtraDays:"Extra Days",ExtraMonth:"Extra Months",GroupName:"Group Name",GroupType:"Group Type",
  DocEntry:"Document Entry ID",DocNum:"Document Number",GSTTranTyp:"GST Transaction Type",DocDate:"Document Date",CANCELED:"Cancelled",DocTotal:"Document Total",NumAtCard:"Vendor/Customer Ref No",U_OMS_DOC:"OMS Document Reference",DutyStatus:"Duty Status",VatSum:"Tax Total (Local)",VatSumFC:"Tax Total (Foreign Currency)",DiscPrcnt:"Discount %",DiscSum:"Discount Amount",DiscSumFC:"Discount Amount (FC)",ObjType:"Object Type",RevRefNo:"Revised Reference Number",RevRefDate:"Revised Reference Date",DocCur:"Document Currency",DocRate:"Exchange Rate",DocStatus:"Document Status",DocDueDate:"Due Date",PaidToDate:"Paid To Date",GrosProfit:"Gross Profit",Comments:"Comments / Remarks",PaymentRef:"Payment Reference",BaseEntry:"Base Document Entry",BaseType:"Base Document Type",BaseLine:"Base Document Line",ConfirmNo:"Vendor Confirmation No",DocType:"Document Type",
  ItemCode:"Item Code",LineNum:"Line Number",Quantity:"Quantity",unitMsr:"Unit of Measure",Price:"Unit Price",LineTotal:"Line Total",TaxCode:"Tax Code",HsnEntry:"HSN Entry",AcctCode:"G/L Account Code",SacEntry:"SAC Entry",U_PeriodStart:"Period Start",U_PeriodEnd:"Period End",Dscription:"Item Description",WhsCode:"Warehouse Code",OpenQty:"Open Quantity",GrossBuyPr:"Gross Buying Price",LineStatus:"Line Status",U_assetid:"Asset ID",
  LineSeq:"Line Sequence",TaxRate:"Tax Rate",TaxSum:"Tax Amount",staType:"State Type",DeductTax:"Deductible Tax",NonDdctPrc:"Non-Deductible %",
  LocStatCod:"Location State Code",BpCountry:"BP Country",BpGSTN:"BP GSTIN",StreetS:"Street (Ship)",BlockS:"Block (Ship)",BuildingS:"Building (Ship)",CityS:"City (Ship)",StateS:"State (Ship)",BpGSTType:"BP GST Type",LocGSTN:"Location GSTIN",ImpORExp:"Import / Export",ExportType:"Export Type",ImpExpNo:"Import/Export Number",PortCode:"Port Code",Address2S:"Address Line 2 (Ship)",
  VATRegNum:"VAT Registration Number",InvType:"Invoice Type",DocLine:"Document Line",SumApplied:"Amount Applied",AppliedFC:"Applied (Foreign Currency)",AppliedSys:"Applied (System Currency)",CashAcct:"Cash Account",AccountCode:"Account Code",SysDebit:"System Debit",SysCredit:"System Credit",CashSum:"Cash Amount",TrsfrSum:"Transfer Amount",TrsfrAcct:"Transfer Account",CheckSum:"Check Amount",CheckAcct:"Check Account",Cancelled:"Cancelled",
  BalDueDeb:"Balance Due (Debit)",BalDueCred:"Balance Due (Credit)",BalFcDeb:"Balance Due FC (Debit)",BalFcCred:"Balance Due FC (Credit)",Matched:"Matched",IntrnMatch:"Internal Match",ExternMatch:"External Match",
  PostDate:"Posting Date",TotalDebit:"Total Debit",TotalCredit:"Total Credit",JrnlMemo:"Journal Memo",
  BankCode:"Bank Code",BankName:"Bank Name",AcctNum:"Account Number",GLAccount:"G/L Account",Branch:"Branch",CurrncyCode:"Currency Code",StmtDate:"Statement Date",StmtNum:"Statement Number",Details:"Details",Ref:"Reference",Reconciled:"Reconciled",
  InQty:"Quantity In",OutQty:"Quantity Out",TransValue:"Transaction Value",CalcPrice:"Calculated Price",OnHand:"On Hand Quantity",IsCommited:"Committed Quantity",OnOrder:"On Order Quantity",AvgPrice:"Average Price",ItmsGrpCod:"Item Group Code",ItmsGrpNam:"Item Group Name",
  ItemName:"Item Name",ItemClass:"Item Class",GstTaxCtg:"GST Tax Category",InvntItem:"Inventory Item",ItemType:"Item Type",
  Type:"Type",RvsCrgPrc:"Reverse Charge %",Rate:"Rate",STCCode:"Tax Code",STACode:"Tax Authority Code",
  ChapterID:"HSN Chapter ID",ServCode:"Service Code",ServName:"Service Name",
  OcrCode:"Cost Center Code",OcrName:"Cost Center Name",OcrTotal:"Cost Center Total",
  GSTCode:"GST State Code",
  BPLName:"Branch Name",Disabled:"Disabled",MainBPL:"Main Branch",TaxIdNum:"Tax ID Number",AliasName:"Alias Name",
  ObjectCode:"Object Code",SeriesName:"Series Name",BeginStr:"Beginning String",Locked:"Locked",DocSubType:"Document Sub Type",
  RateDate:"Rate Date",UserSign:"User Signature",UserSign2:"User Signature 2",CurrCode:"Currency Code",CurrName:"Currency Name",DocCurrCod:"Document Currency Code",
  InitlRtio:"Initial Ratio",DivCode:"Division Code",Month:"Month",
  AcqDate:"Acquisition Date",CapDate:"Capitalization Date",RetDate:"Retirement Date",Status:"Status",OrigValue:"Original Value",AcqValue:"Acquisition Value",DeprecAmt:"Depreciation Amount",TranType:"Transaction Type",BalanceAmt:"Balance Amount",Line:"Line Number",
  USERID:"User ID",USER_CODE:"User Code",U_NAME:"User Name",
  CompnyName:"Company Name",CompnyAddr:"Company Address",MainCurncy:"Main Currency",
  ShipDate:"Ship Date",Rate:"Exchange Rate",
};
function categorizeB1(t){
  const c=t.replace(/^(OINV_|ORIN_|OPCH_|ORPC_|ODPI_)/,"");
  if(["JDT1","OJDT","OACT"].includes(c))return "General Ledger";
  if(["OACP","OFPR"].includes(c))return "Fiscal Periods";
  if(["OCRD","CRD1","OCTG","OCRG"].includes(c))return "Business Partners";
  if(["OINV","INV1","INV4","INV12","ORIN","RIN1","RIN4","RIN12"].includes(c))return "AR Invoices & Credit Notes";
  if(["OPCH","PCH1","PCH4","PCH12","ORPC","RPC1","RPC4","RPC12"].includes(c))return "AP Invoices & Credit Notes";
  if(["ODPI","DPI1","DPI4","DPI12"].includes(c))return "Down Payments";
  if(["ORCT","RCT1","RCT2","OVPM","VPM1","VPM2"].includes(c))return "Payments";
  if(["OARG","OACG"].includes(c))return "Aging";
  if(["OACS","OITR","ITR1"].includes(c))return "Accruals & Reconciliation";
  if(["OBNK","OBTF"].includes(c))return "Banking";
  if(["OPOR","POR1","OPDN","PDN1"].includes(c))return "Purchase Orders & GR";
  if(["ORDR","RDR1","ODLN","DLN1"].includes(c))return "Sales Orders & Delivery";
  if(["OQUT","QUT1"].includes(c))return "Sales Quotations";
  if(["OINM","OITW","OITB"].includes(c))return "Inventory";
  if(c==="OITM"||t.includes("_OITM"))return "Item Master";
  if(["OSTA","OSTC","STC1"].includes(c))return "Tax Configuration";
  if(["OCHP","OSAC"].includes(c))return "HSN / SAC Codes";
  if(["OOCR"].includes(c))return "Cost Centers";
  if(["OCST"].includes(c))return "Geography";
  if(["OBPL"].includes(c))return "Branch / Plant";
  if(["NNM1"].includes(c))return "Document Series";
  if(["ORTT","OCRN"].includes(c))return "Exchange Rates";
  if(["OBGS","OBGT"].includes(c))return "Budgeting";
  if(["OATR","ATR1"].includes(c))return "Fixed Assets";
  if(["OUSR","OADM"].includes(c))return "System";
  return "Other";
}

// ═══════════════════════════════════════════════════════════════════════
// ERP Auto-Detection & Unified Lookup
// ═══════════════════════════════════════════════════════════════════════
function detectERP(tables) {
  const names = tables.map(t => t.fromTable?.name || t.name);
  const b1Score = names.filter(n => B1_TABLES[n]).length;
  const hanaScore = names.filter(n => HANA_TABLES[n]).length;
  if (b1Score > hanaScore) return "SAP B1";
  if (hanaScore > b1Score) return "SAP HANA";
  // Check for B1-specific patterns
  if (names.some(n => /^(OINV|OPCH|OJDT|JDT1|ORIN|ORPC|ODPI|ORCT|OVPM|OCRD|OACT|NNM1)$/.test(n))) return "SAP B1";
  if (names.some(n => /^(BKPF|BSEG|VBRK|VBRP|EKKO|EKPO)$/.test(n))) return "SAP HANA";
  return "Unknown ERP";
}

function getDict(erp) {
  if (erp === "SAP B1") return { tables: B1_TABLES, fields: B1_FIELDS, categorize: categorizeB1 };
  return { tables: HANA_TABLES, fields: HANA_FIELDS, categorize: categorizeHANA };
}

const OP_DISPLAY = {"=":"equals","!=":"≠",">=":"≥","<=":"≤",">":">","<":"<",IN:"in","NOT IN":"not in"};

// ═══════════════════════════════════════════════════════════════════════
// Core Logic
// ═══════════════════════════════════════════════════════════════════════
function mergeBySourceTable(tables, dict) {
  const merged = {};
  for (const t of tables) {
    const src = t.fromTable?.name || t.name;
    if (!merged[src]) merged[src] = { sourceName: src, humanName: dict.tables[src] || src, columns: new Map(), configEntries: [] };
    merged[src].configEntries.push(t.name);
    for (const col of t.select || []) {
      if (!merged[src].columns.has(col.name)) {
        merged[src].columns.set(col.name, { name: col.name, humanName: dict.fields[col.name] || col.name, persist: col.persist || false });
      } else if (col.persist) merged[src].columns.get(col.name).persist = true;
    }
  }
  return Object.values(merged).sort((a, b) => a.sourceName.localeCompare(b.sourceName));
}

function extractFilters(tables, dict) {
  const filters = []; const seen = new Set();
  const walk = (list, tName, src) => {
    for (const item of list) {
      const e = item.expr;
      if (e && e.value && !e.reference_column) {
        const key = `${e.column?.name}|${e.operator}|${e.value.join(",")}`;
        if (!seen.has(key)) { seen.add(key); filters.push({ sourceTable: src, column: e.column?.name, columnHuman: dict.fields[e.column?.name] || e.column?.name, operator: e.operator, values: e.value }); }
      }
      if (item.listOfExpr) walk(item.listOfExpr, tName, src);
    }
  };
  for (const t of tables) { if (!t.where) continue; const src = t.fromTable?.name || t.name; for (const c of t.where) { if (c.listOfExpr) walk(c.listOfExpr, t.name, src); if (c.expr) walk([c], t.name, src); } }
  return filters;
}

function applyOperations(config, operations, dict) {
  let c = JSON.parse(JSON.stringify(config));
  let summary = [];
  for (const op of operations) {
    if (op.op === "remove_column") {
      let count = 0;
      for (const t of c.tables) {
        const src = t.fromTable?.name || t.name;
        if (src === op.table) { const b = t.select?.length||0; t.select = (t.select||[]).filter(s => s.name !== op.column); count += b - (t.select?.length||0); }
      }
      summary.push(`Removed column ${op.column} (${dict.fields[op.column]||op.column}) from ${op.table} — ${count} instance(s)`);
    } else if (op.op === "remove_table") {
      const b = c.tables.length;
      const rm = new Set();
      for (const t of c.tables) { if ((t.fromTable?.name||t.name) === op.table) rm.add(t.name); }
      let ch = true; while(ch){ch=false;for(const t of c.tables){if(!rm.has(t.name)&&t.fae&&rm.has(t.fae)){rm.add(t.name);ch=true;}}}
      c.tables = c.tables.filter(t => !rm.has(t.name));
      summary.push(`Removed table ${op.table} (${dict.tables[op.table]||op.table}) — ${b - c.tables.length} config entries removed`);
    } else if (op.op === "add_filter") {
      let applied = false;
      for (const t of c.tables) {
        const src = t.fromTable?.name || t.name;
        if (src === op.table && !t.fae) {
          if (!t.where) t.where = [];
          const ne = {expr:{column:{alias:t.fromTable?.alias||"t",name:op.column},operator:op.operator||"IN",value:op.values}};
          if (t.where.length>0&&t.where[0].listOfExpr) t.where[0].listOfExpr.push(ne);
          else t.where.push({booleanOperator:"AND",listOfExpr:[ne]});
          applied=true; break;
        }
      }
      summary.push(applied ? `Added filter: ${op.column} (${dict.fields[op.column]||op.column}) ${op.operator||"IN"} [${op.values.join(", ")}] on ${op.table}` : `Could not find table ${op.table}`);
    } else summary.push(`Unknown operation: ${op.op}`);
  }
  return { config: c, summary };
}

// ═══════════════════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════════════════
const MergedTableCard = ({ table, isExpanded, onToggle, unknownFields }) => {
  const cols = Array.from(table.columns.values()).sort((a,b) => a.name.localeCompare(b.name));
  const unknowns = cols.filter(c => c.humanName === c.name);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">{table.sourceName.slice(0,3)}</div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm">{table.humanName}</div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">{table.sourceName}{table.humanName===table.sourceName && <span className="ml-2 text-amber-500 font-sans">⚠ not in dictionary</span>}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {unknowns.length > 0 && <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{unknowns.length} unmapped</span>}
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">{cols.length} columns</span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded?"rotate-180":""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-gray-100 px-5 py-3">
          <div className="grid grid-cols-12 text-xs text-gray-400 uppercase tracking-wider font-medium pb-2 border-b border-gray-100 mb-1">
            <div className="col-span-4 sm:col-span-3">Technical Name</div>
            <div className="col-span-6 sm:col-span-7">Description</div>
            <div className="col-span-2">Stored</div>
          </div>
          {cols.map(col => (
            <div key={col.name} className={`grid grid-cols-12 items-center text-sm py-1.5 rounded px-1 -mx-1 transition-colors ${col.humanName===col.name?"bg-amber-50/50 hover:bg-amber-50":"hover:bg-indigo-50/40"}`}>
              <div className="col-span-4 sm:col-span-3 font-mono text-xs text-indigo-700 font-medium">{col.name}</div>
              <div className="col-span-6 sm:col-span-7 text-gray-700 text-xs">{col.humanName===col.name?<span className="text-amber-600 italic">{col.name} (unmapped)</span>:col.humanName}</div>
              <div className="col-span-2">{col.persist?<span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Yes</span>:<span className="text-gray-300 text-xs">–</span>}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// Main App
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [configJson, setConfigJson] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTables, setExpandedTables] = useState(new Set());
  const [tab, setTab] = useState("tables");
  const [search, setSearch] = useState("");
  const [modPrompt, setModPrompt] = useState("");
  const [modLoading, setModLoading] = useState(false);
  const [modHistory, setModHistory] = useState([]);

  const erp = useMemo(() => configJson ? detectERP(configJson.tables) : null, [configJson]);
  const dict = useMemo(() => erp ? getDict(erp) : null, [erp]);

  const handleParse = useCallback(() => {
    try {
      const obj = JSON.parse(jsonInput);
      if (!obj.tables || !Array.isArray(obj.tables)) throw new Error('JSON must have a "tables" array.');
      setConfigJson(obj); setError(null); setExpandedTables(new Set()); setTab("tables"); setSearch(""); setModHistory([]);
    } catch(e) { setError(e.message); setConfigJson(null); }
  }, [jsonInput]);

  const merged = useMemo(() => (configJson && dict ? mergeBySourceTable(configJson.tables, dict) : []), [configJson, dict]);
  const filters = useMemo(() => (configJson && dict ? extractFilters(configJson.tables, dict) : []), [configJson, dict]);

  const grouped = useMemo(() => {
    if (!dict) return {};
    const g = {};
    for (const t of merged) { const cat = dict.categorize(t.sourceName); if(!g[cat])g[cat]=[]; g[cat].push(t); }
    return g;
  }, [merged, dict]);

  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const s = search.toLowerCase(); const r = {};
    for (const [cat, tables] of Object.entries(grouped)) {
      const f = tables.filter(t => t.sourceName.toLowerCase().includes(s)||t.humanName.toLowerCase().includes(s)||Array.from(t.columns.values()).some(c=>c.name.toLowerCase().includes(s)||c.humanName.toLowerCase().includes(s)));
      if (f.length>0) r[cat]=f;
    }
    return r;
  }, [grouped, search]);

  const toggleExpand = k => setExpandedTables(p => {const n=new Set(p);n.has(k)?n.delete(k):n.add(k);return n;});
  const expandAll = () => setExpandedTables(new Set(merged.map(t=>t.sourceName)));
  const collapseAll = () => setExpandedTables(new Set());

  const configSummary = useMemo(() => {
    if (!merged.length||!dict) return "";
    return merged.map(t => {
      const cols = Array.from(t.columns.values()).map(c=>`${c.name} (${c.humanName})`).join(", ");
      return `Table: ${t.sourceName} (${t.humanName}) — Columns: ${cols}`;
    }).join("\n");
  }, [merged, dict]);

  const handleModify = useCallback(async () => {
    if (!modPrompt.trim()||!configJson||!dict) return;
    setModLoading(true);
    const thisPrompt = modPrompt;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You translate English modification requests into structured JSON operations for an ${erp} extraction config.\n\nHere are the available tables and their columns:\n${configSummary}\n\nReturn ONLY a JSON array of operations. No markdown, no backticks, no explanation.\n\nAvailable operations:\n1. Remove a column: {"op":"remove_column","table":"<TABLE>","column":"<COLUMN>"}\n2. Remove a table: {"op":"remove_table","table":"<TABLE>"}\n3. Add a filter: {"op":"add_filter","table":"<TABLE>","column":"<COLUMN>","operator":"IN","values":["val1"]}\n\nThe user may use English names or technical names. You must resolve to the technical names using the table/column list above.\n\nReturn ONLY the JSON array.`,
          messages: [{role:"user",content:thisPrompt}],
        }),
      });
      const data = await response.json();
      const text = (data.content||[]).map(b=>b.text||"").join("");
      const clean = text.replace(/```json|```/g,"").trim();
      const operations = JSON.parse(clean);
      if (!Array.isArray(operations)) throw new Error("AI did not return an operations array");
      const {config:newConfig, summary} = applyOperations(configJson, operations, dict);
      setModHistory(prev => [...prev, {prompt:thisPrompt, timestamp:new Date().toLocaleTimeString(), success:true, summary, operations}]);
      setConfigJson(newConfig); setJsonInput(JSON.stringify(newConfig,null,2)); setModPrompt("");
    } catch(err) {
      setModHistory(prev => [...prev, {prompt:thisPrompt, timestamp:new Date().toLocaleTimeString(), success:false, error:err.message}]);
    } finally { setModLoading(false); }
  }, [modPrompt, configJson, configSummary, erp, dict]);

  const totalCols = merged.reduce((s,t) => s+t.columns.size, 0);
  const unmappedTables = merged.filter(t => t.humanName === t.sourceName).length;
  const unmappedFields = merged.reduce((s,t) => s + Array.from(t.columns.values()).filter(c=>c.humanName===c.name).length, 0);

  const catKeys = Object.keys(filteredGrouped).sort((a,b) => {
    if(a==="Other") return 1; if(b==="Other") return -1;
    return a.localeCompare(b);
  });

  const catIcons = {"General Ledger":"📒","Fiscal Periods":"📅","Business Partners":"🤝","AR Invoices & Credit Notes":"🧾","AP Invoices & Credit Notes":"📥","Down Payments":"💰","Payments":"💳","Aging":"⏳","Accruals & Reconciliation":"🔄","Banking":"🏦","Purchase Orders & GR":"📦","Sales Orders & Delivery":"🚚","Sales Quotations":"📋","Inventory":"🏭","Item Master":"📦","Tax Configuration":"🧮","HSN / SAC Codes":"🏷️","Cost Centers":"📊","Geography":"🌍","Branch / Plant":"🏢","Document Series":"🔢","Exchange Rates":"💱","Budgeting":"📈","Fixed Assets":"🏗️","System":"⚙️","Accounting":"📒","Billing & Sales":"🧾","Purchasing & Invoicing":"📦","Material & Delivery":"🚚","Material Master":"🏭","Config & Reference Data":"⚙️","India Localization":"🇮🇳","Controlling":"📊","Other":"📁"};

  const examplesForERP = erp === "SAP B1" ? [
    "Remove the Exchange Rate column from GL Journal Headers",
    "Stop extracting the Bank Statements table",
    "Only extract Cancelled = N from AR Invoice Headers",
    "Remove Period Start and Period End from all invoice lines",
    "Don't extract the Budget tables",
    "Filter GL lines to only include Profit Center code 100",
  ] : [
    "Remove the Exchange Rate column from Accounting Document Header",
    "Stop extracting the Address Management table",
    "Only extract document type RE from accounting headers",
    "Remove Reference Key 1, 2, and 3 from line items",
    "Don't extract the Profit Center Master table",
    "Filter line items to only include vendor account type",
  ];

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#f8fafc 0%,#eef2ff 40%,#f5f3ff 70%,#f1f5f9 100%)",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`.font-mono{font-family:'JetBrains Mono',monospace}textarea{font-family:'JetBrains Mono',monospace}.custom-sb::-webkit-scrollbar{width:5px}.custom-sb::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}@keyframes spin{to{transform:rotate(360deg)}}.anim-spin{animation:spin .8s linear infinite}`}</style>

      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Extraction Config Viewer</h1>
              <p className="text-xs text-gray-500">View what's being extracted · Modify with plain English</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {erp && <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{erp}</span>}
            {configJson && <button onClick={()=>{setConfigJson(null);setJsonInput("");setError(null);setModHistory([]);}} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg transition hover:bg-indigo-100">← New Config</button>}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {!configJson && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-gray-900 mb-1">Paste your Extraction Config JSON</h2>
            <p className="text-xs text-gray-500 mb-3">Auto-detects ERP type (SAP HANA, SAP B1) and loads the right dictionary.</p>
            <textarea value={jsonInput} onChange={e=>setJsonInput(e.target.value)} placeholder='{ "tables": [ ... ] }' rows={12} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none resize-y bg-gray-50 custom-sb"/>
            {error && <div className="mt-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</div>}
            <button onClick={handleParse} disabled={!jsonInput.trim()} className="mt-3 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">Parse & Visualize</button>
          </div>
        )}

        {configJson && dict && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                {label:"Source Tables",value:merged.length,sub:"unique tables being read",color:"text-indigo-600"},
                {label:"Total Columns",value:totalCols,sub:"fields being extracted",color:"text-violet-600"},
                {label:"Active Filters",value:filters.length,sub:"conditions on the data",color:"text-amber-600"},
                {label:"Unmapped",value:`${unmappedTables}T / ${unmappedFields}F`,sub:"tables / fields not in dictionary",color:unmappedTables+unmappedFields>0?"text-amber-500":"text-emerald-600"},
              ].map(s=>(
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs font-semibold text-gray-900 mt-0.5">{s.label}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1 mb-5 w-fit">
              {[
                {key:"tables",label:"Tables & Columns",icon:"M4 6h16M4 10h16M4 14h16M4 18h16"},
                {key:"filters",label:"Filters",icon:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"},
                {key:"modify",label:"Modify Config",icon:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"},
              ].map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t.key?"bg-white text-indigo-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={t.icon}/></svg>{t.label}
                </button>
              ))}
            </div>

            {tab==="tables" && (
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input type="text" placeholder="Search tables or columns..." value={search} onChange={e=>setSearch(e.target.value)} className="border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-sm w-72 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"/>
                  </div>
                  <button onClick={expandAll} className="text-xs text-indigo-600 hover:underline font-medium">Expand All</button>
                  <button onClick={collapseAll} className="text-xs text-indigo-600 hover:underline font-medium">Collapse All</button>
                </div>
                <div className="space-y-6">
                  {catKeys.map(cat=>(
                    <div key={cat}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-base">{catIcons[cat]||"📁"}</span>
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">{cat}</h3>
                        <span className="text-xs text-gray-300 font-medium">{filteredGrouped[cat].length} tables</span>
                      </div>
                      <div className="space-y-2 ml-1">
                        {filteredGrouped[cat].map(t=><MergedTableCard key={t.sourceName} table={t} isExpanded={expandedTables.has(t.sourceName)} onToggle={()=>toggleExpand(t.sourceName)}/>)}
                      </div>
                    </div>
                  ))}
                  {catKeys.length===0 && <div className="text-center text-gray-400 py-10 text-sm">No tables match.</div>}
                </div>
              </div>
            )}

            {tab==="filters" && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900">Active Filters ({filters.length})</h2>
                  <p className="text-xs text-gray-500 mt-0.5">These conditions control what data is included</p>
                </div>
                {filters.length===0?<div className="px-5 py-10 text-center text-gray-400 text-sm">No hardcoded filters found.</div>:
                <div className="divide-y divide-gray-50">{filters.map((f,i)=>(
                  <div key={i} className="px-5 py-3 hover:bg-amber-50/30 transition-colors">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">{f.sourceTable}</span>
                      <span className="text-gray-300">→</span>
                      <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">{f.column}</span>
                      <span className="text-xs text-gray-500">({f.columnHuman})</span>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{OP_DISPLAY[f.operator]||f.operator}</span>
                      <span className="font-mono text-xs text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-medium">{f.values.join(", ")}</span>
                    </div>
                  </div>
                ))}</div>}
              </div>
            )}

            {tab==="modify" && (
              <div className="space-y-4 max-w-3xl">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-1">Modify Config with Plain English</h2>
                  <p className="text-xs text-gray-500 mb-4">Describe changes naturally — works with both English and technical names.</p>
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Try these examples:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {examplesForERP.map(ex=>(<button key={ex} onClick={()=>setModPrompt(ex)} className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg px-2.5 py-1.5 transition text-left leading-tight">{ex}</button>))}
                    </div>
                  </div>
                  <div className={`border-2 rounded-xl overflow-hidden transition-colors ${modLoading?"border-indigo-400":"border-gray-200 focus-within:border-indigo-300"}`}>
                    <textarea value={modPrompt} onChange={e=>setModPrompt(e.target.value)} placeholder="e.g. Remove the Exchange Rate column from GL Journal Headers..." rows={3} disabled={modLoading}
                      onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleModify();}}}
                      className="w-full px-4 py-3 text-sm outline-none resize-none disabled:bg-gray-50 disabled:text-gray-400" style={{fontFamily:"'DM Sans',system-ui"}}/>
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Enter to apply</span>
                      <button onClick={handleModify} disabled={!modPrompt.trim()||modLoading} className="px-5 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                        {modLoading?(<><svg className="anim-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Applying...</>):(<><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Apply Change</>)}
                      </button>
                    </div>
                  </div>
                </div>

                {modHistory.length>0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Change History</h3>
                    <div className="space-y-2.5">
                      {[...modHistory].reverse().map((h,i)=>(
                        <div key={i} className={`p-3 rounded-xl ${h.success?"bg-emerald-50/60 border border-emerald-100":"bg-rose-50/60 border border-rose-100"}`}>
                          <div className="flex items-start gap-3">
                            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${h.success?"bg-emerald-200 text-emerald-800":"bg-rose-200 text-rose-800"}`}>{h.success?"✓":"✕"}</span>
                            <div className="min-w-0 flex-1">
                              <div className="text-gray-800 text-sm font-medium">{h.prompt}</div>
                              <div className="text-xs text-gray-400 mt-1">{h.timestamp}</div>
                              {h.success&&h.summary&&<div className="mt-2 space-y-0.5">{h.summary.map((s,j)=><div key={j} className="text-xs text-emerald-700 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0"/>{s}</div>)}</div>}
                              {h.error&&<div className="text-xs text-rose-500 mt-1">{h.error}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <details className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <summary className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none">View / Copy Raw JSON</summary>
                  <div className="px-5 pb-4">
                    <div className="flex justify-end mb-2"><button onClick={()=>navigator.clipboard?.writeText(JSON.stringify(configJson,null,2))} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy JSON</button></div>
                    <pre className="text-xs font-mono text-gray-600 bg-gray-50 rounded-xl p-4 overflow-auto max-h-80 custom-sb border border-gray-100">{JSON.stringify(configJson,null,2)}</pre>
                  </div>
                </details>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
