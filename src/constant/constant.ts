import { SplitStats } from "@/types/admin/initSplitStats";

export const keepaTimeSummand = 21564000;
export const DEFAULT_MAX_BSR = 10000000;
export const STALETIME = 1000 * 60 * 10;
export const GCTIME = 10000 * 60 * 24;
export const PRODUCT_COL = "products";
export const WHOLESALE_COL = "wholesale";
export const TASK_COL = "tasks";
export const SALES_COL = "sales";
export const amazonTransportFee = 0.25;
export const aznCategoryMapping = [
  { label: "Alle Kategorien", value: 0 },
  { label: "Auto & Motorrad", value: 78191031 },
  { label: "Baby", value: 355007011 },
  { label: "Baumarkt", value: 80084031 },
  { label: "Beleuchtung", value: 213083031 },
  { label: "Bürobedarf & Schreibwaren", value: 192416031 },
  { label: "Computer & Zubehör", value: 340843031 },
  { label: "Drogerie & Körperpflege", value: 64187031 },
  { label: "Elektro-Großgeräte", value: 908823031 },
  { label: "Elektronik & Foto", value: 562066 },
  { label: "Garten", value: 10925031 },
  { label: "Gewerbe, Industrie & Wissenschaft", value: 5866098031 },
  { label: "Haustier", value: 340852031 },
  { label: "Kamera & Foto", value: 571860 },
  { label: "Koffer, Rucksäcke & Taschen", value: 11961464031 },
  { label: "Kosmetik", value: 84230031 },
  { label: "Küche, Haushalt & Wohnen", value: 3167641 },
  { label: "Lebensmittel & Getränke", value: 340846031 },
  { label: "Musikinstrumente & DJ-Equipment", value: 340849031 },
  { label: "Schmuck", value: 10459505031 },
  // { label: "Schuhe & Handtaschen", value: 11961464031 },
  { label: "Spielzeug", value: 12950651 },
  { label: "Sport & Freizeit", value: 16435051 },
  { label: "Uhren", value: 10084739031 },
];

export const ebyCategoryMapping = [
  {
    label: "Alle Kategorien",
    value: 0,
  },
  {
    label: "Computer, Tablets & Netzwerk",
    value: 58058,
  },
  {
    label: "Drucker",
    value: 1245,
  },
  {
    label: "Ersatzteile & Werkzeuge (Unterkategorie von PC und Videospiele)",
    value: 171833,
  },
  {
    label: "Foto & Camcorder",
    value: 625,
  },
  {
    label: "Speicherkarten",
    value: 18871,
  },
  {
    label: "Objektive",
    value: 3323,
  },
  {
    label: "Handys & Kommunikation",
    value: 15032,
  },
  {
    label: "Speicherkarten",
    value: 96991,
  },
  {
    label: "Haushaltsgeräte",
    value: 20710,
  },
  {
    label: "Konsolen (Unterkategorie von PC und Videospiele)",
    value: 139971,
  },
  {
    label: "Scanner",
    value: 11205,
  },
  {
    label: "Speicherkarten (Unterkategorie von PC und Videospiele)",
    value: 117045,
  },
  {
    label: "TV, Video & Audio",
    value: 293,
  },
  {
    label: "Elektrische Geräte Enthaarung & Rasur",
    value: 260783,
  },
  {
    label: "Elektrische Mund- & Zahnpflege",
    value: 260774,
  },
  {
    label: "Elektrische Haarstyling Geräte",
    value: 260773,
  },
  {
    label: "Drucker, Scanner & Zubehör",
    value: 171961,
  },
  {
    label: "Ersatzteile & Werkzeuge (Unterkategorie von TV, Video & Audio)",
    value: 163769,
  },
  {
    label: "Handy-Zubehör",
    value: 9394,
  },
  {
    label: "Haushaltsbatterien & Strom",
    value: 48446,
  },
  {
    label: "Kabel & Steckverbinder",
    value: 182094,
  },
  {
    label: "Kameras, Drohnen & Fotozubehör",
    value: 15200,
  },
  {
    label: "Notebook- & Desktop-Zubehör",
    value: 31530,
  },
  {
    label: "Objektive & Filter",
    value: 78997,
  },
  {
    label: "Stative & Zubehör",
    value: 30090,
  },
  {
    label: "Tablet & eBook Zubehör",
    value: 176970,
  },
  {
    label: "Tastaturen, Mäuse & Pointing",
    value: 3676,
  },
  {
    label: "TV- & Heim-Audio-Zubehör",
    value: 14961,
  },
  {
    label: "Zubehör (Unterkategorie von PC & Videospiele)",
    value: 54968,
  },
  {
    label: "Zubehör für tragbare Audiogeräte",
    value: 56169,
  },
  {
    label: "Auto & Motorrad: Teile",
    value: 131090,
  },
  {
    label: "Autoentertainment",
    value: 171101,
  },
  {
    label: "Dashcams",
    value: 174121,
  },
  {
    label: "Elektronikzubehör",
    value: 169423,
  },
  {
    label: "Einparkhilfen",
    value: 258037,
  },
  {
    label: "GPS & Navigationsgeräte",
    value: 139835,
  },
  {
    label: "Ladestationen- & Ladegeräte-Zubehör",
    value: 262101,
  },
  {
    label: "Ladestationen & -geräte",
    value: 262098,
  },
  {
    label: "Felgen",
    value: 179679,
  },
  {
    label: "Kompletträder",
    value: 179681,
  },
  {
    label: "Reifen",
    value: 179680,
  },
  {
    label: "Kleidung, Schutzausrüstung & Merchandise",
    value: 6747,
  },
  {
    label: "Transportsysteme",
    value: 262215,
  },
  {
    label: "Motoröl",
    value: 179496,
  },
  {
    label: "Business & Industrie",
    value: 12576,
  },
  {
    label: "Garten & Terrasse",
    value: 159912,
  },
  {
    label: "Heimwerker",
    value: 3187,
  },
  {
    label: "Kleidung & Accessoires",
    value: 11450,
  },
  {
    label:
      "Sneaker (Unterkategorie von Herrenschuhe) Sneaker (Unterkategorie von Damenschuhe)",
    value: 15709,
  },
  {
    label: "Sneaker (Unterkategorie von Damenschuhe)",
    value: 95672,
  },
  {
    label: "Uhren & Schmuck",
    value: 281,
  },
  {
    label: "Münzen",
    value: 11116,
  },
  {
    label: "Armband- & Taschenuhren",
    value: 260325,
  },
  {
    label: "Sammleruhren",
    value: 10682,
  },
  {
    label: "Weitere Uhren",
    value: 258031,
  },
  {
    label: "Zubehör",
    value: 260328,
  },
  {
    label: "Filme & Serien",
    value: 11232,
  },
  {
    label: "Musik",
    value: 11233,
  },
  {
    label: "Tickets",
    value: 1305,
  },
  {
    label: "PC- & Videospiele",
    value: 1249,
  },
  {
    label: "Musikinstrumente",
    value: 619,
  },
  {
    label: "Film NFTs",
    value: 262053,
  },
  {
    label: "Musik NFTs",
    value: 262054,
  },
  {
    label: "NFT-Kunst",
    value: 262051,
  },
  {
    label: "TCG NFTs",
    value: 262056,
  },
  {
    label: "Non-Sport Trading Card NFTs",
    value: 262052,
  },
  {
    label: "Sport Trading Card NFTs",
    value: 262055,
  },
  {
    label: "Aufkommende NFTs",
    value: 262050,
  },
  {
    label: "Modellbau",
    value: 22128,
  },
  {
    label: "Reisen",
    value: 3252,
  },
  {
    label: "Baby",
    value: 2984,
  },
  {
    label: "Bastel- & Künstlerbedarf",
    value: 14339,
  },
  {
    label: "Feinschmecker",
    value: 14308,
    tax: 7,
  },
  {
    label: "Haustierbedarf",
    value: 1281,
  },
  {
    label: "Trading Cards",
    value: 8662,
  },
  {
    label: "Sammelkartenspiele/TCGs",
    value: 2536,
  },
  {
    label: "Verschiedenes",
    value: 99,
  },
  {
    label: "Antiquitäten & Kunst",
    value: 353,
  },
  {
    label: "Beauty & Gesundheit",
    value: 26395,
  },
  {
    label: "Briefmarken",
    value: 260,
  },
  {
    label: "Bücher & Zeitschriften",
    value: 267,
    tax: 7,
  },
  {
    label: "Büro & Schreibwaren",
    value: 9815,
  },
  {
    label: "Möbel & Wohnen",
    value: 11700,
  },
  {
    label: "Sammeln & Seltenes",
    value: 1,
  },
  {
    label: "Spielzeug",
    value: 220,
  },
  {
    label: "Sport",
    value: 888,
  },
];

export const initStatsPerDay: SplitStats = {
  0: {
    total: 0,
    tasks: [],
  },
  1: {
    total: 0,
    tasks: [],
  },
  2: {
    total: 0,
    tasks: [],
  },
  3: {
    total: 0,
    tasks: [],
  },
  4: {
    total: 0,
    tasks: [],
  },
  5: {
    total: 0,
    tasks: [],
  },
  6: {
    total: 0,
    tasks: [],
  },
};
