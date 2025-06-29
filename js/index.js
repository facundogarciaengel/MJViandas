// Toggle nav and CTAs on mobile
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const ctas = document.querySelector('.header-ctas');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    ctas.classList.toggle('active');
    navToggle.classList.toggle('open');
  });
});

// Archivo: js/hero.js //
// (Opcional) Animaciones o comportamiento adicional para Hero
// Este archivo puede quedar vacío o incluir librerías de animación si es necesario

// Archivo: js/planes.js //
// Manejo de carrito
document.addEventListener('DOMContentLoaded', () => {
  const cartCountEl = document.querySelector('.cart-count');
  const btns = document.querySelectorAll('.btn-plan');
  // Inicializar contador
  let count = parseInt(localStorage.getItem('cartCount')) || 0;
  cartCountEl.textContent = count;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.plan-card');
      const planName = card.dataset.plan;
      count++;
      localStorage.setItem('cartCount', count);
      cartCountEl.textContent = count;
      // Opcional: guardar detalle de planes
      let items = JSON.parse(localStorage.getItem('cartItems')) || [];
      items.push(planName);
      localStorage.setItem('cartItems', JSON.stringify(items));
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const fields = ['name', 'email', 'phone', 'message'];

  function showError(id, msg) {
    document.getElementById(id).textContent = msg;
  }
  function clearErrors() {
    fields.forEach(f => showError(`error-${f}`, ''));
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    let valid = true;
    const name = form['name'].value.trim();
    const email = form['email'].value.trim();
    const message = form['message'].value.trim();
    if (!name) { showError('error-name', 'Por favor ingresa tu nombre'); valid = false; }
    if (!email) { showError('error-email', 'Por favor ingresa tu email'); valid = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showError('error-email', 'Email inválido'); valid = false; }
    if (!message) { showError('error-message', 'Por favor ingresa un mensaje'); valid = false; }
    if (!valid) return;

    // Envío (opción A: backend propio)
    fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone: form['phone'].value.trim(), message })
    })
      .then(res => {
        if (res.ok) {
          alert('¡Gracias! Pronto nos contactamos.');
          form.reset();
        } else throw new Error('Error en el servidor');
      })
      .catch(() => alert('Hubo un problema, por favor intentá nuevamente.'));
  });
});
