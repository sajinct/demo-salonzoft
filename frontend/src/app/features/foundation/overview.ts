import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DATA_ACCESS } from '../../core/data-access';
import { Language } from '../../core/language';
import { SalonAppointment, SalonInstanceStore } from '../../core/salon-config';

interface StudioPresetMeta {
  readonly chairs: string;
  readonly retention: string;
}

const DEFAULT_PRESET_META: StudioPresetMeta = {
  chairs: '12 Chairs · 3 VIP Suites',
  retention: '89%',
};

const PRESET_META: Record<string, StudioPresetMeta> = {
  'fictional-noura': DEFAULT_PRESET_META,
  'fictional-waha': {
    chairs: '8 Spa Suites · 2 Hammams',
    retention: '93%',
  },
};

export type StaffPortalTab =
  | 'calendar'
  | 'pos'
  | 'crm'
  | 'inventory'
  | 'packages'
  | 'workforce';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  protected readonly data = inject(DATA_ACCESS);
  protected readonly language = inject(Language);
  protected readonly salon = inject(SalonInstanceStore);
  protected readonly text = this.language.copy;

  protected readonly previewTab = signal<'calendar' | 'pos' | 'crm'>('calendar');
  protected readonly staffTab = signal<StaffPortalTab>('calendar');
  protected readonly selectedCategory = signal<string>('All');
  protected readonly selectedBranchFilter = signal<string>('All');
  protected readonly crmSearch = signal<string>('');

  protected readonly selection = new FormControl(this.data.selected()?.id ?? '', {
    nonNullable: true,
  });

  protected readonly bookingForm = new FormGroup({
    branch: new FormControl(this.salon.config.branches[0] ?? 'Miznora · Al Mouj Muscat', {
      nonNullable: true,
    }),
    serviceCode: new FormControl(this.salon.services()[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    stylistId: new FormControl(this.salon.stylists()[0]?.id ?? 'st-noura', {
      nonNullable: true,
    }),
    date: new FormControl('2026-11-09', { nonNullable: true }),
    time: new FormControl('16:30', { nonNullable: true }),
    clientName: new FormControl('', { nonNullable: true }),
    clientPhone: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly waitlistForm = new FormGroup({
    clientName: new FormControl('', { nonNullable: true }),
    clientPhone: new FormControl('', { nonNullable: true }),
    branch: new FormControl(this.salon.config.branches[0] ?? 'Miznora · Al Mouj Muscat', {
      nonNullable: true,
    }),
    serviceCode: new FormControl(this.salon.services()[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    preferredWindow: new FormControl('16:30 – 19:30', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly posForm = new FormGroup({
    clientName: new FormControl('Alya Al-Harthi', { nonNullable: true }),
    serviceCode: new FormControl(this.salon.services()[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    includeRetailMask: new FormControl(true, { nonNullable: true }),
    applyVipDiscount: new FormControl(true, { nonNullable: true }),
    method: new FormControl<'Card' | 'Cash' | 'Split' | 'Wallet'>('Card', { nonNullable: true }),
  });

  protected readonly crmForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    formula: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly inventoryForm = new FormGroup({
    nameEn: new FormControl('', { nonNullable: true }),
    nameAr: new FormControl('', { nonNullable: true }),
    category: new FormControl<'Backbar' | 'Retail'>('Backbar', { nonNullable: true }),
    supplier: new FormControl('Muscat Botanicals LLC', { nonNullable: true }),
    stockQty: new FormControl(12, { nonNullable: true }),
    unitPrice: new FormControl(28, { nonNullable: true }),
  });

  protected readonly packageForm = new FormGroup({
    clientName: new FormControl('', { nonNullable: true }),
    clientPhone: new FormControl('', { nonNullable: true }),
    titleEn: new FormControl('Miznora Emerald 6-Ritual Pass', { nonNullable: true }),
    titleAr: new FormControl('باقة نخبة الزمرد (٦ جلسات)', { nonNullable: true }),
    totalSessions: new FormControl(6, { nonNullable: true }),
    walletBalance: new FormControl(150, { nonNullable: true }),
  });

  protected readonly serviceForm = new FormGroup({
    categoryEn: new FormControl('Hair & Colour', { nonNullable: true }),
    nameEn: new FormControl('', { nonNullable: true }),
    nameAr: new FormControl('', { nonNullable: true }),
    durationMin: new FormControl(90, { nonNullable: true }),
    price: new FormControl(48, { nonNullable: true }),
  });

  protected readonly serviceCategories = computed(() => {
    const cats = new Set<string>(['All']);
    for (const s of this.salon.services()) {
      cats.add(s.categoryEn);
    }
    return Array.from(cats);
  });

  protected readonly filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.salon.services();
    return this.salon.services().filter((s) => s.categoryEn === cat);
  });

  protected readonly filteredAppointments = computed(() => {
    const branch = this.selectedBranchFilter();
    if (branch === 'All') return this.salon.appointments();
    return this.salon.appointments().filter((a) => a.branch === branch);
  });

  protected readonly filteredClients = computed(() => {
    const q = this.crmSearch().trim().toLowerCase();
    if (!q) return this.salon.clients();
    return this.salon
      .clients()
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.formula.toLowerCase().includes(q),
      );
  });

  protected readonly presetMeta = computed<StudioPresetMeta>(() => {
    const id = this.data.selected()?.id ?? 'fictional-noura';
    return PRESET_META[id] ?? DEFAULT_PRESET_META;
  });

  protected setPreviewTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.previewTab.set(tab);
  }

  protected setStaffTab(tab: StaffPortalTab): void {
    this.staffTab.set(tab);
  }

  protected setCategoryFilter(cat: string): void {
    this.selectedCategory.set(cat);
  }

  protected setBranchFilter(branch: string): void {
    this.selectedBranchFilter.set(branch);
  }

  protected onCrmSearch(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.crmSearch.set(input?.value ?? '');
  }

  protected scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected chooseServiceForBooking(code: string): void {
    this.bookingForm.controls.serviceCode.setValue(code);
    this.scrollTo('booking-form');
  }

  protected submitOnlineBooking(): void {
    const raw = this.bookingForm.getRawValue();
    this.salon.createBooking({
      branch: raw.branch,
      serviceCode: raw.serviceCode,
      stylistId: raw.stylistId,
      date: raw.date,
      time: raw.time,
      clientName: raw.clientName,
      clientPhone: raw.clientPhone,
      notes: raw.notes,
      source: 'online',
    });
    this.bookingForm.controls.clientName.setValue('');
    this.bookingForm.controls.clientPhone.setValue('');
    this.bookingForm.controls.notes.setValue('');
  }

  protected submitWaitlist(): void {
    const raw = this.waitlistForm.getRawValue();
    if (!raw.clientName.trim()) return;
    this.salon.addWaitlistEntry(raw);
    this.waitlistForm.controls.clientName.setValue('');
    this.waitlistForm.controls.clientPhone.setValue('');
    this.waitlistForm.controls.notes.setValue('');
  }

  protected promoteWaitlist(id: string): void {
    this.salon.promoteWaitlistToBooking(id);
  }

  protected advanceStatus(id: string): void {
    this.salon.cycleAppointmentStatus(id);
  }

  protected sendAppointmentToPos(apt: SalonAppointment): void {
    this.posForm.controls.clientName.setValue(apt.clientName);
    this.posForm.controls.serviceCode.setValue(apt.serviceCode);
    this.staffTab.set('pos');
  }

  protected submitPosCheckout(): void {
    const raw = this.posForm.getRawValue();
    this.salon.checkoutPos({
      clientName: raw.clientName,
      serviceCode: raw.serviceCode,
      includeRetailMask: raw.includeRetailMask,
      applyVipDiscount: raw.applyVipDiscount,
      method: raw.method,
    });
  }

  protected submitCrmFormula(): void {
    const raw = this.crmForm.getRawValue();
    if (!raw.name.trim()) return;
    this.salon.addClientFormula(raw);
    this.crmForm.reset({ name: '', phone: '', formula: '', notes: '' });
  }

  protected togglePatchTest(id: string): void {
    this.salon.toggleClientPatchTest(id);
  }

  protected adjustStock(id: string, delta: number): void {
    this.salon.adjustInventoryStock(id, delta);
  }

  protected submitInventoryItem(): void {
    const raw = this.inventoryForm.getRawValue();
    if (!raw.nameEn.trim()) return;
    this.salon.addInventoryItem(raw);
    this.inventoryForm.controls.nameEn.setValue('');
    this.inventoryForm.controls.nameAr.setValue('');
  }

  protected redeemSession(id: string): void {
    this.salon.redeemPackageSession(id);
  }

  protected submitVipPackage(): void {
    const raw = this.packageForm.getRawValue();
    if (!raw.clientName.trim()) return;
    this.salon.issueVipPackage(raw);
    this.packageForm.controls.clientName.setValue('');
    this.packageForm.controls.clientPhone.setValue('');
  }

  protected cycleFloorStatus(id: string): void {
    this.salon.cycleStaffFloorStatus(id);
  }

  protected submitNewService(): void {
    const raw = this.serviceForm.getRawValue();
    if (!raw.nameEn.trim()) return;
    this.salon.addServiceItem(raw);
    this.serviceForm.controls.nameEn.setValue('');
    this.serviceForm.controls.nameAr.setValue('');
  }

  protected triggerCampaign(id: string): void {
    this.salon.triggerAutomationCampaign(id);
  }

  protected exportDailyReportCsv(): void {
    const rows = [
      ['Receipt No', 'Client', 'Summary', 'Subtotal OMR', 'Discount OMR', '5% VAT OMR', 'Net Total OMR', 'Method'],
      ...this.salon.receipts().map((r) => [
        r.receiptNo,
        r.clientName,
        r.summaryEn,
        r.subtotal.toFixed(3),
        r.discount.toFixed(3),
        r.vatAmount.toFixed(3),
        r.netTotal.toFixed(3),
        r.method,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'miznora-daily-z-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  protected select(): void {
    this.data.selectWorkspace(this.selection.value);
  }

  protected reset(): void {
    this.data.reset();
    this.salon.resetDemoState();
    this.selection.setValue(this.data.selected()?.id ?? '');
  }
}
