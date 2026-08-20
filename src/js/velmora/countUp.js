// Counts each .nx-count tile up to its data-target over 1s, eased,
// starting once the tile scrolls into view.
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const isTime = el.dataset.format === 'time';
  const duration = 1000;
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = target * eased;
    el.textContent = isTime
      ? `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`
      : prefix + Math.round(value).toLocaleString('en-US');
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
