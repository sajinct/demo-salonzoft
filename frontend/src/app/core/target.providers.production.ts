// Phase 02 auth is intentionally not included or initialized in production builds.
import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { RouterFeatures } from '@angular/router';
import { DATA_ACCESS } from './data-access';
import { AppDataAccess } from './app-data-access';
import { RuntimeConfig } from './runtime-config';
import { routes } from '../app.routes';
export const targetRoutes = routes;
export const routingFeatures: RouterFeatures[] = [];
export function provideTarget() {
  return makeEnvironmentProviders([
    { provide: DATA_ACCESS, useClass: AppDataAccess },
    provideAppInitializer(() => inject(RuntimeConfig).load()),
  ]);
}
