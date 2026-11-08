import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    title: 'Salonzoft · Overview',
    loadComponent: () => import('./features/foundation/overview').then((module) => module.Overview),
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
