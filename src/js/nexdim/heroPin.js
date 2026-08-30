// Pins the hero for the height of #hero-pin while the mountain scales down
// and the NEXDIM AI wordmark rises up from behind it, then holds once revealed.
export function initHeroPin() {
  const heroPin = document.getElementById('hero-pin');
  const heroText = document.getElementById('hero-text');
  const heroSub = document.getElementById('hero-sub');
  const heroMountain = document.getElementById('hero-mountain');
  if (!heroPin) return;

  // Geometry is cached and the handler is throttled to one write per frame.
  // Measuring inside the scroll listener forces a synchronous layout on every
  // event — and trackpads emit those faster than frames — which is what made
  // the pinned hero, and the header riding on top of it, judder.
  let pinTop = 0;
  let total = 1;
  let queued = false;
  let last = -1;

  function measure() {
    pinTop = heroPin.getBoundingClientRect().top + window.scrollY;
    total = Math.max(heroPin.offsetHeight - window.innerHeight, 1);
  }

  function apply() {
    queued = false;
    const raw = Math.min(Math.max((window.scrollY - pinTop) / total, 0), 1);
    const progress = Math.min(raw / 0.4, 1); // reveal finishes by 40% of pin scroll, then holds
    if (Math.abs(progress - last) < 0.0015) return;
    last = progress;

    // Three phases, strictly in order — wordmark rises, then the eyebrow, then
    // the bottom copy. Overlapping any two of them ran the rising wordmark
    // straight through text below it.
    // Sequential, not simultaneous: the wordmark finishes rising by 65% of the
    // reveal, and only then does the sub copy fade in. Overlapping the two ran
    // the rising wordmark straight through the text on narrow screens, where the
    // sub block is tall enough to reach up into the wordmark's path.
    const wm = Math.min(progress / 0.65, 1);
    heroText.style.transform = `translateY(${(1 - wm) * 60}vh)`;
    heroText.style.opacity = Math.min(wm * 2.2, 1);
    heroMountain.style.transform = `scale(${1.15 - wm * 0.15})`;

    const subP = Math.max((progress - 0.72) / 0.28, 0);
    heroSub.style.opacity = subP;
    heroSub.style.transform = `translateY(${(1 - subP) * 20}px)`;
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); schedule(); });
  measure();
  apply();
}
