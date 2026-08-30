// Live test calls are not switched on yet, so the button acknowledges the click
// with a coming-soon note rather than posting to the leads API. Restore the
// submitLead() call in ../shared/leadsApi.js once the endpoint is live.
export function initTestCall() {
  const btn = document.getElementById('test-call-btn');
  const status = document.getElementById('test-call-status');
  if (!btn || !status) return;

  btn.addEventListener('click', () => {
    status.textContent = 'Coming soon.';
  });
}
