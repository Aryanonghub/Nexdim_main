export function initWaveform() {
  const el = document.getElementById('waveform');
  if (!el) return;

  el.innerHTML = Array.from({ length: 48 }, (_, i) => {
    const height = 8 + ((i * 37) % 26);
    const delay = (i % 12) * 0.08;
    return `<span class="nx-bar block w-full bg-[#e2472b]" style="height:${height}px;animation-delay:${delay}s"></span>`;
  }).join('');
}
