document.querySelectorAll('.copy-source').forEach(button => {
 button.addEventListener('click', async () => {
  const url = button.dataset.url;
  const status = document.getElementById('link-status');
  try {
   if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(url);
   status.textContent = 'Link copied. Paste it into Safari or Chrome.';
   button.textContent = 'Copied';
   setTimeout(() => { button.textContent = 'Copy link'; }, 2000);
  } catch {
   let field = button.parentElement.querySelector('input');
   if (!field) {
    field = document.createElement('input');
    field.type = 'text'; field.readOnly = true; field.value = url;
    field.className = 'source-url'; field.setAttribute('aria-label', 'Source address to copy');
    button.parentElement.append(field);
   }
   field.focus(); field.select(); field.setSelectionRange(0, url.length);
   status.textContent = 'Press and hold the selected address to copy it, then open it in Safari or Chrome.';
  }
 });
});
