// Draws the deterministic sine-wave trace above the footer, then sweeps a
// glowing segment along it. The sweep itself is a CSS animation (see nexdim.css)
// so it is time-based rather than a fixed step per frame — the old loop moved a
// constant 2.5 units per callback, which ran at double speed on a 120Hz display
// and visibly stalled whenever a frame was dropped during page load.
export function initTraceLaser() {
  const tracePath = document.getElementById('trace-path');
  const laser = document.getElementById('trace-laser');
  if (!tracePath || !laser) return;

  const trace = Array.from({ length: 96 }, (_, i) => {
    const a = Math.sin(i * 0.31) * 26;
    const b = Math.sin(i * 0.11 + 1.2) * 16;
    const c = Math.sin(i * 0.72 + 0.4) * 7;
    return 110 + a + b + c;
  });
  const d = trace.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * 520 / 95).toFixed(1)} ${y.toFixed(1)}`).join(' ');

  tracePath.setAttribute('d', d);
  laser.setAttribute('d', d);

  const len = laser.getTotalLength();
  const dash = len * 0.12;
  // The dash pattern repeats every dash+gap, NOT every path length. Sweeping only
  // `len` leaves the pattern a dash-length out of phase at the loop point, so the
  // glow snapped backwards by 12% of the path once per cycle — always at the same
  // spot. Travelling one whole period lands it back exactly where it started.
  const period = dash + len;
  laser.style.setProperty('--trace-dash', dash.toFixed(2));
  laser.style.setProperty('--trace-gap', len.toFixed(2));
  laser.style.setProperty('--trace-period', period.toFixed(2));
  laser.style.setProperty('--trace-dur', `${(period / 150).toFixed(2)}s`); // 150 units/s == the old 2.5/frame at 60Hz

  // Hold the sweep until the trace is actually on screen. Nothing repaints while
  // it is scrolled away, and the first frames land after load has settled instead
  // of competing with it.
  const section = laser.closest('section') || laser;
  new IntersectionObserver(([entry]) => {
    laser.classList.toggle('is-running', entry.isIntersecting);
  }, { rootMargin: '120px' }).observe(section);
}
