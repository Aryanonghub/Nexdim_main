// Counts each .nx-count tile up to its data-target over 1s, eased, starting once
// the tile scrolls into view. data-from sets the starting value (default 0), so a
// tile can ramp across a range rather than always climbing from zero, and
// data-duration overrides the 1s default for a slower or quicker ramp.
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const from = parseFloat(el.dataset.from ?? 0);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isTime = el.dataset.format === 'time';

  const render = (value) => {
    el.textContent = isTime
      ? `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`
      : prefix + Math.round(value).toLocaleString('en-US') + suffix;
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render(target);
    return;
  }

  const duration = parseFloat(el.dataset.duration ?? 1000);
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    render(from + (target - from) * eased);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function initCountUp() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.nx-count').forEach((el) => io.observe(el));
}
