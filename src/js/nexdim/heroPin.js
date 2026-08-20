// Pins the hero for the height of #hero-pin while the mountain scales down
// and the NEXDIM AI wordmark rises up from behind it, then holds once revealed.
export function initHeroPin() {
  const heroPin = document.getElementById('hero-pin');
  const heroText = document.getElementById('hero-text');
  const heroSub = document.getElementById('hero-sub');
  const heroMountain = document.getElementById('hero-mountain');
  if (!heroPin) return;

  function update() {
    const total = heroPin.offsetHeight - window.innerHeight;
    const raw = Math.min(Math.max(-heroPin.getBoundingClientRect().top / total, 0), 1);
    const progress = Math.min(raw / 0.4, 1); // reveal finishes by 40% of pin scroll, then holds

    heroText.style.transform = `translateY(${(1 - progress) * 60}vh)`;
    heroText.style.opacity = Math.min(progress * 2.2, 1);
    heroMountain.style.transform = `scale(${1.15 - progress * 0.15})`;

    const subP = Math.max((progress - 0.55) / 0.45, 0);
    heroSub.style.opacity = subP;
    heroSub.style.transform = `translateY(${(1 - subP) * 20}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
