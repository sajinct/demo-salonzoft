import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { RouterFeatures } from '@angular/router';
import { DATA_ACCESS } from './data-access';
import { AppDataAccess } from './app-data-access';
import { RuntimeConfig } from './runtime-config';
import { AuthSession } from './auth/auth-session';
import { authRoutes } from '../features/auth/auth.routes';
import { routes } from '../app.routes';

export const targetRoutes = [...authRoutes, ...routes];

export const routingFeatures: RouterFeatures[] = [];
export function provideTarget() {
  return makeEnvironmentProviders([
    { provide: DATA_ACCESS, useClass: AppDataAccess },
    provideAppInitializer(async () => {
      const config = inject(RuntimeConfig);
      const auth = inject(AuthSession);
      await config.load();
      if (config.state() === 'ready') await auth.initialize();
    }),
  ]);
}
