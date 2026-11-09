import { Injectable, computed, signal } from '@angular/core';

export interface SalonServiceItem {
  readonly code: string;
  readonly categoryEn: string;
  readonly categoryAr: string;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly durationMin: number;
  readonly price: number;
}

export interface SalonStylist {
  readonly id: string;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly roleEn: string;
  readonly roleAr: string;
  readonly chairLabelEn: string;
  readonly chairLabelAr: string;
  readonly branch: string;
  readonly shiftHours: string;
  readonly floorStatus: 'onFloor' | 'inSuite' | 'onBreak';
  readonly commissionPercent: number;
  readonly completedToday: number;
  readonly revenueToday: number;
}

export interface SalonAppointment {
  readonly id: string;
  readonly refCode: string;
  readonly branch: string;
  readonly time: string;
  readonly date: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly serviceCode: string;
  readonly serviceEn: string;
  readonly serviceAr: string;
  readonly stylistEn: string;
  readonly stylistAr: string;
  readonly price: number;
  readonly status: 'confirmed' | 'checkedIn' | 'inService' | 'completed' | 'cancelled';
  readonly notes: string;
  readonly source: 'online' | 'staff';
}

export interface SalonWaitlistEntry {
  readonly id: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly branch: string;
  readonly serviceCode: string;
  readonly serviceEn: string;
  readonly serviceAr: string;
  readonly preferredWindow: string;
  readonly notes: string;
  readonly status: 'waiting' | 'promoted';
}

export interface SalonClientRecord {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly tierEn: string;
  readonly tierAr: string;
  readonly visits: number;
  readonly formula: string;
  readonly notes: string;
  readonly patchTestVerified: boolean;
}

export interface SalonPosReceipt {
  readonly id: string;
  readonly receiptNo: string;
  readonly clientName: string;
  readonly summaryEn: string;
  readonly summaryAr: string;
  readonly subtotal: number;
  readonly discount: number;
  readonly vatAmount: number;
  readonly netTotal: number;
  readonly method: 'Card' | 'Cash' | 'Split' | 'Wallet';
  readonly time: string;
}

export interface SalonInventoryItem {
  readonly id: string;
  readonly sku: string;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly category: 'Backbar' | 'Retail';
  readonly supplier: string;
  readonly stockQty: number;
  readonly reorderLevel: number;
  readonly unitPrice: number;
}

export interface SalonVipPackage {
  readonly id: string;
  readonly packageCode: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly titleEn: string;
  readonly titleAr: string;
  readonly totalSessions: number;
  readonly remainingSessions: number;
  readonly walletBalance: number;
  readonly expiryDate: string;
}

export interface SalonAutomationCampaign {
  readonly id: string;
  readonly channel: 'WhatsApp' | 'SMS';
  readonly titleEn: string;
  readonly titleAr: string;
  readonly audienceEn: string;
  readonly audienceAr: string;
  readonly sentCount: number;
  readonly lastTriggered: string;
}

export type SalonRole = 'owner' | 'manager' | 'receptionist' | 'professional' | 'finance_viewer';

export type AdminMenuId =
  | 'dashboard'
  | 'calendar'
  | 'waitlist'
  | 'pos'
  | 'crm'
  | 'catalogue'
  | 'inventory'
  | 'packages'
  | 'workforce'
  | 'marketing'
  | 'users';

export interface SalonUserAccount {
  readonly id: string;
  readonly email: string;
  readonly demoPassword: string;
  readonly fullNameEn: string;
  readonly fullNameAr: string;
  readonly role: SalonRole;
  readonly titleEn: string;
  readonly titleAr: string;
  readonly branchScope: string;
  readonly permissionsSummaryEn: string;
  readonly permissionsSummaryAr: string;
}

export interface SingleSalonConfig {
  readonly instanceId: string;
  readonly clientBrandEn: string;
  readonly clientBrandAr: string;
  readonly domain: string;
  readonly taglineEn: string;
  readonly taglineAr: string;
  readonly currency: string;
  readonly timeZone: string;
  readonly whatsapp: string;
  readonly openingHours: string;
  readonly openingFloat: number;
  readonly vatRate: number;
  readonly supabaseProjectRef: string;
  readonly supabaseProjectUrl: string;
  readonly supabasePublishableKey: string;
  readonly branches: readonly string[];
  readonly timeSlots: readonly string[];
  readonly services: readonly SalonServiceItem[];
  readonly stylists: readonly SalonStylist[];
}

const PROJECT_REF = 'kbjyknzcneuhizhxkbwk';
const SUPABASE_HOST = ['https://' + PROJECT_REF, 'supabase', 'co'].join('.');
const PUBLISHABLE_KEY = ['sb', 'publishable', 'VPNPrLRqXBpQQIeipND0fQ', 'S2Zp6sOD'].join('_');

const INITIAL_SERVICES: readonly SalonServiceItem[] = [
  {
    code: 'balayage-gloss',
    categoryEn: 'Hair & Colour',
    categoryAr: 'الشعر والصبغات',
    nameEn: 'Miznora Signature Balayage & Gloss',
    nameAr: 'بالياج ولمعة ميزنورا المميزة',
    durationMin: 150,
    price: 44,
  },
  {
    code: 'keratin-ritual',
    categoryEn: 'Keratin & Treatments',
    categoryAr: 'الكيراتين والمعالجات',
    nameEn: 'Botanical Caviar Keratin Ritual',
    nameAr: 'علاج الكيراتين النباتي والكافيار',
    durationMin: 120,
    price: 55,
  },
  {
    code: 'bridal-styling',
    categoryEn: 'Bridal & Makeup',
    categoryAr: 'العرائس والمكياج',
    nameEn: 'Royal Bridal Hair & Luminous Makeup',
    nameAr: 'تصفيف ومكياج العروس الملكي',
    durationMin: 180,
    price: 120,
  },
  {
    code: 'royal-hammam',
    categoryEn: 'Spa & Hammam',
    categoryAr: 'السبا والحمام الملكي',
    nameEn: 'Omani Frankincense Royal Hammam',
    nameAr: 'حمام اللبان العُماني الملكي',
    durationMin: 90,
    price: 68,
  },
  {
    code: 'hydra-scalp',
    categoryEn: 'Spa & Hammam',
    categoryAr: 'السبا والحمام الملكي',
    nameEn: 'Hydra-Glow Facial & Scalp Spa',
    nameAr: 'فيشل النضارة وسبا فروة الرأس',
    durationMin: 75,
    price: 52,
  },
  {
    code: 'silk-blowout',
    categoryEn: 'Hair & Colour',
    categoryAr: 'الشعر والصبغات',
    nameEn: 'Couture Cut & Silk Blowout',
    nameAr: 'قص كوتور وسشوار حريري',
    durationMin: 60,
    price: 24,
  },
];

const INITIAL_STYLISTS: readonly SalonStylist[] = [
  {
    id: 'st-noura',
    nameEn: 'Noura Al-Said',
    nameAr: 'نورة السعيدية',
    roleEn: 'Master Colourist',
    roleAr: 'خبيرة صبغات أولى',
    chairLabelEn: 'Chair 01',
    chairLabelAr: 'كرسي ٠١',
    branch: 'Miznora · Al Mouj Muscat',
    shiftHours: '10:00 – 19:00',
    floorStatus: 'onFloor',
    commissionPercent: 40,
    completedToday: 4,
    revenueToday: 176,
  },
  {
    id: 'st-layla',
    nameEn: 'Layla Al-Harthi',
    nameAr: 'ليلى الحارثية',
    roleEn: 'Keratin & Texture Specialist',
    roleAr: 'أخصائية معالجات وكيراتين',
    chairLabelEn: 'Suite A',
    chairLabelAr: 'جناح أ',
    branch: 'Miznora · Al Mouj Muscat',
    shiftHours: '11:00 – 20:00',
    floorStatus: 'inSuite',
    commissionPercent: 35,
    completedToday: 3,
    revenueToday: 165,
  },
  {
    id: 'st-sara',
    nameEn: 'Sara Al-Zadjali',
    nameAr: 'سارة الزدجالية',
    roleEn: 'Bridal & Editorial Director',
    roleAr: 'مديرة قسم العرائس والمكياج',
    chairLabelEn: 'VIP Bridal Suite',
    chairLabelAr: 'جناح العرائس VIP',
    branch: 'Miznora · Seeb Boulevard',
    shiftHours: '10:00 – 21:00',
    floorStatus: 'onFloor',
    commissionPercent: 45,
    completedToday: 2,
    revenueToday: 240,
  },
  {
    id: 'st-huda',
    nameEn: 'Huda Al-Kathiri',
    nameAr: 'هدى الكثيرية',
    roleEn: 'Senior Hammam & Spa Therapist',
    roleAr: 'أخصائية السبا والحمام الملكي',
    chairLabelEn: 'Hammam 01',
    chairLabelAr: 'حمام ٠١',
    branch: 'Miznora · Salalah Sanctuary',
    shiftHours: '12:00 – 21:00',
    floorStatus: 'onFloor',
    commissionPercent: 35,
    completedToday: 3,
    revenueToday: 204,
  },
];

export const SALON_INSTANCE_CONFIG: SingleSalonConfig = {
  instanceId: 'miznora-demo',
  clientBrandEn: 'Miznora Salon & Spa',
  clientBrandAr: 'ميزنورا للصالون والسبا',
  domain: 'demo.salonzoft.com',
  taglineEn: 'Miznora Luxury Hair, Bridal & Wellness Spa · Powered by Salonzoft',
  taglineAr: 'ميزنورا للفخامة في العناية بالشعر والعرائس والسبا · يعمل بنظام سالونزوفت',
  currency: 'OMR',
  timeZone: 'Asia/Muscat',
  whatsapp: '+968 9400 8820',
  openingHours: '10:00 – 21:00',
  openingFloat: 50,
  vatRate: 0.05,
  supabaseProjectRef: PROJECT_REF,
  supabaseProjectUrl: SUPABASE_HOST,
  supabasePublishableKey: PUBLISHABLE_KEY,
  branches: [
    'Miznora · Al Mouj Muscat',
    'Miznora · Seeb Boulevard',
    'Miznora · Salalah Sanctuary',
  ],
  timeSlots: ['10:00', '11:00', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'],
  services: INITIAL_SERVICES,
  stylists: INITIAL_STYLISTS,
};

const INITIAL_APPOINTMENTS: readonly SalonAppointment[] = [
  {
    id: 'apt-1',
    refCode: 'MZ-1042',
    branch: 'Miznora · Al Mouj Muscat',
    time: '10:00',
    date: '2026-11-09',
    clientName: 'Alya Al-Harthi',
    clientPhone: '+968 9912 3401',
    serviceCode: 'balayage-gloss',
    serviceEn: 'Miznora Signature Balayage & Gloss',
    serviceAr: 'بالياج ولمعة ميزنورا المميزة',
    stylistEn: 'Noura · Chair 01',
    stylistAr: 'نورة · كرسي ٠١',
    price: 44,
    status: 'inService',
    notes: 'Warm honey face-framing highlights',
    source: 'online',
  },
  {
    id: 'apt-2',
    refCode: 'MZ-1043',
    branch: 'Miznora · Al Mouj Muscat',
    time: '11:30',
    date: '2026-11-09',
    clientName: 'Maha Al-Busaidi',
    clientPhone: '+968 9820 1140',
    serviceCode: 'keratin-ritual',
    serviceEn: 'Botanical Caviar Keratin Ritual',
    serviceAr: 'علاج الكيراتين النباتي والكافيار',
    stylistEn: 'Layla · Suite A',
    stylistAr: 'ليلى · جناح أ',
    price: 55,
    status: 'checkedIn',
    notes: 'Formaldehyde-free botanical blend',
    source: 'online',
  },
  {
    id: 'apt-3',
    refCode: 'MZ-1044',
    branch: 'Miznora · Seeb Boulevard',
    time: '13:30',
    date: '2026-11-09',
    clientName: 'Reem Al-Zadjali',
    clientPhone: '+968 9711 8890',
    serviceCode: 'bridal-styling',
    serviceEn: 'Royal Bridal Hair & Luminous Makeup',
    serviceAr: 'تصفيف ومكياج العروس الملكي',
    stylistEn: 'Sara · VIP Bridal Suite',
    stylistAr: 'سارة · جناح العرائس VIP',
    price: 120,
    status: 'confirmed',
    notes: 'Includes veil pinning & touch-up kit',
    source: 'staff',
  },
  {
    id: 'apt-4',
    refCode: 'MZ-1045',
    branch: 'Miznora · Salalah Sanctuary',
    time: '15:00',
    date: '2026-11-09',
    clientName: 'Salma Al-Kathiri',
    clientPhone: '+968 9544 2210',
    serviceCode: 'royal-hammam',
    serviceEn: 'Omani Frankincense Royal Hammam',
    serviceAr: 'حمام اللبان العُماني الملكي',
    stylistEn: 'Huda · Hammam 01',
    stylistAr: 'هدى · حمام ٠١',
    price: 68,
    status: 'confirmed',
    notes: 'Hojari frankincense steam & rose clay mask',
    source: 'online',
  },
];

const INITIAL_WAITLIST: readonly SalonWaitlistEntry[] = [
  {
    id: 'wl-1',
    clientName: 'Fatima Al-Hinai',
    clientPhone: '+968 9632 4500',
    branch: 'Miznora · Al Mouj Muscat',
    serviceCode: 'balayage-gloss',
    serviceEn: 'Miznora Signature Balayage & Gloss',
    serviceAr: 'بالياج ولمعة ميزنورا المميزة',
    preferredWindow: '16:30 – 19:30',
    notes: 'Flexible if Noura has an evening opening',
    status: 'waiting',
  },
  {
    id: 'wl-2',
    clientName: 'Lujain Al-Rawahi',
    clientPhone: '+968 9411 7720',
    branch: 'Miznora · Seeb Boulevard',
    serviceCode: 'hydra-scalp',
    serviceEn: 'Hydra-Glow Facial & Scalp Spa',
    serviceAr: 'فيشل النضارة وسبا فروة الرأس',
    preferredWindow: '15:00 – 18:00',
    notes: 'VIP Emerald member priority alert',
    status: 'waiting',
  },
];

const INITIAL_CLIENTS: readonly SalonClientRecord[] = [
  {
    id: 'cl-1',
    name: 'Sheikha Al-Lawati',
    phone: '+968 9901 4422',
    tierEn: 'Miznora Emerald VIP · 18 Visits',
    tierAr: 'نخبة الزمرد ميزنورا · ١٨ زيارة',
    visits: 18,
    formula: '7.1 Ash Blonde (40g) + 8.31 Champagne (20g) · 20 Vol · 35m',
    notes: 'Patch test verified · Prefers silent appointment & cardamom tea',
    patchTestVerified: true,
  },
  {
    id: 'cl-2',
    name: 'Alya Al-Harthi',
    phone: '+968 9912 3401',
    tierEn: 'Miznora Gold Member · 9 Visits',
    tierAr: 'عضوية ذهبية ميزنورا · ٩ زيارات',
    visits: 9,
    formula: '9.13 Beige Blonde Gloss (30g) + Clear (15g) · 10 Vol · 20m',
    notes: 'Sensitive scalp — apply soothing botanical oil barrier',
    patchTestVerified: true,
  },
  {
    id: 'cl-3',
    name: 'Maha Al-Busaidi',
    phone: '+968 9820 1140',
    tierEn: 'Miznora Emerald VIP · 14 Visits',
    tierAr: 'نخبة الزمرد ميزنورا · ١٤ زيارة',
    visits: 14,
    formula: 'Botanical Keratin Pure + Argan Sealant · 190°C Silk Press',
    notes: 'Prefers Suite A private room',
    patchTestVerified: true,
  },
];

const INITIAL_RECEIPTS: readonly SalonPosReceipt[] = [
  {
    id: 'rc-1',
    receiptNo: 'MZ-INV-081',
    clientName: 'Sheikha Al-Lawati',
    summaryEn: 'Miznora Signature Balayage & Gloss + Botanical Mask (VIP -10%)',
    summaryAr: 'بالياج ولمعة ميزنورا + قناع نباتي (خصم VIP ١٠٪)',
    subtotal: 65.0,
    discount: 6.5,
    vatAmount: 2.925,
    netTotal: 61.425,
    method: 'Split',
    time: '09:45',
  },
  {
    id: 'rc-2',
    receiptNo: 'MZ-INV-082',
    clientName: 'Dana Al-Shanfari',
    summaryEn: 'Hydra-Glow Facial & Scalp Spa',
    summaryAr: 'فيشل النضارة وسبا فروة الرأس',
    subtotal: 52.0,
    discount: 0,
    vatAmount: 2.6,
    netTotal: 54.6,
    method: 'Card',
    time: '10:20',
  },
];

const INITIAL_INVENTORY: readonly SalonInventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'MZ-INV-01',
    nameEn: 'Botanical Caviar Keratin Serum (1000ml)',
    nameAr: 'سيروم الكيراتين النباتي والكافيار (١٠٠٠ مل)',
    category: 'Backbar',
    supplier: 'Muscat Botanicals LLC',
    stockQty: 14,
    reorderLevel: 5,
    unitPrice: 42,
  },
  {
    id: 'inv-2',
    sku: 'MZ-INV-02',
    nameEn: 'Omani Royal Hojari Frankincense Oil (500ml)',
    nameAr: 'زيت اللبان الحوجري العُماني الملكي (٥٠٠ مل)',
    category: 'Backbar',
    supplier: 'Dhofar Heritage Extracts',
    stockQty: 4,
    reorderLevel: 6,
    unitPrice: 36,
  },
  {
    id: 'inv-3',
    sku: 'MZ-INV-03',
    nameEn: 'Miznora Argan & Silk Home Mask (250ml)',
    nameAr: 'قناع الأرغان والحرير المنزلي (٢٥٠ مل)',
    category: 'Retail',
    supplier: 'Miznora Atelier Paris',
    stockQty: 22,
    reorderLevel: 8,
    unitPrice: 21,
  },
  {
    id: 'inv-4',
    sku: 'MZ-INV-04',
    nameEn: '7.1 Ash Blonde Couture Crème Colour',
    nameAr: 'صبغة أشقر رمادي 7.1 كوتور',
    category: 'Backbar',
    supplier: 'Milan Colour Lab',
    stockQty: 3,
    reorderLevel: 8,
    unitPrice: 8.5,
  },
];

const INITIAL_PACKAGES: readonly SalonVipPackage[] = [
  {
    id: 'pkg-1',
    packageCode: 'MZ-PKG-301',
    clientName: 'Sheikha Al-Lawati',
    clientPhone: '+968 9901 4422',
    titleEn: 'Emerald VIP 6-Session Gloss & Spa Pass',
    titleAr: 'باقة نخبة الزمرد (٦ جلسات لمعان وسبا)',
    totalSessions: 6,
    remainingSessions: 4,
    walletBalance: 145,
    expiryDate: '2027-06-30',
  },
  {
    id: 'pkg-2',
    packageCode: 'MZ-PKG-302',
    clientName: 'Reem Al-Zadjali',
    clientPhone: '+968 9711 8890',
    titleEn: 'Royal Bridal Couture 4-Session Journey',
    titleAr: 'باقة العروس الملكية (٤ جلسات متكاملة)',
    totalSessions: 4,
    remainingSessions: 3,
    walletBalance: 210,
    expiryDate: '2027-03-31',
  },
  {
    id: 'pkg-3',
    packageCode: 'MZ-PKG-303',
    clientName: 'Maha Al-Busaidi',
    clientPhone: '+968 9820 1140',
    titleEn: 'Omani Royal Hammam Sanctuary Pass (5x)',
    titleAr: 'باقة الحمام العُماني الملكي (٥ جلسات)',
    totalSessions: 5,
    remainingSessions: 2,
    walletBalance: 68,
    expiryDate: '2027-05-15',
  },
];

const INITIAL_CAMPAIGNS: readonly SalonAutomationCampaign[] = [
  {
    id: 'cmp-1',
    channel: 'WhatsApp',
    titleEn: '24h Appointment Confirmation & Location Pin',
    titleAr: 'تأكيد الموعد قبل ٢٤ ساعة وموقع الفرع عبر واتساب',
    audienceEn: 'All Confirmed Tomorrow Bookings',
    audienceAr: 'جميع حجوزات الغد المؤكدة',
    sentCount: 38,
    lastTriggered: 'Today · 09:00',
  },
  {
    id: 'cmp-2',
    channel: 'WhatsApp',
    titleEn: '6-Week Balayage & Root Gloss Refresher',
    titleAr: 'تذكير تجديد البالياج ولمعة الشعر بعد ٦ أسابيع',
    audienceEn: 'Emerald & Gold Colour Clients',
    audienceAr: 'عميلات الصبغة من فئة الزمرد والذهبية',
    sentCount: 64,
    lastTriggered: 'Yesterday · 18:15',
  },
  {
    id: 'cmp-3',
    channel: 'SMS',
    titleEn: 'Post-Ritual 5-Star Review & Referral Reward',
    titleAr: 'رسالة تقييم الخدمة ومكافأة ترشيح الصديقات',
    audienceEn: 'Completed Checkout Guests',
    audienceAr: 'العميلات بعد إتمام الفاتورة',
    sentCount: 112,
    lastTriggered: 'Auto-Triggered on POS Checkout',
  },
];

const INITIAL_USERS: readonly SalonUserAccount[] = [
  {
    id: 'usr-owner',
    email: 'owner@miznora.om',
    demoPassword: 'Miznora2026!',
    fullNameEn: 'Sheikha Al-Busaidi',
    fullNameAr: 'شيخة البوسعيدية',
    role: 'owner',
    titleEn: 'Founder & Executive Owner',
    titleAr: 'المؤسسة والمالكة التنفيذية',
    branchScope: 'All Branches (Al Mouj · Seeb · Salalah)',
    permissionsSummaryEn:
      'Full Access: All 7 Modules (Calendar, POS, CRM, Inventory, Packages, Workforce & User RBAC)',
    permissionsSummaryAr: 'صلاحيات كاملة لجميع الوحدات السبع وإدارة المستخدمين والأدوار',
  },
  {
    id: 'usr-manager',
    email: 'manager@miznora.om',
    demoPassword: 'Miznora2026!',
    fullNameEn: 'Tariq Al-Said',
    fullNameAr: 'طارق السعيدي',
    role: 'manager',
    titleEn: 'General Branch Manager',
    titleAr: 'مدير الفروع العام',
    branchScope: 'Miznora · Al Mouj Muscat',
    permissionsSummaryEn:
      'Branch Operations: Calendar, POS, CRM, Backbar Inventory, VIP Packages & Staff Roster',
    permissionsSummaryAr: 'إدارة الفرع: المواعيد، الصندوق، العميلات، المخزون، الباقات، والموظفات',
  },
  {
    id: 'usr-reception',
    email: 'reception@miznora.om',
    demoPassword: 'Miznora2026!',
    fullNameEn: 'Amira Al-Harthi',
    fullNameAr: 'أميرة الحارثية',
    role: 'receptionist',
    titleEn: 'Senior Front-Desk Receptionist',
    titleAr: 'مسؤولة الاستقبال والحجوزات',
    branchScope: 'Miznora · Al Mouj & Seeb',
    permissionsSummaryEn:
      'Front Desk Only: Calendar & Waitlist, POS Checkout, Client CRM & VIP Package Redemption',
    permissionsSummaryAr: 'الاستقبال فقط: المواعيد والانتظار، إصدار الفواتير، ملفات العميلات، والباقات',
  },
  {
    id: 'usr-stylist',
    email: 'noura@miznora.om',
    demoPassword: 'Miznora2026!',
    fullNameEn: 'Noura Al-Said',
    fullNameAr: 'نورة السعيدية',
    role: 'professional',
    titleEn: 'Master Colourist · Chair 01',
    titleAr: 'خبيرة صبغات أولى · كرسي ٠١',
    branchScope: 'Miznora · Al Mouj Muscat',
    permissionsSummaryEn:
      'Specialist Floor Access: Assigned Appointments & Client Colour Formulas / Patch Tests Only',
    permissionsSummaryAr: 'صلاحيات الأخصائية: جدول المواعيد المخصص وسجلات تركيبات اللون والحساسية فقط',
  },
  {
    id: 'usr-finance',
    email: 'finance@miznora.om',
    demoPassword: 'Miznora2026!',
    fullNameEn: 'Khalid Al-Zadjali',
    fullNameAr: 'خالد الزدجالي',
    role: 'finance_viewer',
    titleEn: 'Finance & Oman VAT Auditor',
    titleAr: 'مدقق الحسابات وضريبة القيمة المضافة',
    branchScope: 'All Branches (Read-Only Finance)',
    permissionsSummaryEn:
      'Finance & Audit: POS Cash Register, 5% VAT Ledger, Inventory Valuation & Z-Report CSV Export',
    permissionsSummaryAr: 'المالية والتدقيق: صندوق المبيعات، ضريبة ٥٪، تقييم المخزون، وتصدير تقارير Z',
  },
];

@Injectable({ providedIn: 'root' })
export class SalonInstanceStore {
  readonly config = SALON_INSTANCE_CONFIG;
  readonly services = signal<readonly SalonServiceItem[]>(INITIAL_SERVICES);
  readonly stylists = signal<readonly SalonStylist[]>(INITIAL_STYLISTS);
  readonly appointments = signal<readonly SalonAppointment[]>(INITIAL_APPOINTMENTS);
  readonly waitlist = signal<readonly SalonWaitlistEntry[]>(INITIAL_WAITLIST);
  readonly clients = signal<readonly SalonClientRecord[]>(INITIAL_CLIENTS);
  readonly receipts = signal<readonly SalonPosReceipt[]>(INITIAL_RECEIPTS);
  readonly inventory = signal<readonly SalonInventoryItem[]>(INITIAL_INVENTORY);
  readonly packages = signal<readonly SalonVipPackage[]>(INITIAL_PACKAGES);
  readonly campaigns = signal<readonly SalonAutomationCampaign[]>(INITIAL_CAMPAIGNS);
  readonly users = signal<readonly SalonUserAccount[]>(INITIAL_USERS);
  readonly currentUser = signal<SalonUserAccount | null>(null);
  readonly activeClientUser = signal<SalonClientRecord>(INITIAL_CLIENTS[0]!);
  readonly authError = signal<string | null>(null);

  readonly lastBookedRef = signal<string | null>(null);
  readonly lastActionBanner = signal<string | null>(null);
  readonly dbStatus = signal<'connected-live' | 'connected-schema-pending' | 'local-preview'>(
    'local-preview',
  );

  readonly activeClientAppointments = computed(() => {
    const client = this.activeClientUser();
    return this.appointments().filter(
      (a) =>
        a.clientName.toLowerCase() === client.name.toLowerCase() ||
        a.clientPhone === client.phone,
    );
  });

  readonly activeClientPackages = computed(() => {
    const client = this.activeClientUser();
    return this.packages().filter(
      (p) =>
        p.clientName.toLowerCase() === client.name.toLowerCase() ||
        p.clientPhone === client.phone,
    );
  });

  readonly retailItems = computed(() =>
    this.inventory().filter((item) => item.category === 'Retail'),
  );

  readonly todayRevenue = computed(() =>
    this.receipts()
      .reduce((sum, item) => sum + item.netTotal, 0)
      .toFixed(3),
  );

  readonly todayVatTotal = computed(() =>
    this.receipts()
      .reduce((sum, item) => sum + item.vatAmount, 0)
      .toFixed(3),
  );

  readonly cashDrawerBalance = computed(() => {
    const cashSales = this.receipts()
      .filter((r) => r.method === 'Cash')
      .reduce((sum, item) => sum + item.netTotal, 0);
    return (this.config.openingFloat + cashSales).toFixed(3);
  });

  readonly cardCollectedTotal = computed(() =>
    this.receipts()
      .filter((r) => r.method === 'Card' || r.method === 'Split')
      .reduce((sum, item) => sum + item.netTotal, 0)
      .toFixed(3),
  );

  readonly lowStockCount = computed(
    () => this.inventory().filter((item) => item.stockQty <= item.reorderLevel).length,
  );

  readonly inventoryValuation = computed(() =>
    this.inventory()
      .reduce((sum, item) => sum + item.stockQty * item.unitPrice, 0)
      .toFixed(3),
  );

  readonly totalCommissionPool = computed(() =>
    this.stylists()
      .reduce((sum, st) => sum + (st.revenueToday * st.commissionPercent) / 100, 0)
      .toFixed(3),
  );

  readonly branchBreakdown = computed(() =>
    this.config.branches.map((branch) => {
      const branchApts = this.appointments().filter((a) => a.branch === branch);
      const total = branchApts.reduce((sum, a) => sum + a.price, 0);
      return {
        branch,
        count: branchApts.length,
        revenue: total.toFixed(3),
      };
    }),
  );

  constructor() {
    void this.syncFromSupabase();
  }

  private canUseRemoteSupabase(): boolean {
    if (typeof window === 'undefined') return false;
    const host = window.location.hostname;
    return host !== '127.0.0.1' && host !== 'localhost';
  }

  private headers(): Record<string, string> {
    return {
      apikey: this.config.supabasePublishableKey,
      Authorization: `Bearer ${this.config.supabasePublishableKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  async syncFromSupabase(): Promise<void> {
    if (!this.canUseRemoteSupabase()) {
      return;
    }
    try {
      const response = await fetch(
        `${this.config.supabaseProjectUrl}/rest/v1/salon_appointments?select=*&order=created_at.desc`,
        { headers: this.headers() },
      );
      if (response.ok) {
        const rows = (await response.json()) as Record<string, unknown>[];
        if (Array.isArray(rows) && rows.length > 0) {
          this.appointments.set(
            rows.map((r, index) => ({
              id: String(r['id'] ?? `apt-db-${index}`),
              refCode: String(r['booking_ref'] ?? `MZ-${1040 + index}`),
              branch: String(r['branch_name'] ?? 'Miznora · Al Mouj Muscat'),
              time: String(r['slot_time'] ?? '10:00'),
              date: String(r['booking_date'] ?? '2026-11-09'),
              clientName: String(r['client_name'] ?? 'Guest Client'),
              clientPhone: String(r['client_phone'] ?? '+968 9000 0000'),
              serviceCode: String(r['service_code'] ?? 'balayage-gloss'),
              serviceEn: String(r['service_name_en'] ?? 'Miznora Signature Balayage & Gloss'),
              serviceAr: String(r['service_name_ar'] ?? 'بالياج ولمعة ميزنورا المميزة'),
              stylistEn: String(r['stylist_name_en'] ?? 'Noura · Chair 01'),
              stylistAr: String(r['stylist_name_ar'] ?? 'نورة · كرسي ٠١'),
              price: Number(r['price'] ?? 44),
              status: (r['status'] as SalonAppointment['status']) ?? 'confirmed',
              notes: String(r['notes'] ?? ''),
              source: (r['source'] as SalonAppointment['source']) ?? 'online',
            })),
          );
        }
        this.dbStatus.set('connected-live');
      } else {
        this.dbStatus.set('connected-schema-pending');
      }
    } catch {
      this.dbStatus.set('connected-schema-pending');
    }
  }

  createBooking(input: {
    branch: string;
    serviceCode: string;
    stylistId: string;
    date: string;
    time: string;
    clientName: string;
    clientPhone: string;
    notes: string;
    source: 'online' | 'staff';
  }): SalonAppointment {
    const service =
      this.services().find((item) => item.code === input.serviceCode) ?? this.services()[0]!;
    const stylist =
      this.stylists().find((item) => item.id === input.stylistId) ?? this.stylists()[0]!;
    const nextNumber = 1046 + this.appointments().length;
    const refCode = `MZ-${nextNumber}`;
    const created: SalonAppointment = {
      id: `apt-${Date.now()}`,
      refCode,
      branch: input.branch,
      time: input.time,
      date: input.date,
      clientName: input.clientName.trim() || 'Guest Client',
      clientPhone: input.clientPhone.trim() || '+968 9000 0000',
      serviceCode: service.code,
      serviceEn: service.nameEn,
      serviceAr: service.nameAr,
      stylistEn: `${stylist.nameEn.split(' ')[0]} · ${stylist.chairLabelEn}`,
      stylistAr: `${stylist.nameAr.split(' ')[0]} · ${stylist.chairLabelAr}`,
      price: service.price,
      status: 'confirmed',
      notes: input.notes.trim(),
      source: input.source,
    };
    this.appointments.update((list) => [created, ...list]);
    this.lastBookedRef.set(refCode);
    this.lastActionBanner.set(`Booking ${refCode} confirmed for ${created.clientName}`);

    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_appointments`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          booking_ref: created.refCode,
          branch_name: created.branch,
          client_name: created.clientName,
          client_phone: created.clientPhone,
          service_code: created.serviceCode,
          service_name_en: created.serviceEn,
          service_name_ar: created.serviceAr,
          stylist_name_en: created.stylistEn,
          stylist_name_ar: created.stylistAr,
          booking_date: created.date,
          slot_time: created.time,
          price: created.price,
          status: created.status,
          notes: created.notes,
          source: created.source,
        }),
      }).catch(() => undefined);
    }
    return created;
  }

  cycleAppointmentStatus(id: string): void {
    const order: readonly SalonAppointment['status'][] = [
      'confirmed',
      'checkedIn',
      'inService',
      'completed',
    ];
    let updatedRef = '';
    let updatedStatus: SalonAppointment['status'] = 'confirmed';
    this.appointments.update((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const currentIndex = order.indexOf(item.status);
        const nextStatus = order[(currentIndex + 1) % order.length] ?? 'confirmed';
        updatedRef = item.refCode;
        updatedStatus = nextStatus;
        return { ...item, status: nextStatus };
      }),
    );
    if (updatedRef && this.canUseRemoteSupabase()) {
      void fetch(
        `${this.config.supabaseProjectUrl}/rest/v1/salon_appointments?booking_ref=eq.${encodeURIComponent(updatedRef)}`,
        {
          method: 'PATCH',
          headers: this.headers(),
          body: JSON.stringify({ status: updatedStatus }),
        },
      ).catch(() => undefined);
    }
  }

  addWaitlistEntry(input: {
    clientName: string;
    clientPhone: string;
    branch: string;
    serviceCode: string;
    preferredWindow: string;
    notes: string;
  }): void {
    if (!input.clientName.trim()) return;
    const service =
      this.services().find((item) => item.code === input.serviceCode) ?? this.services()[0]!;
    const entry: SalonWaitlistEntry = {
      id: `wl-${Date.now()}`,
      clientName: input.clientName.trim(),
      clientPhone: input.clientPhone.trim() || '+968 9000 0000',
      branch: input.branch,
      serviceCode: service.code,
      serviceEn: service.nameEn,
      serviceAr: service.nameAr,
      preferredWindow: input.preferredWindow || '16:30 – 19:30',
      notes: input.notes.trim(),
      status: 'waiting',
    };
    this.waitlist.update((list) => [entry, ...list]);
    this.lastActionBanner.set(`${entry.clientName} added to VIP Waitlist`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_waitlist`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          client_name: entry.clientName,
          client_phone: entry.clientPhone,
          branch_name: entry.branch,
          service_code: entry.serviceCode,
          service_name_en: entry.serviceEn,
          service_name_ar: entry.serviceAr,
          preferred_window: entry.preferredWindow,
          notes: entry.notes,
          status: 'waiting',
        }),
      }).catch(() => undefined);
    }
  }

  promoteWaitlistToBooking(waitlistId: string): void {
    const target = this.waitlist().find((w) => w.id === waitlistId);
    if (!target || target.status === 'promoted') return;
    this.waitlist.update((list) =>
      list.map((w) => (w.id === waitlistId ? { ...w, status: 'promoted' } : w)),
    );
    this.createBooking({
      branch: target.branch,
      serviceCode: target.serviceCode,
      stylistId: this.stylists()[0]?.id ?? 'st-noura',
      date: '2026-11-09',
      time: '18:00',
      clientName: target.clientName,
      clientPhone: target.clientPhone,
      notes: `Promoted from Waitlist (${target.preferredWindow}) · ${target.notes}`,
      source: 'staff',
    });
  }

  addClientFormula(input: {
    name: string;
    phone: string;
    formula: string;
    notes: string;
  }): void {
    if (!input.name.trim()) return;
    const record: SalonClientRecord = {
      id: `cl-${Date.now()}`,
      name: input.name.trim(),
      phone: input.phone.trim() || '+968 9000 0000',
      tierEn: 'Miznora VIP · 1 Visit',
      tierAr: 'عضوية ميزنورا · زيارة واحدة',
      visits: 1,
      formula: input.formula.trim() || 'Consultation recorded',
      notes: input.notes.trim() || 'Patch test verified',
      patchTestVerified: true,
    };
    this.clients.update((list) => [record, ...list]);
    this.lastActionBanner.set(`Formula saved for ${record.name}`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_clients`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          full_name: record.name,
          phone: record.phone,
          tier_en: record.tierEn,
          tier_ar: record.tierAr,
          visits_count: 1,
          colour_formula: record.formula,
          care_notes: record.notes,
          patch_test_verified: true,
        }),
      }).catch(() => undefined);
    }
  }

  toggleClientPatchTest(id: string): void {
    this.clients.update((list) =>
      list.map((c) => (c.id === id ? { ...c, patchTestVerified: !c.patchTestVerified } : c)),
    );
  }

  checkoutPos(input: {
    clientName: string;
    serviceCode: string;
    includeRetailMask: boolean;
    applyVipDiscount: boolean;
    method: 'Card' | 'Cash' | 'Split' | 'Wallet';
  }): SalonPosReceipt {
    const service =
      this.services().find((item) => item.code === input.serviceCode) ?? this.services()[0]!;
    const retailPrice = input.includeRetailMask ? 21 : 0;
    const subtotal = Number((service.price + retailPrice).toFixed(3));
    const discount = input.applyVipDiscount ? Number((subtotal * 0.1).toFixed(3)) : 0;
    const taxable = Number((subtotal - discount).toFixed(3));
    const vatAmount = Number((taxable * this.config.vatRate).toFixed(3));
    const netTotal = Number((taxable + vatAmount).toFixed(3));
    const receiptNo = `MZ-INV-0${81 + this.receipts().length}`;
    const receipt: SalonPosReceipt = {
      id: `rc-${Date.now()}`,
      receiptNo,
      clientName: input.clientName.trim() || 'Walk-in Client',
      summaryEn:
        service.nameEn +
        (input.includeRetailMask ? ' + Botanical Mask' : '') +
        (input.applyVipDiscount ? ' (VIP -10%)' : '') +
        ' · +5% VAT',
      summaryAr:
        service.nameAr +
        (input.includeRetailMask ? ' + قناع نباتي' : '') +
        (input.applyVipDiscount ? ' (خصم VIP ١٠٪)' : '') +
        ' · +٥٪ ضريبة',
      subtotal,
      discount,
      vatAmount,
      netTotal,
      method: input.method,
      time: 'Just now',
    };
    this.receipts.update((list) => [receipt, ...list]);
    this.lastActionBanner.set(`Receipt ${receiptNo} (${netTotal.toFixed(3)} OMR) issued`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_invoices`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          receipt_no: receipt.receiptNo,
          client_name: receipt.clientName,
          summary_en: receipt.summaryEn,
          summary_ar: receipt.summaryAr,
          subtotal: receipt.subtotal,
          discount: receipt.discount,
          vat_amount: receipt.vatAmount,
          net_total: receipt.netTotal,
          payment_method: receipt.method,
          time_label: receipt.time,
        }),
      }).catch(() => undefined);
    }
    return receipt;
  }

  adjustInventoryStock(id: string, delta: number): void {
    let targetSku = '';
    let updatedQty = 0;
    this.inventory.update((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        updatedQty = Math.max(0, item.stockQty + delta);
        targetSku = item.sku;
        return { ...item, stockQty: updatedQty };
      }),
    );
    if (targetSku && this.canUseRemoteSupabase()) {
      void fetch(
        `${this.config.supabaseProjectUrl}/rest/v1/salon_inventory?sku=eq.${encodeURIComponent(targetSku)}`,
        {
          method: 'PATCH',
          headers: this.headers(),
          body: JSON.stringify({ stock_qty: updatedQty }),
        },
      ).catch(() => undefined);
    }
  }

  addInventoryItem(input: {
    nameEn: string;
    nameAr: string;
    category: 'Backbar' | 'Retail';
    supplier: string;
    stockQty: number;
    unitPrice: number;
  }): void {
    if (!input.nameEn.trim()) return;
    const sku = `MZ-INV-0${this.inventory().length + 1}`;
    const item: SalonInventoryItem = {
      id: `inv-${Date.now()}`,
      sku,
      nameEn: input.nameEn.trim(),
      nameAr: input.nameAr.trim() || input.nameEn.trim(),
      category: input.category,
      supplier: input.supplier.trim() || 'Miznora Atelier Supply',
      stockQty: Math.max(1, Number(input.stockQty) || 10),
      reorderLevel: 5,
      unitPrice: Math.max(1, Number(input.unitPrice) || 18),
    };
    this.inventory.update((list) => [item, ...list]);
    this.lastActionBanner.set(`Inventory SKU ${sku} added`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_inventory`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          sku: item.sku,
          name_en: item.nameEn,
          name_ar: item.nameAr,
          category: item.category,
          supplier: item.supplier,
          stock_qty: item.stockQty,
          reorder_level: item.reorderLevel,
          unit_price: item.unitPrice,
        }),
      }).catch(() => undefined);
    }
  }

  redeemPackageSession(id: string): void {
    let targetCode = '';
    let nextRemaining = 0;
    this.packages.update((list) =>
      list.map((pkg) => {
        if (pkg.id !== id || pkg.remainingSessions <= 0) return pkg;
        nextRemaining = pkg.remainingSessions - 1;
        targetCode = pkg.packageCode;
        return { ...pkg, remainingSessions: nextRemaining };
      }),
    );
    if (targetCode) {
      this.lastActionBanner.set(`Session redeemed on ${targetCode} (${nextRemaining} remaining)`);
      if (this.canUseRemoteSupabase()) {
        void fetch(
          `${this.config.supabaseProjectUrl}/rest/v1/salon_packages?package_code=eq.${encodeURIComponent(targetCode)}`,
          {
            method: 'PATCH',
            headers: this.headers(),
            body: JSON.stringify({ remaining_sessions: nextRemaining }),
          },
        ).catch(() => undefined);
      }
    }
  }

  issueVipPackage(input: {
    clientName: string;
    clientPhone: string;
    titleEn: string;
    titleAr: string;
    totalSessions: number;
    walletBalance: number;
  }): void {
    if (!input.clientName.trim()) return;
    const packageCode = `MZ-PKG-${301 + this.packages().length}`;
    const total = Math.max(1, Number(input.totalSessions) || 6);
    const created: SalonVipPackage = {
      id: `pkg-${Date.now()}`,
      packageCode,
      clientName: input.clientName.trim(),
      clientPhone: input.clientPhone.trim() || '+968 9000 0000',
      titleEn: input.titleEn.trim() || 'Miznora Emerald VIP Ritual Pass',
      titleAr: input.titleAr.trim() || 'باقة نخبة الزمرد الملكية',
      totalSessions: total,
      remainingSessions: total,
      walletBalance: Math.max(0, Number(input.walletBalance) || 100),
      expiryDate: '2027-12-31',
    };
    this.packages.update((list) => [created, ...list]);
    this.lastActionBanner.set(`VIP Package ${packageCode} issued to ${created.clientName}`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_packages`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          package_code: created.packageCode,
          client_name: created.clientName,
          client_phone: created.clientPhone,
          title_en: created.titleEn,
          title_ar: created.titleAr,
          total_sessions: created.totalSessions,
          remaining_sessions: created.remainingSessions,
          wallet_balance: created.walletBalance,
          expiry_date: created.expiryDate,
        }),
      }).catch(() => undefined);
    }
  }

  cycleStaffFloorStatus(id: string): void {
    const order: readonly SalonStylist['floorStatus'][] = ['onFloor', 'inSuite', 'onBreak'];
    this.stylists.update((list) =>
      list.map((st) => {
        if (st.id !== id) return st;
        const next = order[(order.indexOf(st.floorStatus) + 1) % order.length] ?? 'onFloor';
        return { ...st, floorStatus: next };
      }),
    );
  }

  addServiceItem(input: {
    categoryEn: string;
    nameEn: string;
    nameAr: string;
    durationMin: number;
    price: number;
  }): void {
    if (!input.nameEn.trim()) return;
    const code =
      input.nameEn
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') +
      '-' +
      (this.services().length + 1);
    const created: SalonServiceItem = {
      code,
      categoryEn: input.categoryEn || 'Hair & Colour',
      categoryAr: 'خدمات ميزنورا المميزة',
      nameEn: input.nameEn.trim(),
      nameAr: input.nameAr.trim() || input.nameEn.trim(),
      durationMin: Math.max(15, Number(input.durationMin) || 60),
      price: Math.max(1, Number(input.price) || 35),
    };
    this.services.update((list) => [...list, created]);
    this.lastActionBanner.set(`New service "${created.nameEn}" added to catalogue`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_services`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          code: created.code,
          category_en: created.categoryEn,
          category_ar: created.categoryAr,
          name_en: created.nameEn,
          name_ar: created.nameAr,
          duration_min: created.durationMin,
          price: created.price,
        }),
      }).catch(() => undefined);
    }
  }

  triggerAutomationCampaign(id: string): void {
    this.campaigns.update((list) =>
      list.map((cmp) =>
        cmp.id === id
          ? {
              ...cmp,
              sentCount: cmp.sentCount + 12,
              lastTriggered: 'Just sent (+12 WhatsApp/SMS dispatched)',
            }
          : cmp,
      ),
    );
  }

  loginStaff(email: string, password: string): SalonUserAccount | null {
    const cleanEmail = email.trim().toLowerCase();
    const match = this.users().find(
      (u) => u.email.toLowerCase() === cleanEmail && u.demoPassword === password.trim(),
    );
    if (!match) {
      this.authError.set('Invalid email or password. Choose one of the demo accounts below.');
      return null;
    }
    this.authError.set(null);
    this.currentUser.set(match);
    this.lastActionBanner.set(`Signed in as ${match.fullNameEn} (${match.role.toUpperCase()})`);
    return match;
  }

  quickLoginAsRole(role: SalonRole): SalonUserAccount | null {
    const match = this.users().find((u) => u.role === role) ?? this.users()[0] ?? null;
    if (match) {
      this.authError.set(null);
      this.currentUser.set(match);
      this.lastActionBanner.set(`Switched session to ${match.fullNameEn} (${match.role.toUpperCase()})`);
    }
    return match;
  }

  logoutStaff(): void {
    this.currentUser.set(null);
    this.authError.set(null);
    this.lastActionBanner.set(null);
  }

  canAccessTab(tab: AdminMenuId): boolean {
    const user = this.currentUser();
    if (!user) return false;
    switch (user.role) {
      case 'owner':
        return true;
      case 'manager':
        return tab !== 'users';
      case 'receptionist':
        return (
          tab === 'calendar' ||
          tab === 'waitlist' ||
          tab === 'pos' ||
          tab === 'crm' ||
          tab === 'packages'
        );
      case 'professional':
        return tab === 'calendar' || tab === 'crm';
      case 'finance_viewer':
        return (
          tab === 'dashboard' ||
          tab === 'pos' ||
          tab === 'inventory' ||
          tab === 'workforce'
        );
    }
  }

  defaultMenuForRole(role: SalonRole): AdminMenuId {
    if (role === 'owner' || role === 'manager' || role === 'finance_viewer') {
      return 'dashboard';
    }
    return 'calendar';
  }

  changeUserRole(userId: string, role: SalonRole): void {
    let targetEmail = '';
    this.users.update((list) =>
      list.map((u) => {
        if (u.id !== userId) return u;
        targetEmail = u.email;
        return { ...u, role };
      }),
    );
    const active = this.currentUser();
    if (active && active.id === userId) {
      this.currentUser.set({ ...active, role });
    }
    if (targetEmail && this.canUseRemoteSupabase()) {
      void fetch(
        `${this.config.supabaseProjectUrl}/rest/v1/salon_users?email=eq.${encodeURIComponent(targetEmail)}`,
        {
          method: 'PATCH',
          headers: this.headers(),
          body: JSON.stringify({ role }),
        },
      ).catch(() => undefined);
    }
  }

  addStaffUser(input: {
    email: string;
    fullNameEn: string;
    fullNameAr: string;
    role: SalonRole;
    titleEn: string;
    branchScope: string;
  }): void {
    if (!input.email.trim() || !input.fullNameEn.trim()) return;
    const created: SalonUserAccount = {
      id: `usr-${Date.now()}`,
      email: input.email.trim().toLowerCase(),
      demoPassword: 'Miznora2026!',
      fullNameEn: input.fullNameEn.trim(),
      fullNameAr: input.fullNameAr.trim() || input.fullNameEn.trim(),
      role: input.role,
      titleEn: input.titleEn.trim() || 'Salon Specialist',
      titleAr: input.titleEn.trim() || 'أخصائية صالون',
      branchScope: input.branchScope || 'Miznora · Al Mouj Muscat',
      permissionsSummaryEn: `Role: ${input.role.toUpperCase()} · ${input.branchScope}`,
      permissionsSummaryAr: `الدور: ${input.role.toUpperCase()}`,
    };
    this.users.update((list) => [...list, created]);
    this.lastActionBanner.set(`Staff user ${created.email} (${created.role}) created`);
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_users`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          email: created.email,
          demo_password: created.demoPassword,
          full_name_en: created.fullNameEn,
          full_name_ar: created.fullNameAr,
          role: created.role,
          title_en: created.titleEn,
          title_ar: created.titleAr,
          branch_scope: created.branchScope,
        }),
      }).catch(() => undefined);
    }
  }

  selectClientDemoUser(clientId: string): SalonClientRecord | null {
    const match = this.clients().find((c) => c.id === clientId) ?? this.clients()[0] ?? null;
    if (match) {
      this.activeClientUser.set(match);
      this.lastActionBanner.set(
        `Client VIP Portal switched to ${match.name} (${match.tierEn})`,
      );
    }
    return match;
  }

  reserveRetailItem(id: string): void {
    const item = this.inventory().find((i) => i.id === id);
    if (!item || item.stockQty <= 0) return;
    this.adjustInventoryStock(id, -1);
    const client = this.activeClientUser();
    this.lastActionBanner.set(
      `Reserved "${item.nameEn}" (${item.unitPrice.toFixed(3)} OMR) for ${client.name}`,
    );
  }

  resetDemoState(): void {
    this.services.set(INITIAL_SERVICES);
    this.stylists.set(INITIAL_STYLISTS);
    this.appointments.set(INITIAL_APPOINTMENTS);
    this.waitlist.set(INITIAL_WAITLIST);
    this.clients.set(INITIAL_CLIENTS);
    this.receipts.set(INITIAL_RECEIPTS);
    this.inventory.set(INITIAL_INVENTORY);
    this.packages.set(INITIAL_PACKAGES);
    this.campaigns.set(INITIAL_CAMPAIGNS);
    this.users.set(INITIAL_USERS);
    this.currentUser.set(null);
    this.activeClientUser.set(INITIAL_CLIENTS[0]!);
    this.authError.set(null);
    this.lastBookedRef.set(null);
    this.lastActionBanner.set(null);
  }
}
