import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTarget, routingFeatures, targetRoutes } from './core/target.providers';
import { AppErrorHandler } from './core/app-errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(targetRoutes, ...routingFeatures),
    provideTarget(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
};
