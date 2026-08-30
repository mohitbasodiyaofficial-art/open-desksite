/* Field Notes static behavior: clear feedback, no hidden delays, and form confirmation that reads like a filed receipt. */
(function () {
  var forms = document.querySelectorAll('.note-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var status = form.querySelector('.form-status');
      var original = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = '';
      try {
        var response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Submission failed');
        form.reset();
        status.textContent = 'Note received. We’ll follow up by email when a reply is needed.';
        status.className = 'form-status success';
      } catch (error) {
        status.textContent = 'The note did not send. Please try again or email desk@opendesk.help.';
        status.className = 'form-status error';
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  });
})();
