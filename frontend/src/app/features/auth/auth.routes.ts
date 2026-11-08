import { Routes } from '@angular/router';
import { authenticated } from '../../core/auth/auth.guard';
const credentials = () => import('./credentials-page').then((module) => module.CredentialsPage);
const callback = () => import('./callback-page').then((module) => module.CallbackPage);
export const authRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'businesses/select' },
  {
    path: 'auth/sign-in',
    loadComponent: credentials,
    data: { mode: 'signin' },
    title: 'Salonzoft · Sign in',
  },
  {
    path: 'auth/sign-up',
    loadComponent: credentials,
    data: { mode: 'signup' },
    title: 'Salonzoft · Create account',
  },
  {
    path: 'auth/confirm',
    loadComponent: credentials,
    data: { mode: 'confirm' },
    title: 'Salonzoft · Confirm email',
  },
  {
    path: 'auth/forgot-password',
    loadComponent: credentials,
    data: { mode: 'forgot' },
    title: 'Salonzoft · Password recovery',
  },
  {
    path: 'auth/reset-password',
    loadComponent: credentials,
    data: { mode: 'reset' },
    title: 'Salonzoft · New password',
  },
  { path: 'auth/callback', loadComponent: callback, title: 'Salonzoft · Confirming' },
  {
    path: 'auth/recovery-callback',
    loadComponent: callback,
    data: { recovery: true },
    title: 'Salonzoft · Recovery',
  },
  {
    path: 'businesses/select',
    canActivate: [authenticated],
    loadComponent: () => import('./workspace-page').then((module) => module.WorkspacePage),
    title: 'Salonzoft · Businesses',
  },
  {
    path: 'businesses/create',
    canActivate: [authenticated],
    loadComponent: () =>
      import('./create-business-page').then((module) => module.CreateBusinessPage),
    title: 'Salonzoft · Create business',
  },
  {
    path: 'invitations/accept',
    loadComponent: () => import('./invitation-page').then((module) => module.InvitationPage),
    title: 'Salonzoft · Invitation',
  },
  {
    path: 'access/:businessId',
    canActivate: [authenticated],
    loadComponent: () => import('./access-page').then((module) => module.AccessPage),
    title: 'Salonzoft · Access management',
  },
];
