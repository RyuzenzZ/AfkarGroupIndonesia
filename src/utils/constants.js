// LOGIKA: Konstanta global AFKAR LAND — route admin fitur 21–50 + tema merah
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

export const SITE_NAME = "AFKAR LAND";
export const TAGLINE = "Membangun Masa depan property syariah di seluruh sulawesi";

// ── NAVIGASI PUBLIK ──
export const NAVIGATION_LINKS = [
  { name: 'Beranda',  path: '/' },
  { name: 'Tentang',  path: '/tentang' },
  { name: 'Layanan',  path: '/layanan' },
  { name: 'Properti', path: '/properti' },
  { name: 'Artikel',  path: '/artikel' },
];

// ── KONTAK PERUSAHAAN ──
export const COMPANY_CONTACT = {
  address: "Jl. Tamalanrea Utara 4, Tamalanrea, Kec. Tamalanrea, Kota Makassar, Sulawesi Selatan",
  phone: "+62 85705218281",
  email: "afkargroupindonesia@gmail.com",
};

// ── ADMIN ROUTES LENGKAP (FITUR 21–50) ──
export const ADMIN_ROUTES = {
  DASHBOARD:              '/admin/dashboard',
  LOGIN:                  '/admin/login',
  SETTINGS:               '/admin/settings',
  USERS:                  '/admin/users',

  // CRM
  LEADS:                  '/admin/leads',
  MESSAGES:               '/admin/messages',
  SURVEY:                 '/admin/survey',
  APPLICATIONS:           '/admin/applications',

  // F.21 — Booking
  BOOKINGS:               '/admin/bookings',
  BOOKINGS_APPROVAL:      '/admin/bookings/approval',
  BOOKINGS_INVOICE:       '/admin/bookings/invoice',

  // F.22 — Siteplan
  SITEPLAN:               '/admin/siteplan',

  // F.23 — Unit
  UNITS:                  '/admin/units',

  // F.24 — Dokumen
  DOCUMENTS:              '/admin/documents',

  // F.25 — Survey (sudah di CRM)
  // F.26 — Notifikasi
  NOTIFICATIONS:          '/admin/notifications',

  // F.27 — Marketing
  PERFORMANCE:            '/admin/performance',
  LEADERBOARD:            '/admin/performance/leaderboard',

  // F.28 — Customer
  CUSTOMERS:              '/admin/customers',
  CUSTOMERS_PROGRESS:     '/admin/customers/progress',
  CUSTOMERS_PAYMENTS:     '/admin/customers/payments',

  // F.29 — WA Auto
  WHATSAPP_AUTO:          '/admin/whatsapp-auto',

  // F.30 — AI Content
  AI_CONTENT:             '/admin/ai-content',

  // F.31 — Form Builder
  FORMS:                  '/admin/forms',

  // F.32 — Event
  EVENTS:                 '/admin/events',

  // F.33 — Social Media
  SOCIAL_MEDIA:           '/admin/social-media',

  // F.34 — Finance
  FINANCE:                '/admin/finance',

  // F.35 — Live Chat
  LIVE_CHAT:              '/admin/live-chat',

  // F.36 — Smart Search
  SMART_SEARCH:           '/admin/smart-search',

  // F.37 — Comparison
  COMPARISON:             '/admin/comparison',

  // F.38 — Map
  MAP:                    '/admin/map',

  // F.39 — Video
  VIDEOS:                 '/admin/videos',

  // F.40 — Mobile App
  MOBILE_APP:             '/admin/mobile-app',

  // F.41 — Download Tracking
  DOWNLOAD_TRACKING:      '/admin/download-tracking',

  // F.42 — Heatmap
  HEATMAP:                '/admin/heatmap',

  // F.43 — Backup
  BACKUP:                 '/admin/backup',

  // F.44 — Tasks
  TASKS:                  '/admin/tasks',

  // F.45 — Widget Customizer
  WIDGET_CUSTOMIZER:      '/admin/widget-customizer',

  // F.46 — Landing Pages
  LANDING_PAGES:          '/admin/landing-pages',

  // F.47 — Calculator
  CALCULATOR:             '/admin/calculator',

  // F.48 — Testimoni
  TESTIMONIALS:           '/admin/testimonials',

  // F.49 — Promotions
  PROMOTIONS:             '/admin/promotions',

  // F.50 — Security
  SECURITY:               '/admin/security',

  PROJECTS:               '/admin/projects',
};

// ── STATUS UNIT (F.21 & F.22) ──
export const UNIT_STATUS = {
  AVAILABLE: { label: 'Tersedia',    color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  BOOKED:    { label: 'Dipesan',     color: 'bg-amber-500',   text: 'text-amber-600',   bg: 'bg-amber-50' },
  RESERVED:  { label: 'Direservasi', color: 'bg-blue-500',    text: 'text-blue-600',    bg: 'bg-blue-50' },
  SOLD:      { label: 'Terjual',     color: 'bg-red-500',     text: 'text-red-600',     bg: 'bg-red-50' },
};

// ── KATEGORI DOKUMEN (F.24) ──
export const DOCUMENT_CATEGORIES = [
  'Legalitas', 'Brosur', 'Kontrak', 'SOP', 'Marketing Kit',
];

// ── AI CONTENT TOOLS (F.30) ──
export const AI_CONTENT_TOOLS = [
  'Artikel Generator', 'Caption Generator',
  'SEO Suggestion', 'CTA Generator', 'Headline Generator',
];

// ── TEMA ADMIN AFKAR LAND ──
export const ADMIN_THEME = {
  primary:     '#DC2626',           // Merah utama
  primaryLight:'#FEF2F2',          // Merah muda (bg kartu)
  sidebar:     '#080808',           // Hitam sidebar
  bgMain:      '#F9FAFB',           // Abu sangat muda (bg konten)
  white:       '#FFFFFF',
  border:      '#F3F4F6',
};