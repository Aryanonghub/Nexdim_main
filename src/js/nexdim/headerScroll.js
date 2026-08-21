// Fades the fixed header's backdrop in as the hero scrolls away. Writes scroll
// progress to --hdr (0-1); nexdim.css does the drawing. Only opacity is driven
// per frame, so the fade stays on the compositor.
export function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  let last = -1;
  let compact = false;

  function apply() {
    queued = false;
    if (reduced.matches) return; // stylesheet pins the header solid instead
    const span = window.innerHeight * 0.75; // fully solid by three quarters of a screen
    const y = window.scrollY;
    const raw = Math.min(Math.max(y / span, 0), 1);
    const p = raw * raw * (3 - 2 * raw); // smoothstep, so the fade eases in and out

    if (Math.abs(p - last) >= 0.002) {
      last = p;
      header.style.setProperty('--hdr', p.toFixed(3));
    }

    // Separate thresholds so the height tween cannot flap when scrolling
    // hovers around the boundary.
    const next = compact ? y > window.innerHeight * 0.45 : y > window.innerHeight * 0.55;
    if (next !== compact) {
      compact = next;
      header.classList.toggle('is-compact', compact);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  apply();
}
