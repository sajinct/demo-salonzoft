import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch(() => {
  const root = document.querySelector('app-root');
  if (root)
    root.textContent =
      'Salonzoft could not start. Reload the page or check the local setup instructions in README.md.';
});
