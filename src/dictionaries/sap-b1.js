/**
 * SAP Business One (B1) Dictionary
 *
 * HOW TO EXTEND:
 * 1. Add new table entries to TABLES object: { TABLE_NAME: "Human Readable Name" }
 * 2. Add new field entries to FIELDS object: { FIELD_NAME: "Human Readable Name" }
 * 3. Update categorize() if you add tables that don't fit existing categories
 *
 * SOURCES:
 * - defmacro sapb1 doc (complete SAP B1 column specification)
 * - SAP B1 config update doc
 * - Customer extraction configs
 *
 * NOTE ON JOINED TABLES:
 * SAP B1 configs often have joined table names like OINV_OITM, ORIN_OITM etc.
 * The categorize() function strips these prefixes to match the base table.
 */

export const TABLES = {
  // General Ledger & Journal Entries
  JDT1: "GL Journal Lines",
  OJDT: "GL Journal Headers",
  OACT: "Chart of Accounts",

  // Fiscal Periods
  OACP: "Posting Periods",
  OFPR: "Fiscal Periods",

  // Business Partners
  OCRD: "Business Partner Master",
  CRD1: "BP Addresses",
  OCTG: "Payment Terms",
  OCRG: "BP Groups",

  // AR Invoices & Credit Notes
  OINV: "AR Invoice Header",
  INV1: "AR Invoice Lines",
  INV4: "AR Invoice Tax Lines",
  INV12: "AR Invoice GST Details",
  ORIN: "AR Credit Note Header",
  RIN1: "AR Credit Note Lines",
  RIN4: "AR Credit Note Tax Lines",
  RIN12: "AR Credit Note GST Details",

  // AP Invoices & Credit Notes
  OPCH: "AP Invoice Header",
  PCH1: "AP Invoice Lines",
  PCH4: "AP Invoice Tax Lines",
  PCH12: "AP Invoice GST Details",
  ORPC: "AP Credit Note Header",
  RPC1: "AP Credit Note Lines",
  RPC4: "AP Credit Note Tax Lines",
  RPC12: "AP Credit Note GST Details",

  // Down Payments (Advances)
  ODPI: "Down Payment Invoice Header",
  DPI1: "Down Payment Invoice Lines",
  DPI4: "Down Payment Invoice Tax Lines",
  DPI12: "Down Payment Invoice GST Details",

  // Payments
  ORCT: "Incoming Payment Header",
  RCT1: "Incoming Payment Lines",
  RCT2: "Incoming Payment Accounts",
  OVPM: "Outgoing Payment Header",
  VPM1: "Outgoing Payment Lines",
  VPM2: "Outgoing Payment Accounts",

  // Aging
  OARG: "AR Aging",
  OACG: "AP Aging",

  // Accruals & Reconciliation
  OACS: "Accrual Postings",
  OITR: "Internal Reconciliation Header",
  ITR1: "Internal Reconciliation Lines",

  // Banking
  OBNK: "Bank Master",
  OBTF: "Bank Statements",

  // Purchase Orders & Goods Receipt
  OPOR: "Purchase Order Header",
  POR1: "Purchase Order Lines",
  OPDN: "Goods Receipt PO Header",
  PDN1: "Goods Receipt PO Lines",

  // Sales Orders & Delivery
  ORDR: "Sales Order Header",
  RDR1: "Sales Order Lines",
  ODLN: "Delivery Header",
  DLN1: "Delivery Lines",

  // Sales Quotations
  OQUT: "Sales Quotation Header",
  QUT1: "Sales Quotation Lines",

  // Inventory
  OINM: "Inventory Transactions",
  OITW: "Item Warehouse Stock",
  OITB: "Item Groups",

  // Item Master (standalone + joined variants)
  OITM: "Item Master",
  OINV_OITM: "Item Master (AR Invoice)",
  ORIN_OITM: "Item Master (AR Credit Note)",
  OPCH_OITM: "Item Master (AP Invoice)",
  ORPC_OITM: "Item Master (AP Credit Note)",
  ODPI_OITM: "Item Master (Down Payment)",

  // Tax Configuration
  OSTA: "Tax Authority",
  OSTC: "Tax Codes Master",
  STC1: "Tax Code Details",

  // HSN / SAC Codes
  OCHP: "HSN Chapter Master",
  OSAC: "SAC Service Master",

  // Cost Centers & Dimensions
  OOCR: "Cost Center / Profit Center",

  // Geography
  OCST: "State Master",

  // Branch / Plant
  OBPL: "Branch / Plant Master",

  // Document Series
  NNM1: "Document Numbering Series",

  // Exchange Rates & Currency
  ORTT: "Exchange Rates",
  OCRN: "Currency Master",

  // Budgeting
  OBGS: "Budget Scenarios",
  OBGT: "Budget Lines",

  // Fixed Assets
  OATR: "Asset Master",
  ATR1: "Asset Transactions",

  // System
  OUSR: "Users",
  OADM: "Company Master",
};

export const FIELDS = {
  // ── Common / System ──────────────────────────────────────────
  DataBase: "Database Name",
  created_at: "Record Created At",
  CreateDate: "Created Date",
  CreateTS: "Created Timestamp",
  UpdateDate: "Updated Date",

  // ── GL / Journal ─────────────────────────────────────────────
  TransId: "Transaction ID",
  BPLId: "Branch / Plant ID",
  Line_ID: "Line Number",
  Account: "G/L Account",
  Debit: "Debit Amount",
  Credit: "Credit Amount",
  FCDebit: "Debit (Foreign Currency)",
  FCCredit: "Credit (Foreign Currency)",
  ShortName: "Account Short Name",
  ContraAct: "Contra Account",
  LineMemo: "Line Memo",
  TransType: "Transaction Type",
  RefDate: "Reference Date",
  OrgBPName: "Original BP Name",
  OrgAccName: "Original Account Name",
  Ref1: "Reference 1",
  Ref2: "Reference 2",
  Ref3: "Reference 3",
  Ref3Line: "Reference 3 (Line)",
  ProfitCode: "Profit Center Code",
  BaseRef: "Base Reference",
  LocTotal: "Total (Local Currency)",
  TaxDate: "Tax Date",
  Memo: "Memo / Remarks",
  FcTotal: "Total (Foreign Currency)",
  TransCurr: "Transaction Currency",
  StornoToTr: "Reversal Transaction",
  Number: "Document Number",
  DueDate: "Due Date",
  Series: "Document Series",
  AutoVAT: "Auto VAT",
  VatDate: "VAT Date",
  Indicator: "Indicator",
  UseAutoStorno: "Auto Storno",
  FCCurrency: "Foreign Currency",
  VatGroup: "Tax Group",
  SystemRate: "System Exchange Rate",
  Project: "Project Code",

  // ── Chart of Accounts ────────────────────────────────────────
  AcctCode: "Account Code",
  AcctName: "Account Name",
  Segment_0: "Segment 0",
  Segment_1: "Segment 1",
  Segment_2: "Segment 2",
  Segment_3: "Segment 3",
  Segment_4: "Segment 4",
  Segment_5: "Segment 5",
  Segment_6: "Segment 6",
  Segment_7: "Segment 7",
  Segment_8: "Segment 8",
  Segment_9: "Segment 9",
  FormatCode: "Format Code",
  ActType: "Account Type",

  // ── Fiscal Periods ───────────────────────────────────────────
  AbsEntry: "Absolute Entry ID",
  Year: "Fiscal Year",
  F_RefDate: "Period Start Date",
  T_RefDate: "Period End Date",
  Code: "Code",
  Name: "Name",
  Category: "Category",

  // ── Business Partners ────────────────────────────────────────
  CardCode: "BP Code",
  CardName: "BP Name",
  CardType: "BP Type (Customer/Vendor)",
  GroupCode: "BP Group Code",
  Currency: "Currency",
  Balance: "Balance",
  OrdersBal: "Orders Balance",
  DnotesBal: "Delivery Notes Balance",
  CreditLine: "Credit Limit",
  DebtLine: "Debt Limit",
  GroupNum: "Payment Terms Group",
  Phone1: "Phone Number",
  E_Mail: "Email Address",
  Notes: "Notes",
  ValidFor: "Active",
  FrozenFor: "Frozen / Inactive",

  // ── BP Addresses ─────────────────────────────────────────────
  Address: "Address Name",
  AdresType: "Address Type (Bill/Ship)",
  Street: "Street",
  Block: "Block",
  City: "City",
  State: "State",
  Country: "Country",
  ZipCode: "Zip Code",
  GSTRegnNo: "GST Registration Number",

  // ── Payment Terms ────────────────────────────────────────────
  PymntGroup: "Payment Group Name",
  ExtraDays: "Extra Days",
  ExtraMonth: "Extra Months",
  GroupName: "Group Name",
  GroupType: "Group Type",

  // ── Document Common Fields ───────────────────────────────────
  DocEntry: "Document Entry ID",
  DocNum: "Document Number",
  GSTTranTyp: "GST Transaction Type",
  DocDate: "Document Date",
  CANCELED: "Cancelled",
  DocTotal: "Document Total",
  NumAtCard: "Vendor/Customer Ref No",
  U_OMS_DOC: "OMS Document Reference",
  DutyStatus: "Duty Status",
  VatSum: "Tax Total (Local)",
  VatSumFC: "Tax Total (Foreign Currency)",
  DiscPrcnt: "Discount %",
  DiscSum: "Discount Amount",
  DiscSumFC: "Discount Amount (FC)",
  ObjType: "Object Type",
  RevRefNo: "Revised Reference Number",
  RevRefDate: "Revised Reference Date",
  DocCur: "Document Currency",
  DocRate: "Exchange Rate",
  DocStatus: "Document Status",
  DocDueDate: "Due Date",
  PaidToDate: "Paid To Date",
  GrosProfit: "Gross Profit",
  Comments: "Comments / Remarks",
  PaymentRef: "Payment Reference",
  BaseEntry: "Base Document Entry",
  BaseType: "Base Document Type",
  BaseLine: "Base Document Line",
  ConfirmNo: "Vendor Confirmation No",
  DocType: "Document Type",

  // ── Line Item Common ─────────────────────────────────────────
  ItemCode: "Item Code",
  LineNum: "Line Number",
  Quantity: "Quantity",
  unitMsr: "Unit of Measure",
  Price: "Unit Price",
  LineTotal: "Line Total",
  TaxCode: "Tax Code",
  HsnEntry: "HSN Entry",
  AcctCode: "G/L Account Code",
  SacEntry: "SAC Entry",
  U_PeriodStart: "Period Start",
  U_PeriodEnd: "Period End",
  Dscription: "Item Description",
  WhsCode: "Warehouse Code",
  OpenQty: "Open Quantity",
  GrossBuyPr: "Gross Buying Price",
  LineStatus: "Line Status",
  U_assetid: "Asset ID",

  // ── Tax Lines ────────────────────────────────────────────────
  LineSeq: "Line Sequence",
  TaxRate: "Tax Rate",
  TaxSum: "Tax Amount",
  staType: "State Type",
  DeductTax: "Deductible Tax",
  NonDdctPrc: "Non-Deductible %",

  // ── GST Details (x12 tables) ─────────────────────────────────
  LocStatCod: "Location State Code",
  BpCountry: "BP Country",
  BpGSTN: "BP GSTIN",
  StreetS: "Street (Ship)",
  BlockS: "Block (Ship)",
  BuildingS: "Building (Ship)",
  CityS: "City (Ship)",
  StateS: "State (Ship)",
  BpGSTType: "BP GST Type",
  LocGSTN: "Location GSTIN",
  ImpORExp: "Import / Export",
  ExportType: "Export Type",
  ImpExpNo: "Import/Export Number",
  PortCode: "Port Code",
  Address2S: "Address Line 2 (Ship)",

  // ── Payments ─────────────────────────────────────────────────
  VATRegNum: "VAT Registration Number",
  InvType: "Invoice Type",
  DocLine: "Document Line",
  SumApplied: "Amount Applied",
  AppliedFC: "Applied (Foreign Currency)",
  AppliedSys: "Applied (System Currency)",
  CashAcct: "Cash Account",
  AccountCode: "Account Code",
  SysDebit: "System Debit",
  SysCredit: "System Credit",
  CashSum: "Cash Amount",
  TrsfrSum: "Transfer Amount",
  TrsfrAcct: "Transfer Account",
  CheckSum: "Check Amount",
  CheckAcct: "Check Account",
  Cancelled: "Cancelled",

  // ── Aging ────────────────────────────────────────────────────
  BalDueDeb: "Balance Due (Debit)",
  BalDueCred: "Balance Due (Credit)",
  BalFcDeb: "Balance Due FC (Debit)",
  BalFcCred: "Balance Due FC (Credit)",
  Matched: "Matched",
  IntrnMatch: "Internal Match",
  ExternMatch: "External Match",

  // ── Accruals ─────────────────────────────────────────────────
  PostDate: "Posting Date",
  TotalDebit: "Total Debit",
  TotalCredit: "Total Credit",
  JrnlMemo: "Journal Memo",

  // ── Banking ──────────────────────────────────────────────────
  BankCode: "Bank Code",
  BankName: "Bank Name",
  AcctNum: "Account Number",
  GLAccount: "G/L Account",
  Branch: "Branch",
  CurrncyCode: "Currency Code",
  StmtDate: "Statement Date",
  StmtNum: "Statement Number",
  Details: "Details",
  Ref: "Reference",
  Reconciled: "Reconciled",

  // ── Purchase Orders ──────────────────────────────────────────
  ShipDate: "Ship Date",
  Rate: "Exchange Rate",

  // ── Inventory ────────────────────────────────────────────────
  InQty: "Quantity In",
  OutQty: "Quantity Out",
  TransValue: "Transaction Value",
  CalcPrice: "Calculated Price",
  OnHand: "On Hand Quantity",
  IsCommited: "Committed Quantity",
  OnOrder: "On Order Quantity",
  AvgPrice: "Average Price",
  ItmsGrpCod: "Item Group Code",
  ItmsGrpNam: "Item Group Name",

  // ── Item Master ──────────────────────────────────────────────
  ItemName: "Item Name",
  ItemClass: "Item Class",
  GstTaxCtg: "GST Tax Category",
  InvntItem: "Inventory Item",
  ItemType: "Item Type",

  // ── Tax ──────────────────────────────────────────────────────
  Type: "Type",
  RvsCrgPrc: "Reverse Charge %",
  STCCode: "Tax Code",
  STACode: "Tax Authority Code",

  // ── HSN / SAC ────────────────────────────────────────────────
  ChapterID: "HSN Chapter ID",
  ServCode: "Service Code",
  ServName: "Service Name",

  // ── Cost Centers ─────────────────────────────────────────────
  OcrCode: "Cost Center Code",
  OcrName: "Cost Center Name",
  OcrTotal: "Cost Center Total",

  // ── State ────────────────────────────────────────────────────
  GSTCode: "GST State Code",

  // ── Branch / Plant ───────────────────────────────────────────
  BPLName: "Branch Name",
  Disabled: "Disabled",
  MainBPL: "Main Branch",
  TaxIdNum: "Tax ID Number",
  AliasName: "Alias Name",

  // ── Document Series ──────────────────────────────────────────
  ObjectCode: "Object Code",
  SeriesName: "Series Name",
  BeginStr: "Beginning String",
  Locked: "Locked",
  DocSubType: "Document Sub Type",

  // ── Exchange Rates ───────────────────────────────────────────
  RateDate: "Rate Date",
  UserSign: "User Signature",
  UserSign2: "User Signature 2",
  CurrCode: "Currency Code",
  CurrName: "Currency Name",
  DocCurrCod: "Document Currency Code",

  // ── Budgeting ────────────────────────────────────────────────
  InitlRtio: "Initial Ratio",
  DivCode: "Division Code",
  Month: "Month",

  // ── Fixed Assets ─────────────────────────────────────────────
  AcqDate: "Acquisition Date",
  CapDate: "Capitalization Date",
  RetDate: "Retirement Date",
  Status: "Status",
  OrigValue: "Original Value",
  AcqValue: "Acquisition Value",
  DeprecAmt: "Depreciation Amount",
  TranType: "Transaction Type",
  BalanceAmt: "Balance Amount",
  Line: "Line Number",

  // ── Users ────────────────────────────────────────────────────
  USERID: "User ID",
  USER_CODE: "User Code",
  U_NAME: "User Name",

  // ── Company ──────────────────────────────────────────────────
  CompnyName: "Company Name",
  CompnyAddr: "Company Address",
  MainCurncy: "Main Currency",

  // ── Custom / UDF ─────────────────────────────────────────────
  U_Dimension1: "Custom Dimension 1",
  U_Dimension2: "Custom Dimension 2",
  u_groupentity: "Group Entity",
};

/**
 * Categorize a SAP B1 table into a functional group.
 * Handles joined table names like OINV_OITM by stripping the prefix.
 */
export function categorize(tableName) {
  const clean = tableName.replace(/^(OINV_|ORIN_|OPCH_|ORPC_|ODPI_)/, "");

  if (["JDT1", "OJDT", "OACT"].includes(clean)) return "General Ledger";
  if (["OACP", "OFPR"].includes(clean)) return "Fiscal Periods";
  if (["OCRD", "CRD1", "OCTG", "OCRG"].includes(clean)) return "Business Partners";
  if (["OINV", "INV1", "INV4", "INV12", "ORIN", "RIN1", "RIN4", "RIN12"].includes(clean)) return "AR Invoices & Credit Notes";
  if (["OPCH", "PCH1", "PCH4", "PCH12", "ORPC", "RPC1", "RPC4", "RPC12"].includes(clean)) return "AP Invoices & Credit Notes";
  if (["ODPI", "DPI1", "DPI4", "DPI12"].includes(clean)) return "Down Payments";
  if (["ORCT", "RCT1", "RCT2", "OVPM", "VPM1", "VPM2"].includes(clean)) return "Payments";
  if (["OARG", "OACG"].includes(clean)) return "Aging";
  if (["OACS", "OITR", "ITR1"].includes(clean)) return "Accruals & Reconciliation";
  if (["OBNK", "OBTF"].includes(clean)) return "Banking";
  if (["OPOR", "POR1", "OPDN", "PDN1"].includes(clean)) return "Purchase Orders & GR";
  if (["ORDR", "RDR1", "ODLN", "DLN1"].includes(clean)) return "Sales Orders & Delivery";
  if (["OQUT", "QUT1"].includes(clean)) return "Sales Quotations";
  if (["OINM", "OITW", "OITB"].includes(clean)) return "Inventory";
  if (clean === "OITM" || tableName.includes("_OITM")) return "Item Master";
  if (["OSTA", "OSTC", "STC1"].includes(clean)) return "Tax Configuration";
  if (["OCHP", "OSAC"].includes(clean)) return "HSN / SAC Codes";
  if (["OOCR"].includes(clean)) return "Cost Centers";
  if (["OCST"].includes(clean)) return "Geography";
  if (["OBPL"].includes(clean)) return "Branch / Plant";
  if (["NNM1"].includes(clean)) return "Document Series";
  if (["ORTT", "OCRN"].includes(clean)) return "Exchange Rates";
  if (["OBGS", "OBGT"].includes(clean)) return "Budgeting";
  if (["OATR", "ATR1"].includes(clean)) return "Fixed Assets";
  if (["OUSR", "OADM"].includes(clean)) return "System";
  return "Other";
}

/** Example modification prompts for SAP B1 configs */
export const EXAMPLE_PROMPTS = [
  "Remove the Exchange Rate column from GL Journal Headers",
  "Stop extracting the Bank Statements table",
  "Only extract Cancelled = N from AR Invoice Headers",
  "Remove Period Start and Period End from all invoice lines",
  "Don't extract the Budget tables",
  "Filter GL lines to only include Profit Center code 100",
];
