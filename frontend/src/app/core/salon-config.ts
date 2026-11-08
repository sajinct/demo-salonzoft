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
  readonly status: 'confirmed' | 'checkedIn' | 'inService' | 'completed';
  readonly notes: string;
  readonly source: 'online' | 'staff';
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
  readonly netTotal: number;
  readonly method: 'Card' | 'Cash' | 'Split';
  readonly time: string;
}

export interface SingleSalonConfig {
  readonly instanceId: string;
  readonly salonNameEn: string;
  readonly salonNameAr: string;
  readonly taglineEn: string;
  readonly taglineAr: string;
  readonly currency: string;
  readonly timeZone: string;
  readonly whatsapp: string;
  readonly openingHours: string;
  /**
   * Optional dedicated Supabase project connection for this single-salon deployment.
   * Leave empty for self-contained GitHub Pages interactive mode.
   */
  readonly supabaseProjectUrl: string;
  readonly supabaseAnonKey: string;
  readonly branches: readonly string[];
  readonly timeSlots: readonly string[];
  readonly services: readonly SalonServiceItem[];
  readonly stylists: readonly SalonStylist[];
}

export const SALON_INSTANCE_CONFIG: SingleSalonConfig = {
  instanceId: 'salonzoft-flagship',
  salonNameEn: 'Noura Studio',
  salonNameAr: 'استوديو نورة',
  taglineEn: 'Dedicated Single-Salon Instance · Hair, Colour & Wellness Spa',
  taglineAr: 'نسخة صالون مستقلة · للشعر والصبغات والعناية الفاخرة',
  currency: 'OMR',
  timeZone: 'Asia/Muscat',
  whatsapp: '+968 9400 8820',
  openingHours: '10:00 – 21:00',
  supabaseProjectUrl: '',
  supabaseAnonKey: '',
  branches: ['Muscat · Al Mouj', 'Seeb · Boulevard', 'Salalah · Sanctuary'],
  timeSlots: ['10:00', '11:00', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'],
  services: [
    {
      code: 'balayage-gloss',
      categoryEn: 'Hair & Colour',
      categoryAr: 'الشعر والصبغات',
      nameEn: 'Signature Balayage & Gloss',
      nameAr: 'بالياج ولمعة سالونزوفت المميزة',
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
      nameEn: 'Bridal Hair & Luminous Makeup',
      nameAr: 'تصفيف ومكياج عروس فاخر',
      durationMin: 180,
      price: 120,
    },
    {
      code: 'royal-hammam',
      categoryEn: 'Spa & Hammam',
      categoryAr: 'السبا والحمام الملكي',
      nameEn: 'Royal Frankincense Hammam',
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
  ],
  stylists: [
    {
      id: 'st-noura',
      nameEn: 'Noura Al- Said',
      nameAr: 'نورة السعيدية',
      roleEn: 'Master Colourist',
      roleAr: 'خبيرة صبغات أولى',
      chairLabelEn: 'Chair 01',
      chairLabelAr: 'كرسي ٠١',
    },
    {
      id: 'st-layla',
      nameEn: 'Layla Al-Harthi',
      nameAr: 'ليلى الحارثية',
      roleEn: 'Keratin & Texture Specialist',
      roleAr: 'أخصائية معالجات وكيراتين',
      chairLabelEn: 'Suite A',
      chairLabelAr: 'جناح أ',
    },
    {
      id: 'st-sara',
      nameEn: 'Sara Al-Zadjali',
      nameAr: 'سارة الزدجالية',
      roleEn: 'Bridal & Editorial Director',
      roleAr: 'مديرة قسم العرائس والمكياج',
      chairLabelEn: 'VIP Bridal Suite',
      chairLabelAr: 'جناح العرائس VIP',
    },
    {
      id: 'st-huda',
      nameEn: 'Huda Al-Kathiri',
      nameAr: 'هدى الكثيرية',
      roleEn: 'Senior Hammam & Spa Therapist',
      roleAr: 'أخصائية السبا والحمام الملكي',
      chairLabelEn: 'Hammam 01',
      chairLabelAr: 'حمام ٠١',
    },
  ],
};

const INITIAL_APPOINTMENTS: readonly SalonAppointment[] = [
  {
    id: 'apt-1',
    refCode: 'SZ-1042',
    branch: 'Muscat · Al Mouj',
    time: '10:00',
    date: '2026-11-09',
    clientName: 'Alya Al-Harthi',
    clientPhone: '+968 9912 3401',
    serviceCode: 'balayage-gloss',
    serviceEn: 'Signature Balayage & Gloss',
    serviceAr: 'بالياج ولمعة سالونزوفت المميزة',
    stylistEn: 'Noura · Chair 01',
    stylistAr: 'نورة · كرسي ٠١',
    price: 44,
    status: 'inService',
    notes: 'Warm honey face-framing highlights',
    source: 'online',
  },
  {
    id: 'apt-2',
    refCode: 'SZ-1043',
    branch: 'Muscat · Al Mouj',
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
    refCode: 'SZ-1044',
    branch: 'Seeb · Boulevard',
    time: '13:30',
    date: '2026-11-09',
    clientName: 'Reem Al-Zadjali',
    clientPhone: '+968 9711 8890',
    serviceCode: 'bridal-styling',
    serviceEn: 'Bridal Hair & Luminous Makeup',
    serviceAr: 'تصفيف ومكياج عروس فاخر',
    stylistEn: 'Sara · VIP Bridal Suite',
    stylistAr: 'سارة · جناح العرائس VIP',
    price: 120,
    status: 'confirmed',
    notes: 'Includes veil pinning & touch-up kit',
    source: 'staff',
  },
  {
    id: 'apt-4',
    refCode: 'SZ-1045',
    branch: 'Salalah · Sanctuary',
    time: '15:00',
    date: '2026-11-09',
    clientName: 'Salma Al-Kathiri',
    clientPhone: '+968 9544 2210',
    serviceCode: 'royal-hammam',
    serviceEn: 'Royal Frankincense Hammam',
    serviceAr: 'حمام اللبان العُماني الملكي',
    stylistEn: 'Huda · Hammam 01',
    stylistAr: 'هدى · حمام ٠١',
    price: 68,
    status: 'confirmed',
    notes: 'Hojari frankincense steam & rose clay mask',
    source: 'online',
  },
];

const INITIAL_CLIENTS: readonly SalonClientRecord[] = [
  {
    id: 'cl-1',
    name: 'Sheikha Al-Lawati',
    phone: '+968 9901 4422',
    tierEn: 'Emerald VIP · 18 Visits',
    tierAr: 'نخبة الزمرد · ١٨ زيارة',
    visits: 18,
    formula: '7.1 Ash Blonde (40g) + 8.31 Champagne (20g) · 20 Vol · 35m',
    notes: 'Patch test verified · Prefers silent appointment & cardamom tea',
    patchTestVerified: true,
  },
  {
    id: 'cl-2',
    name: 'Alya Al-Harthi',
    phone: '+968 9912 3401',
    tierEn: 'Gold Member · 9 Visits',
    tierAr: 'عضوية ذهبية · ٩ زيارات',
    visits: 9,
    formula: '9.13 Beige Blonde Gloss (30g) + Clear (15g) · 10 Vol · 20m',
    notes: 'Sensitive scalp — apply soothing botanical oil barrier',
    patchTestVerified: true,
  },
  {
    id: 'cl-3',
    name: 'Maha Al-Busaidi',
    phone: '+968 9820 1140',
    tierEn: 'Emerald VIP · 14 Visits',
    tierAr: 'نخبة الزمرد · ١٤ زيارة',
    visits: 14,
    formula: 'Botanical Keratin Pure + Argan Sealant · 190°C Silk Press',
    notes: 'Prefers Suite A private room',
    patchTestVerified: true,
  },
];

const INITIAL_RECEIPTS: readonly SalonPosReceipt[] = [
  {
    id: 'rc-1',
    receiptNo: 'INV-2026-081',
    clientName: 'Sheikha Al-Lawati',
    summaryEn: 'Signature Balayage & Gloss + Botanical Mask (VIP -10%)',
    summaryAr: 'بالياج ولمعة سالونزوفت + قناع نباتي (خصم VIP ١٠٪)',
    netTotal: 58.5,
    method: 'Split',
    time: '09:45',
  },
  {
    id: 'rc-2',
    receiptNo: 'INV-2026-082',
    clientName: 'Dana Al-Shanfari',
    summaryEn: 'Hydra-Glow Facial & Scalp Spa',
    summaryAr: 'فيشل النضارة وسبا فروة الرأس',
    netTotal: 52.0,
    method: 'Card',
    time: '10:20',
  },
];

@Injectable({ providedIn: 'root' })
export class SalonInstanceStore {
  readonly config = SALON_INSTANCE_CONFIG;
  readonly appointments = signal<readonly SalonAppointment[]>(INITIAL_APPOINTMENTS);
  readonly clients = signal<readonly SalonClientRecord[]>(INITIAL_CLIENTS);
  readonly receipts = signal<readonly SalonPosReceipt[]>(INITIAL_RECEIPTS);
  readonly lastBookedRef = signal<string | null>(null);

  readonly todayRevenue = computed(() =>
    this.receipts()
      .reduce((sum, item) => sum + item.netTotal, 0)
      .toFixed(3),
  );

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
      this.config.services.find((item) => item.code === input.serviceCode) ??
      this.config.services[0]!;
    const stylist =
      this.config.stylists.find((item) => item.id === input.stylistId) ??
      this.config.stylists[0]!;
    const nextNumber = 1046 + this.appointments().length;
    const refCode = `SZ-${nextNumber}`;
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
    return created;
  }

  cycleAppointmentStatus(id: string): void {
    const order: readonly SalonAppointment['status'][] = [
      'confirmed',
      'checkedIn',
      'inService',
      'completed',
    ];
    this.appointments.update((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const currentIndex = order.indexOf(item.status);
        const nextStatus = order[(currentIndex + 1) % order.length] ?? 'confirmed';
        return { ...item, status: nextStatus };
      }),
    );
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
      tierEn: 'New Salon Client · 1 Visit',
      tierAr: 'عميلة جديدة · زيارة واحدة',
      visits: 1,
      formula: input.formula.trim() || 'Consultation recorded',
      notes: input.notes.trim() || 'Patch test verified',
      patchTestVerified: true,
    };
    this.clients.update((list) => [record, ...list]);
  }

  checkoutPos(input: {
    clientName: string;
    serviceCode: string;
    includeRetailMask: boolean;
    applyVipDiscount: boolean;
    method: 'Card' | 'Cash' | 'Split';
  }): SalonPosReceipt {
    const service =
      this.config.services.find((item) => item.code === input.serviceCode) ??
      this.config.services[0]!;
    const retailPrice = input.includeRetailMask ? 21 : 0;
    const subtotal = service.price + retailPrice;
    const discount = input.applyVipDiscount ? Number((subtotal * 0.1).toFixed(3)) : 0;
    const netTotal = Number((subtotal - discount).toFixed(3));
    const receiptNo = `INV-2026-0${81 + this.receipts().length}`;
    const receipt: SalonPosReceipt = {
      id: `rc-${Date.now()}`,
      receiptNo,
      clientName: input.clientName.trim() || 'Walk-in Client',
      summaryEn:
        service.nameEn +
        (input.includeRetailMask ? ' + Botanical Mask' : '') +
        (input.applyVipDiscount ? ' (VIP -10%)' : ''),
      summaryAr:
        service.nameAr +
        (input.includeRetailMask ? ' + قناع نباتي' : '') +
        (input.applyVipDiscount ? ' (خصم VIP ١٠٪)' : ''),
      netTotal,
      method: input.method,
      time: 'Just now',
    };
    this.receipts.update((list) => [receipt, ...list]);
    return receipt;
  }

  resetDemoState(): void {
    this.appointments.set(INITIAL_APPOINTMENTS);
    this.clients.set(INITIAL_CLIENTS);
    this.receipts.set(INITIAL_RECEIPTS);
    this.lastBookedRef.set(null);
  }
}
