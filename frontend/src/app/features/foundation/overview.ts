import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DATA_ACCESS } from '../../core/data-access';
import { Language } from '../../core/language';
import { SalonInstanceStore, type SalonRole } from '../../core/salon-config';

@Component({
  selector: 'app-overview',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  protected readonly data = inject(DATA_ACCESS);
  protected readonly language = inject(Language);
  protected readonly salon = inject(SalonInstanceStore);
  private readonly router = inject(Router);
  protected readonly text = this.language.copy;

  protected readonly previewTab = signal<'calendar' | 'pos' | 'crm'>('calendar');
  protected readonly selectedCategory = signal<string>('All');
  protected readonly waitlistJoinedBanner = signal<string | null>(null);

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
    clientName: new FormControl(this.salon.activeClientUser().name, { nonNullable: true }),
    clientPhone: new FormControl(this.salon.activeClientUser().phone, { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly waitlistForm = new FormGroup({
    branch: new FormControl(this.salon.config.branches[0] ?? 'Miznora · Al Mouj Muscat', {
      nonNullable: true,
    }),
    serviceCode: new FormControl(this.salon.services()[0]?.code ?? 'balayage-gloss', {
      nonNullable: true,
    }),
    preferredWindow: new FormControl('17:00 – 20:00 (Evening Slot)', { nonNullable: true }),
    clientName: new FormControl(this.salon.activeClientUser().name, { nonNullable: true }),
    clientPhone: new FormControl(this.salon.activeClientUser().phone, { nonNullable: true }),
    notes: new FormControl('Notify via WhatsApp if an earlier chair opens', { nonNullable: true }),
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

  protected chooseStylistForBooking(stylistId: string): void {
    this.bookingForm.controls.stylistId.setValue(stylistId);
    this.scrollTo('booking-form');
  }

  protected selectClientDemoAccount(clientId: string): void {
    const selected = this.salon.selectClientDemoUser(clientId);
    if (selected) {
      this.bookingForm.controls.clientName.setValue(selected.name);
      this.bookingForm.controls.clientPhone.setValue(selected.phone);
      this.waitlistForm.controls.clientName.setValue(selected.name);
      this.waitlistForm.controls.clientPhone.setValue(selected.phone);
    }
  }

  protected loginAsDemoStaffRole(role: SalonRole): void {
    const loggedIn = this.salon.quickLoginAsRole(role);
    if (loggedIn) {
      void this.router.navigateByUrl('/admin');
    }
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
    this.bookingForm.controls.notes.setValue('');
  }

  protected submitClientWaitlist(): void {
    const raw = this.waitlistForm.getRawValue();
    this.salon.addWaitlistEntry({
      clientName: raw.clientName,
      clientPhone: raw.clientPhone,
      branch: raw.branch,
      serviceCode: raw.serviceCode,
      preferredWindow: raw.preferredWindow,
      notes: raw.notes,
    });
    this.waitlistJoinedBanner.set(
      `Added ${raw.clientName || 'Guest'} to the Miznora Priority VIP Waitlist (${raw.preferredWindow})`,
    );
  }
}
