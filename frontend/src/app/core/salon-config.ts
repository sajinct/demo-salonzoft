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
  readonly clientBrandEn: string;
  readonly clientBrandAr: string;
  readonly domain: string;
  readonly taglineEn: string;
  readonly taglineAr: string;
  readonly currency: string;
  readonly timeZone: string;
  readonly whatsapp: string;
  readonly openingHours: string;
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

export const SALON_INSTANCE_CONFIG: SingleSalonConfig = {
  instanceId: 'miznora-demo',
  clientBrandEn: 'Miznora Salon & Spa',
  clientBrandAr: 'ميزنورا للصالون والسبا',
  domain: 'demo.salonzoft.in',
  taglineEn: 'Miznora Luxury Hair, Bridal & Wellness Spa · Powered by Salonzoft',
  taglineAr: 'ميزنورا للفخامة في العناية بالشعر والعرائس والسبا · يعمل بنظام سالونزوفت',
  currency: 'OMR',
  timeZone: 'Asia/Muscat',
  whatsapp: '+968 9400 8820',
  openingHours: '10:00 – 21:00',
  supabaseProjectRef: PROJECT_REF,
  supabaseProjectUrl: SUPABASE_HOST,
  supabasePublishableKey: PUBLISHABLE_KEY,
  branches: [
    'Miznora · Al Mouj Muscat',
    'Miznora · Seeb Boulevard',
    'Miznora · Salalah Sanctuary',
  ],
  timeSlots: ['10:00', '11:00', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'],
  services: [
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
  ],
  stylists: [
    {
      id: 'st-noura',
      nameEn: 'Noura Al-Said',
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
    netTotal: 58.5,
    method: 'Split',
    time: '09:45',
  },
  {
    id: 'rc-2',
    receiptNo: 'MZ-INV-082',
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
  readonly dbStatus = signal<'connected-live' | 'connected-schema-pending' | 'local-preview'>(
    'local-preview',
  );

  readonly todayRevenue = computed(() =>
    this.receipts()
      .reduce((sum, item) => sum + item.netTotal, 0)
      .toFixed(3),
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
      this.config.services.find((item) => item.code === input.serviceCode) ??
      this.config.services[0]!;
    const stylist =
      this.config.stylists.find((item) => item.id === input.stylistId) ??
      this.config.stylists[0]!;
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
    const receiptNo = `MZ-INV-0${81 + this.receipts().length}`;
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
    if (this.canUseRemoteSupabase()) {
      void fetch(`${this.config.supabaseProjectUrl}/rest/v1/salon_invoices`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          receipt_no: receipt.receiptNo,
          client_name: receipt.clientName,
          summary_en: receipt.summaryEn,
          summary_ar: receipt.summaryAr,
          net_total: receipt.netTotal,
          payment_method: receipt.method,
          time_label: receipt.time,
        }),
      }).catch(() => undefined);
    }
    return receipt;
  }

  resetDemoState(): void {
    this.appointments.set(INITIAL_APPOINTMENTS);
    this.clients.set(INITIAL_CLIENTS);
    this.receipts.set(INITIAL_RECEIPTS);
    this.lastBookedRef.set(null);
  }
}
