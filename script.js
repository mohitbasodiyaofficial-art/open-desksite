document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='☰';
    }));
  }

  document.querySelectorAll('.note-form').forEach(form => {
    const email = form.querySelector('input[name="email"]');
    const reply = form.querySelector('input[name="_replyto"]');
    if (email && reply) email.addEventListener('input', () => reply.value = email.value);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('.submit-button');
      const status = form.querySelector('.form-status');
      const endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.includes('REPLACE_WITH')) {
        status.textContent = 'Form endpoint is not configured yet.';
        status.className = 'form-status error';
        return;
      }
      button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
      try {
        const response = await fetch(endpoint, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} });
        if (!response.ok) throw new Error('send failed');
        form.reset();
        status.textContent = 'Thanks — your note was received. We’ll follow up by email when a reply is needed.';
        status.className = 'form-status success';
      } catch (error) {
        status.innerHTML = 'The note did not send. Please try again or <a href="mailto:desk@opendesk.help">email us directly</a>.';
        status.className = 'form-status error';
      } finally { button.disabled = false; button.textContent = '➤ Send this note'; }
    });
  });
});
