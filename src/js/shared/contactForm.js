// No backend on a static site, so hand the submission off to mailto.
export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, email } = e.target;
    const body = `Name: ${name.value}\nEmail: ${email.value}`;
    window.location.href = `mailto:hello@nexdim.ai?subject=${encodeURIComponent('Contact from nexdim.ai')}&body=${encodeURIComponent(body)}`;
  });
}
