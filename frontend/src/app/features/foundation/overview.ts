import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DATA_ACCESS } from '../../core/data-access';
import { Language } from '../../core/language';
import { SalonInstanceStore } from '../../core/salon-config';

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
  protected readonly staffTab = signal<'calendar' | 'pos' | 'crm'>('calendar');
  protected readonly billingCycle = signal<'monthly' | 'annual'>('annual');

  protected readonly selection = new FormControl(this.data.selected()?.id ?? '', {
    nonNullable: true,
  });

  protected readonly bookingForm = new FormGroup({
    branch: new FormControl(this.salon.config.branches[0] ?? 'Muscat · Al Mouj', {
      nonNullable: true,
    }),
    serviceCode: new FormControl(this.salon.config.services[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    stylistId: new FormControl(this.salon.config.stylists[0]?.id ?? 'st-noura', {
      nonNullable: true,
    }),
    date: new FormControl('2026-11-09', { nonNullable: true }),
    time: new FormControl('16:30', { nonNullable: true }),
    clientName: new FormControl('', { nonNullable: true }),
    clientPhone: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly posForm = new FormGroup({
    clientName: new FormControl('Alya Al-Harthi', { nonNullable: true }),
    serviceCode: new FormControl(this.salon.config.services[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    includeRetailMask: new FormControl(true, { nonNullable: true }),
    applyVipDiscount: new FormControl(true, { nonNullable: true }),
    method: new FormControl<'Card' | 'Cash' | 'Split'>('Card', { nonNullable: true }),
  });

  protected readonly crmForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    formula: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly presetMeta = computed<StudioPresetMeta>(() => {
    const id = this.data.selected()?.id ?? 'fictional-noura';
    return PRESET_META[id] ?? DEFAULT_PRESET_META;
  });

  protected setPreviewTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.previewTab.set(tab);
  }

  protected setStaffTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.staffTab.set(tab);
  }

  protected setBilling(cycle: 'monthly' | 'annual'): void {
    this.billingCycle.set(cycle);
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

  protected advanceStatus(id: string): void {
    this.salon.cycleAppointmentStatus(id);
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

  protected select(): void {
    this.data.selectWorkspace(this.selection.value);
  }

  protected reset(): void {
    this.data.reset();
    this.salon.resetDemoState();
    this.selection.setValue(this.data.selected()?.id ?? '');
  }
}
