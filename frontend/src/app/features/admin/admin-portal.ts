import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../core/language';
import {
  AdminMenuId,
  SalonAppointment,
  SalonInstanceStore,
  SalonRole,
} from '../../core/salon-config';

export interface AdminNavItem {
  readonly id: AdminMenuId;
  readonly icon: string;
  readonly labelEn: string;
  readonly labelAr: string;
  readonly badge?: () => string | number;
}

@Component({
  selector: 'app-admin-portal',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule],
  templateUrl: './admin-portal.html',
  styleUrl: './admin-portal.scss',
})
export class AdminPortal implements OnInit {
  protected readonly salon = inject(SalonInstanceStore);
  protected readonly language = inject(Language);
  protected readonly text = this.language.copy;
  private readonly router = inject(Router);

  protected readonly activeMenu = signal<AdminMenuId>('dashboard');
  protected readonly selectedBranchFilter = signal<string>('All');
  protected readonly crmSearch = signal<string>('');

  protected readonly navItems: readonly AdminNavItem[] = [
    {
      id: 'dashboard',
      icon: '◈',
      labelEn: 'Executive Dashboard',
      labelAr: 'لوحة القيادة التنفيذية',
    },
    {
      id: 'calendar',
      icon: '📅',
      labelEn: 'Appointments & Calendar',
      labelAr: 'جدول المواعيد والاستقبال',
      badge: () => this.salon.appointments().length,
    },
    {
      id: 'waitlist',
      icon: '⏳',
      labelEn: 'VIP Smart Waitlist',
      labelAr: 'قائمة الانتظار الذكية',
      badge: () => this.salon.waitlist().length,
    },
    {
      id: 'pos',
      icon: '💳',
      labelEn: 'POS & Cash Register',
      labelAr: 'نقطة البيع والصندوق',
      badge: () => this.salon.receipts().length,
    },
    {
      id: 'crm',
      icon: '✦',
      labelEn: 'Client CRM & Formulas',
      labelAr: 'ملفات العميلات والتركيبات',
      badge: () => this.salon.clients().length,
    },
    {
      id: 'catalogue',
      icon: '✂',
      labelEn: 'Service Catalogue',
      labelAr: 'قائمة الخدمات والأسعار',
      badge: () => this.salon.services().length,
    },
    {
      id: 'inventory',
      icon: '📦',
      labelEn: 'Backbar & Inventory',
      labelAr: 'المخزون والموردين',
      badge: () => this.salon.inventory().length,
    },
    {
      id: 'packages',
      icon: '👑',
      labelEn: 'VIP Packages & Wallets',
      labelAr: 'باقات VIP والمحافظ',
      badge: () => this.salon.packages().length,
    },
    {
      id: 'workforce',
      icon: '👥',
      labelEn: 'Staff & Commissions',
      labelAr: 'الموظفات والعمولات',
      badge: () => this.salon.stylists().length,
    },
    {
      id: 'marketing',
      icon: '💬',
      labelEn: 'WhatsApp Automation',
      labelAr: 'رسائل واتساب والتسويق',
      badge: () => this.salon.campaigns().length,
    },
    {
      id: 'users',
      icon: '🔐',
      labelEn: 'Users & Role Access',
      labelAr: 'المستخدمون والصلاحيات',
      badge: () => this.salon.users().length,
    },
  ];

  protected readonly visibleNavItems = computed(() =>
    this.navItems.filter((item) => this.salon.canAccessTab(item.id)),
  );

  protected readonly walkInForm = new FormGroup({
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

  protected readonly userForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    fullNameEn: new FormControl('', { nonNullable: true }),
    fullNameAr: new FormControl('', { nonNullable: true }),
    role: new FormControl<SalonRole>('receptionist', { nonNullable: true }),
    titleEn: new FormControl('Front-Desk Receptionist', { nonNullable: true }),
    branchScope: new FormControl('Miznora · Al Mouj Muscat', { nonNullable: true }),
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

  ngOnInit(): void {
    const user = this.salon.currentUser();
    if (!user) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.activeMenu.set(this.salon.defaultMenuForRole(user.role));
  }

  protected selectMenu(id: AdminMenuId): void {
    if (this.salon.canAccessTab(id)) {
      this.activeMenu.set(id);
    }
  }

  protected switchDemoRole(role: SalonRole): void {
    const user = this.salon.quickLoginAsRole(role);
    if (user && !this.salon.canAccessTab(this.activeMenu())) {
      this.activeMenu.set(this.salon.defaultMenuForRole(user.role));
    }
  }

  protected signOut(): void {
    this.salon.logoutStaff();
    void this.router.navigateByUrl('/login');
  }

  protected setBranchFilter(branch: string): void {
    this.selectedBranchFilter.set(branch);
  }

  protected onCrmSearch(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.crmSearch.set(input?.value ?? '');
  }

  protected submitWalkInBooking(): void {
    const raw = this.walkInForm.getRawValue();
    this.salon.createBooking({
      branch: raw.branch,
      serviceCode: raw.serviceCode,
      stylistId: raw.stylistId,
      date: raw.date,
      time: raw.time,
      clientName: raw.clientName,
      clientPhone: raw.clientPhone,
      notes: raw.notes,
      source: 'staff',
    });
    this.walkInForm.controls.clientName.setValue('');
    this.walkInForm.controls.clientPhone.setValue('');
    this.walkInForm.controls.notes.setValue('');
  }

  protected advanceStatus(id: string): void {
    this.salon.cycleAppointmentStatus(id);
  }

  protected sendAppointmentToPos(apt: SalonAppointment): void {
    if (!this.salon.canAccessTab('pos')) return;
    this.posForm.controls.clientName.setValue(apt.clientName);
    this.posForm.controls.serviceCode.setValue(apt.serviceCode);
    this.activeMenu.set('pos');
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

  protected onRoleSelectChange(userId: string, event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const role = (select?.value as SalonRole) ?? 'receptionist';
    this.salon.changeUserRole(userId, role);
  }

  protected submitNewStaffUser(): void {
    const raw = this.userForm.getRawValue();
    if (!raw.email.trim() || !raw.fullNameEn.trim()) return;
    this.salon.addStaffUser(raw);
    this.userForm.controls.email.setValue('');
    this.userForm.controls.fullNameEn.setValue('');
    this.userForm.controls.fullNameAr.setValue('');
  }

  protected exportDailyReportCsv(): void {
    const rows = [
      [
        'Receipt No',
        'Client',
        'Summary',
        'Subtotal OMR',
        'Discount OMR',
        '5% VAT OMR',
        'Net Total OMR',
        'Method',
      ],
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
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'miznora-daily-z-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
