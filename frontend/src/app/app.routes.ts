import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    title: 'Miznora Salon & Spa · Online Booking',
    loadComponent: () => import('./features/foundation/overview').then((module) => module.Overview),
  },
  {
    path: 'login',
    title: 'Miznora Salon & Spa · Staff Login',
    loadComponent: () => import('./features/admin/staff-login').then((module) => module.StaffLogin),
  },
  {
    path: 'admin',
    title: 'Miznora Salon & Spa · Admin & Staff Portal',
    loadComponent: () =>
      import('./features/admin/admin-portal').then((module) => module.AdminPortal),
  },
  {
    path: 'workspace',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'features',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'pricing',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'guide',
    title: 'Salonzoft · Workspace guide',
    loadComponent: () => import('./features/foundation/guide').then((module) => module.Guide),
  },
  {
    path: '**',
    title: 'Salonzoft · Page unavailable',
    loadComponent: () =>
      import('./features/foundation/not-found').then((module) => module.NotFound),
  },
];
