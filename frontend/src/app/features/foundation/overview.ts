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
  protected readonly selectedCategory = signal<string>('All');

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

  protected readonly presetMeta = computed<StudioPresetMeta>(() => {
    const id = this.data.selected()?.id ?? 'fictional-noura';
    return PRESET_META[id] ?? DEFAULT_PRESET_META;
  });

  protected setPreviewTab(tab: 'calendar' | 'pos' | 'crm'): void {
    this.previewTab.set(tab);
  }

  protected setCategoryFilter(cat: string): void {
    this.selectedCategory.set(cat);
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

  protected select(): void {
    this.data.selectWorkspace(this.selection.value);
  }

  protected reset(): void {
    this.data.reset();
    this.salon.resetDemoState();
    this.selection.setValue(this.data.selected()?.id ?? '');
  }
}
