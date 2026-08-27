const BASE_URL = import.meta.env.VITE_LEADS_API_BASE_URL;
const TOKEN = import.meta.env.VITE_LEADS_API_TOKEN;
const CAMPAIGN_ID = import.meta.env.VITE_LEADS_CAMPAIGN_ID;

export async function submitLead({ phoneNumber, customerName = 'Website visitor' }) {
  const res = await fetch(`${BASE_URL}/api/webhooks/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      campaign_id: CAMPAIGN_ID,
      leads: [{ phone_number: phoneNumber, customer_name: customerName }],
    }),
  });
  if (!res.ok) throw new Error(`leads request failed: ${res.status}`);
}
