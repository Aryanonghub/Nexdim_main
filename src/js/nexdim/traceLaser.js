// Draws the deterministic sine-wave trace above the footer, then sweeps a
// glowing segment along it continuously via stroke-dashoffset.
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

  const laserLen = laser.getTotalLength();
  const laserDash = laserLen * 0.12;
  laser.style.strokeDasharray = `${laserDash} ${laserLen}`;

  let offset = 0;
  function tick() {
    offset = (offset - 2.5 + laserLen) % laserLen;
    laser.style.strokeDashoffset = offset;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
