import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from '../lib.mjs';
import { renderBoards } from './review-salonzoft.mjs';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  async function render(source, output, width, height) {
    await page.setViewportSize({ width, height });
    await page.setContent('<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{display:block;width:100%;height:100%}</style>' + readFileSync(resolve(root, source), 'utf8'));
    await page.screenshot({ path: resolve(root, output), omitBackground: true });
  }
  for (const output of ['app-icon.png', 'icon.png']) await render('app-icon.svg', output, 1024, 1024);
  mkdirSync(resolve(root, 'docs/branding/exports'), { recursive: true });
  for (const size of [16, 24, 32, 48, 64, 128, 256]) await render('app-icon-simplified.svg', `docs/branding/exports/app-icon-${size}.png`, size, size);
  await render('app-icon.svg', 'app-icon-preview.png', 512, 512);
  await render('app-icon-simplified.svg', 'app-icon-simplified-preview.png', 512, 512);
  await render('logo.svg', 'logo.png', 1600, 1280);
  await render('logo.svg', 'logo-svg-preview.png', 1000, 800);
  await render('logo-transparent.svg', 'logo-transparent.png', 1600, 1280);
  await render('logo-transparent.svg', 'logo-transparent-preview.png', 1000, 800);
  const horizontalWidth = Number(readFileSync(resolve(root, 'logo-horizontal.svg'), 'utf8').match(/width="(\d+)"/)[1]);
  await render('logo-horizontal.svg', 'logo-horizontal.png', horizontalWidth * 2, 320);
  await renderBoards(page);
  console.log('Rendered PNG exports, native-size icons, final identity and comparison boards.');
} finally { await browser.close(); }
