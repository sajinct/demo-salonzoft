import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSession } from './auth-session';
import { safeReturnRoute } from './contracts';
import { RuntimeConfig } from '../runtime-config';

export const authenticated: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthSession);
  const router = inject(Router);
  if (inject(RuntimeConfig).state() !== 'ready') return router.createUrlTree(['/auth/sign-in']);
  await auth.initialize();
  return auth.state() === 'authenticated'
    ? true
    : router.createUrlTree(['/auth/sign-in'], {
        queryParams: { returnUrl: safeReturnRoute(state.url) },
      });
};
