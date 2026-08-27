import { submitLead } from '../shared/leadsApi.js';

export function initTestCall() {
  const btn = document.getElementById('test-call-btn');
  const status = document.getElementById('test-call-status');
  const numInput = document.getElementById('test-call-num');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const num = numInput.value.trim();
    if (!num) {
      status.textContent = 'Enter a number first.';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Dialing…';

    try {
      await submitLead({ phoneNumber: num });
      status.textContent = "You'll receive a call shortly.";
    } catch {
      status.textContent = "Couldn't place the call — please try again.";
    } finally {
      btn.disabled = false;
    }
  });
}
