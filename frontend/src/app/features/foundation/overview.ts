import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DATA_ACCESS } from '../../core/data-access';
import { Language } from '../../core/language';
import { SalonInstanceStore } from '../../core/salon-config';

interface StudioPresetMeta {
  readonly bookings: string;
  readonly avgTicket: string;
  readonly chairs: string;
  readonly retention: string;
}

const DEFAULT_PRESET_META: StudioPresetMeta = {
  bookings: '42',
  avgTicket: '48.500 OMR',
  chairs: '12 Chairs · 3 VIP Suites',
  retention: '89%',
};

const PRESET_META: Record<string, StudioPresetMeta> = {
  'fictional-noura': DEFAULT_PRESET_META,
  'fictional-waha': {
    bookings: '29',
    avgTicket: '64.000 OMR',
    chairs: '8 Spa Suites · 2 Hammams',
    retention: '93%',
  },
};

@Component({
  selector: 'app-overview',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  protected readonly data = inject(DATA_ACCESS);
  protected readonly language = inject(Language);
  protected readonly salon = inject(SalonInstanceStore);
  protected readonly text = this.language.copy;

  protected readonly previewTab = signal<'calendar' | 'pos' | 'crm'>('calendar');
  protected readonly billingCycle = signal<'monthly' | 'annual'>('annual');
  protected readonly selectedEdition = signal<'Boutique Studio' | 'Signature Salon & Spa' | 'Enterprise & Custom'>('Signature Salon & Spa');
  protected readonly enquirySubmitted = signal(false);
  protected readonly mailtoUrl = signal('mailto:mail@salonzoft.com?subject=Salonzoft%20Onboarding%20Enquiry');

  protected readonly selection = new FormControl(this.data.selected()?.id ?? '', {
    nonNullable: true,
  });

  protected readonly enquiryForm = new FormGroup({
    salonName: new FormControl('', { nonNullable: true }),
    contactName: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly presetMeta = computed<StudioPresetMeta>(() => {
    const id = this.data.selected()?.id ?? 'fictional-noura';
    return PRESET_META[id] ?? DEFAULT_PRESET_META;
  });

  protected setPreviewTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.previewTab.set(tab);
  }

  protected setBilling(cycle: 'monthly' | 'annual'): void {
    this.billingCycle.set(cycle);
  }

  protected chooseEdition(edition: 'Boutique Studio' | 'Signature Salon & Spa' | 'Enterprise & Custom'): void {
    this.selectedEdition.set(edition);
    this.scrollTo('enquiry');
  }

  protected scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected submitEnquiry(): void {
    const raw = this.enquiryForm.getRawValue();
    const edition = this.selectedEdition();
    const subject = encodeURIComponent(
      `Salonzoft Onboarding Enquiry — ${raw.salonName.trim() || 'New Salon'} (${edition})`,
    );
    const bodyLines = [
      `Salon / Spa Name: ${raw.salonName.trim() || 'Not specified'}`,
      `Contact Name: ${raw.contactName.trim() || 'Not specified'}`,
      `Mobile / WhatsApp: ${raw.phone.trim() || 'Not specified'}`,
      `Email: ${raw.email.trim() || 'Not specified'}`,
      `City / Country: ${raw.city.trim() || 'Not specified'}`,
      `Selected Edition: ${edition} (${this.billingCycle() === 'annual' ? 'Annual' : 'Monthly'})`,
      '',
      'Requirements / Notes:',
      raw.notes.trim() || 'Interested in Salonzoft onboarding and a personalized demo.',
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    this.mailtoUrl.set(`mailto:mail@salonzoft.com?subject=${subject}&body=${body}`);
    this.enquirySubmitted.set(true);
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
