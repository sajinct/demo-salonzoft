import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DATA_ACCESS } from '../../core/data-access';
import { Language } from '../../core/language';

interface PreviewBooking {
  readonly time: string;
  readonly clientEn: string;
  readonly clientAr: string;
  readonly serviceEn: string;
  readonly serviceAr: string;
  readonly stylistEn: string;
  readonly stylistAr: string;
  readonly amount: string;
  readonly status: 'confirmed' | 'inService' | 'checkedIn';
}

interface StudioMetrics {
  readonly bookings: string;
  readonly chairs: string;
  readonly avgTicket: string;
  readonly retention: string;
  readonly schedule: readonly PreviewBooking[];
}

const DEFAULT_METRICS: StudioMetrics = {
  bookings: '42',
  chairs: '12 Chairs · 3 VIP Suites',
  avgTicket: '48.500 OMR',
  retention: '89%',
  schedule: [
    {
      time: '10:00',
      clientEn: 'Alya Al-Harthi',
      clientAr: 'علياء الحارثية',
      serviceEn: 'Signature Balayage & Gloss',
      serviceAr: 'بالياج ولمعة سالونزوفت',
      stylistEn: 'Noura · Chair 01',
      stylistAr: 'نورة · كرسي ٠١',
      amount: '44.000 OMR',
      status: 'inService',
    },
    {
      time: '11:30',
      clientEn: 'Maha Al-Busaidi',
      clientAr: 'مها البوسعيدية',
      serviceEn: 'Botanical Keratin Ritual',
      serviceAr: 'علاج الكيراتين النباتي',
      stylistEn: 'Layla · Suite A',
      stylistAr: 'ليلى · جناح أ',
      amount: '55.000 OMR',
      status: 'checkedIn',
    },
    {
      time: '13:15',
      clientEn: 'Reem Al-Zadjali',
      clientAr: 'ريم الزدجالية',
      serviceEn: 'Bridal Hair & Luminous Makeup',
      serviceAr: 'تصفيف ومكياج عروس فاخر',
      stylistEn: 'Sara · VIP Bridal',
      stylistAr: 'سارة · جناح العرائس',
      amount: '120.000 OMR',
      status: 'confirmed',
    },
  ],
};

const STUDIO_METRICS: Record<string, StudioMetrics> = {
  'fictional-noura': DEFAULT_METRICS,
  'fictional-waha': {
    bookings: '29',
    chairs: '8 Spa Suites · 2 Hammams',
    avgTicket: '64.000 OMR',
    retention: '93%',
    schedule: [
      {
        time: '10:30',
        clientEn: 'Salma Al-Kathiri',
        clientAr: 'سلمى الكثيرية',
        serviceEn: 'Royal Frankincense Hammam',
        serviceAr: 'حمام اللبان الملكي',
        stylistEn: 'Huda · Hammam 01',
        stylistAr: 'هدى · حمام ٠١',
        amount: '68.000 OMR',
        status: 'inService',
      },
      {
        time: '12:00',
        clientEn: 'Dana Al-Shanfari',
        clientAr: 'دانة الشنفرية',
        serviceEn: 'Hydra-Glow Facial & Scalp Spa',
        serviceAr: 'فيشل النضارة وسبا فروة الرأس',
        stylistEn: 'Amira · Suite 03',
        stylistAr: 'أميرة · جناح ٠٣',
        amount: '52.000 OMR',
        status: 'checkedIn',
      },
      {
        time: '14:00',
        clientEn: 'Noor Al-Rawas',
        clientAr: 'نور الرواس',
        serviceEn: 'Aromatherapy Hot Stone Ritual',
        serviceAr: 'مساج الأحجار الساخنة العطري',
        stylistEn: 'Yara · Serenity Room',
        stylistAr: 'يارا · غرفة السكينة',
        amount: '46.000 OMR',
        status: 'confirmed',
      },
    ],
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
  protected readonly text = this.language.copy;
  protected readonly previewTab = signal<'calendar' | 'pos' | 'crm'>('calendar');
  protected readonly billingCycle = signal<'monthly' | 'annual'>('annual');
  protected readonly selection = new FormControl(this.data.selected()?.id ?? '', {
    nonNullable: true,
  });

  protected readonly studioMetrics = computed<StudioMetrics>(() => {
    const id = this.data.selected()?.id ?? 'fictional-noura';
    return STUDIO_METRICS[id] ?? DEFAULT_METRICS;
  });

  protected setPreviewTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.previewTab.set(tab);
  }

  protected setBilling(cycle: 'monthly' | 'annual'): void {
    this.billingCycle.set(cycle);
  }

  protected select(): void {
    this.data.selectWorkspace(this.selection.value);
  }

  protected reset(): void {
    this.data.reset();
    this.selection.setValue(this.data.selected()?.id ?? '');
  }
}
