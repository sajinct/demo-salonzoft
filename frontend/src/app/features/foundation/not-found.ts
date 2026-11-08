import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../core/language';
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `<section class="guide-page">
    <p class="eyebrow">404</p>
    <h1>{{ text().notFound }}</h1>
    <p>{{ text().notFoundBody }}</p>
    <a mat-flat-button routerLink="/">{{ text().back }}</a>
  </section>`,
})
export class NotFound {
  protected readonly text = inject(Language).copy;
}
