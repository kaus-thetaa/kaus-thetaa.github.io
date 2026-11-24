const ROOT = new URL('../', import.meta.url);
export async function getJSON(path, fallback = null) {
  try { const response = await fetch(new URL(path, ROOT), {signal: AbortSignal.timeout(5000)}); if (!response.ok) throw new Error('Data unavailable'); return await response.json(); } catch { return fallback; }
}
export function parseCSV(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\n' && !quoted) { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  const headers = (rows.shift() || []).map(s => s.trim().toLowerCase());
  return rows.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h,i) => [h, r[i] || ''])));
}
export function safeURL(value) { try { const u = new URL(value); return ['https:', 'mailto:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } }
export async function getNow(csvURL) {
  if (csvURL && safeURL(csvURL)) {
    try { const response = await fetch(csvURL, {signal: AbortSignal.timeout(3500)}); if (!response.ok) throw new Error('Sheet unavailable'); const items = parseCSV(await response.text()).filter(i => i.title && i.status && !JSON.stringify(i).includes('[verify]')); if (items.length) return {items, source:'sheet'}; } catch { /* The local list remains available when the Sheet cannot be reached. */ }
  }
  return getJSON('data/now.json', {items:[]});
}
export async function sendMessage(endpoint, data) {
  const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(data), signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('Message could not be sent. Please try email instead.');
  const result = await response.json(); if (!result.ok) throw new Error(result.error || 'Message could not be sent. Please try email instead.'); return result;
}

export async function loadMotionLibraries() {
  for (const file of ['gsap.min.js','ScrollTrigger.min.js','lenis.min.js']) {
    await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('assets/vendor/'+file,ROOT);script.onload=resolve;script.onerror=reject;document.head.append(script);});
  }
}
