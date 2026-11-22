(function () {
  var form = document.querySelector('form.form__control');
  if (!form) return;
  var endpoint = form.getAttribute('action') || '';
  var fallback = form.getAttribute('data-fallback-mail') || 'contact@ayusry.com';
  var placeholder = endpoint.indexOf('YOUR_FORM_ID') !== -1;
  var status = document.createElement('p');
  status.className = 'form__status';
  form.appendChild(status);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get('name') || '').toString().trim();
    var email = (d.get('email') || '').toString().trim();
    var message = (d.get('message') || '').toString().trim();
    if (!name || !email || !message) {
      status.textContent = 'Please fill in your name, email and message.';
      return;
    }
    if (placeholder) {
      status.textContent = 'Opening your email app. If nothing happens, write to ' + fallback;
      window.location.href = 'mailto:' + fallback +
        '?subject=' + encodeURIComponent('Portfolio inquiry from ' + name) +
        '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      return;
    }
    status.textContent = 'Sending...';
    fetch(endpoint, { method: 'POST', body: d, headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('bad'); form.reset(); status.textContent = 'Thanks, your message is on its way.'; })
      .catch(function () { status.textContent = 'Something went wrong. Email me at ' + fallback; });
  });
})();
