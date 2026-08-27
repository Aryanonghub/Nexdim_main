const STORAGE_KEY = 'nx-theme';

export function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const apply = (theme) => {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    btn.setAttribute('aria-label', `Switch to ${isDark() ? 'light' : 'dark'} theme`);
  };

  const isDark = () =>
    document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);

  apply(localStorage.getItem(STORAGE_KEY));

  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  });
}
