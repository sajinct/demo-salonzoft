import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../core/language';
@Component({
  selector: 'app-guide',
  imports: [RouterLink, MatButtonModule],
  template: `<section class="guide-page">
    <div class="guide-hero">
      <div>
        <p class="eyebrow">{{ text().foundation }}</p>
        <h1>{{ text().guideTitle }}</h1>
        <p class="muted">{{ text().guideIntro }}</p>
      </div>
      <div class="guide-logo-card">
        <img src="assets/brand/logo-transparent.svg" alt="Salonzoft" width="220" height="176" />
      </div>
    </div>
    <div class="guide-grid">
      <article>
        <h2>{{ text().available }}</h2>
        <p>{{ text().availableBody }}</p>
      </article>
      <article>
        <h2>{{ text().later }}</h2>
        <p>{{ text().laterBody }}</p>
      </article>
      <article>
        <h2>{{ text().data }}</h2>
        <p>{{ text().dataBody }}</p>
      </article>
    </div>
    <a mat-flat-button routerLink="/">{{ text().back }}</a>
  </section>`,
})
export class Guide {
  protected readonly text = inject(Language).copy;
}
