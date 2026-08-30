function buildEmailText({ name, email, phone, message }) {
  return `New Contact Form Submission

Name: ${name}
Phone: ${phone || 'N/A'}
Email: ${email}

Message:
${message || 'N/A'}`;
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('button[type="submit"]');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') || submitBtn : null;
  const statusDiv = document.getElementById('contact-form-status');

  const showStatus = (message, type = 'success') => {
    if (!statusDiv) return;
    statusDiv.classList.remove('hidden', 'border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-400', 'border-rose-500/40', 'bg-rose-500/10', 'text-rose-400');
    
    if (type === 'success') {
      statusDiv.classList.add('border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-400');
    } else {
      statusDiv.classList.add('border-rose-500/40', 'bg-rose-500/10', 'text-rose-400');
    }
    statusDiv.textContent = message;
  };

  const clearStatus = () => {
    if (statusDiv) {
      statusDiv.classList.add('hidden');
      statusDiv.textContent = '';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const phone = (formData.get('phone') || '').trim();
    const message = (formData.get('message') || '').trim();

    if (!name || !email || !phone) {
      showStatus('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    const formElements = Array.from(form.elements);
    formElements.forEach((el) => { el.disabled = true; });
    const originalBtnText = btnText ? btnText.textContent : 'Send';
    if (btnText) btnText.textContent = 'Sending...';

    try {
      let success = false;
      let errorMsg = '';

      // Attempt endpoint POST
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, message }),
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok && data.success) {
          success = true;
        } else {
          errorMsg = data.error || `HTTP ${response.status}`;
        }
      } catch (apiErr) {
        errorMsg = apiErr.message;
      }


      if (success) {
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
      } else {
        showStatus(`Failed to send message: ${errorMsg}`, 'error');
      }
    } catch (err) {
      showStatus(`An error occurred: ${err.message || 'Please try again.'}`, 'error');
    } finally {
      formElements.forEach((el) => { el.disabled = false; });
      if (btnText) btnText.textContent = originalBtnText;
    }
  });
}
