import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from '../lib.mjs';

export async function renderBoards(page) {
  const img = (name, style = '') => `<img src="data:image/svg+xml;base64,${readFileSync(resolve(root, name)).toString('base64')}" style="${style}" alt="${name}">`;
  const css = `*{box-sizing:border-box}body{margin:0;background:#FBF8F1;color:#063C2D;font:15px 'Segoe UI',Arial,sans-serif;padding:44px 60px}header{display:flex;justify-content:space-between;border-bottom:1px solid #e4dece;padding-bottom:22px;font-size:11px;letter-spacing:2px}h1{font-size:36px;letter-spacing:-1px;margin:20px 0 8px;font-weight:600}p{color:#6d7165;line-height:1.6}img{display:block;object-fit:contain}.label{font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#6d7165}.panel{border:1px solid #e4dece;border-radius:18px;background:white}.dark{background:#063C2D;border-color:#063C2D}.dark .label{color:#d1d9ce}`;
  async function board(html, output, height) {
    await page.setViewportSize({ width: 1400, height });
    await page.setContent(`<html><head><meta charset="utf-8"><title>Salonzoft identity</title><style>${css}</style></head><body>${html}</body></html>`);
    await page.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    await page.screenshot({ path: resolve(root, output) });
  }
  await board(`
    <header><span>SALONZOFT / FINAL PRODUCT IDENTITY</span><span>SALON &amp; SPA MANAGEMENT</span></header>
    <div style="display:grid;grid-template-columns:1fr 300px;gap:60px;align-items:center;padding:64px 30px 60px">
      <div>${img('logo-horizontal.svg','width:600px;max-width:100%')}<p style="margin:18px 24px 0;font-size:17px">Made for the way salons work.</p></div>
      <div>${img('app-icon.svg','width:230px;height:230px;margin:auto')}<p class="label" style="text-align:center;margin-top:20px">FLOWING HAIR · CHAMPAGNE RIBBON · GOLD GLOW</p></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px">
      <div class="panel dark" style="padding:26px"><div class="label">On dark surfaces</div>${img('logo-horizontal-dark.svg','width:100%;height:102px;margin-top:18px')}</div>
      <div class="panel" style="padding:26px"><div class="label">Single-colour reproduction</div>${img('logo-monochrome.svg','width:100%;height:102px;margin-top:18px')}</div>
      <div class="panel" style="padding:26px"><div class="label">Native icon sizes</div><div style="display:flex;align-items:end;justify-content:space-between;margin-top:32px">${[16,24,32,48].map(size=>`<div>${img('app-icon-simplified.svg',`width:${size}px;height:${size}px;margin:auto`)}<div style="text-align:center;font-size:10px;color:#6d7165;margin-top:12px">${size}px</div></div>`).join('')}</div></div>
    </div>
    <footer style="display:flex;gap:36px;align-items:center;border-top:1px solid #e4dece;margin-top:40px;padding-top:26px;font-size:11px;letter-spacing:1px"><span style="color:#005A38">● EMERALD / #005A38</span><span style="color:#8A6525">● GOLD / #C69A3B</span><span>○ IVORY / #FBF8F1</span><span style="margin-left:auto;color:#6d7165">VECTOR OUTLINES · NO FONT DEPENDENCIES</span></footer>
  `, 'docs/branding/salonzoft-preview.png', 830);
  const directions = [
    { name:'01 / Miznora reference', file:'docs/branding/legacy-miznora/app-icon.svg', text:'The reference: emerald, gold, flowing hair, a profile and a beauty sparkle. These are the visual cues to retain.' },
    { name:'02 / Heritage Salonzoft', file:'docs/branding/legacy-salonzoft-2026-11-08/app-icon.svg', text:'A letter-led version of the original. The large serif S competes with the salon details.' },
    { name:'03 / Plain ribbon S', file:'docs/branding/legacy-salonzoft-ribbon-s/app-icon.svg', text:'A compact software mark, but it does not communicate salon or spa clearly enough for the requested identity.' },
    { name:'04 / Salonzoft salon emblem', file:'app-icon.svg', text:'Flowing emerald hair, a champagne-gold ribbon and a luminous gold glow. Luxury serif lettering keeps the software name clear.' },
  ];  await board(`<header><span>SALONZOFT / DESIGN COMPARISON</span><span>LOCAL DESIGN REVIEW</span></header><h1>Salon heritage, refined for Salonzoft.</h1><p>Emerald and gold from Miznora, with an unmistakable salon emblem.</p><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:36px">${directions.map((d,i)=>`<article class="panel" style="padding:24px;${i===3?'border:2px solid #005A38;background:#f1f4e9':''}"><div class="label" style="height:36px">${d.name}</div>${img(d.file,'width:170px;height:170px;margin:16px auto 26px')}<div style="height:38px;display:flex;gap:14px;align-items:center;justify-content:center">${img(d.file,'width:32px;height:32px')}${img(d.file,'width:16px;height:16px')}</div><p style="font-size:13px;min-height:110px;margin-top:24px">${d.text}</p><span style="font-size:11px;font-weight:600;color:${i===3?'#005A38':'#6d7165'}">${i===3?'SELECTED FOR THE PRODUCT':'ARCHIVED EXPLORATION'}</span></article>`).join('')}</div><p style="font-size:12px;margin-top:24px">The selected direction restores the original salon cues while keeping the product wordmark clear and compact.</p>`, 'docs/branding/design-comparison.png', 810);
}
