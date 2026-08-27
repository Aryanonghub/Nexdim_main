export function initTestCall() {
  const btn = document.getElementById('test-call-btn');
  const status = document.getElementById('test-call-status');
  const numInput = document.getElementById('test-call-num');
  if (!btn) return;

  const baseUrl = import.meta.env.VITE_LEADS_API_BASE_URL;
  const token = import.meta.env.VITE_LEADS_API_TOKEN;
  const campaignId = import.meta.env.VITE_LEADS_CAMPAIGN_ID;

  btn.addEventListener('click', async () => {
    const num = numInput.value.trim();
    if (!num) {
      status.textContent = 'Enter a number first.';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Dialing…';

    try {
      const res = await fetch(`${baseUrl}/api/webhooks/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          leads: [{ phone_number: num, customer_name: 'Website visitor' }],
        }),
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      status.textContent = "You'll receive a call shortly.";
    } catch {
      status.textContent = "Couldn't place the call — please try again.";
    } finally {
      btn.disabled = false;
    }
  });
}
