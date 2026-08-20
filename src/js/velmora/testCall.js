// Decorative simulated state: no backend on a static page to place a real call.
export function initTestCall() {
  const btn = document.getElementById('test-call-btn');
  const status = document.getElementById('test-call-status');
  const numInput = document.getElementById('test-call-num');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const num = numInput.value.trim();
    if (!num) {
      status.textContent = 'Enter a number first.';
      return;
    }
    status.textContent = 'Dialing…';
    setTimeout(() => {
      status.textContent = 'Connected — this is a preview, no real call was placed.';
    }, 1400);
  });
}
