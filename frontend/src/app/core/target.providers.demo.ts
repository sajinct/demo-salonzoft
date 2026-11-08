import { makeEnvironmentProviders } from '@angular/core';
import { RouterFeatures, withHashLocation } from '@angular/router';
import { DATA_ACCESS } from './data-access';
import { DemoDataAccess } from './demo-data-access';
import { routes } from '../app.routes';
export const targetRoutes = routes;

export const routingFeatures: RouterFeatures[] = [withHashLocation()];
export function provideTarget() {
  return makeEnvironmentProviders([{ provide: DATA_ACCESS, useClass: DemoDataAccess }]);
}
