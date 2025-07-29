// js/index.js
document.addEventListener('DOMContentLoaded', () => {

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.hero-slider img');
  let current = 0;
  setInterval(() => {
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  }, 3500);
});


  // === 1) Toggle nav móvil ===
  const navToggle = document.querySelector('.nav-toggle');
  const nav       = document.querySelector('.main-nav');
  const ctas      = document.querySelector('.header-ctas');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    ctas.classList.toggle('active');
    navToggle.classList.toggle('open');
  });

  // === 2) Formulario de contacto ===
  const form   = document.getElementById('contactForm');
  if (form) {
    const fields = ['name','email','phone','message'];
    function showError(id, msg) {
      document.getElementById(`error-${id}`).textContent = msg;
    }
    function clearErrors() {
      fields.forEach(f => showError(f, ''));
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();
      let valid = true;
      const data = {
        name:    form['name'].value.trim(),
        email:   form['email'].value.trim(),
        phone:   form['phone'].value.trim(),
        message: form['message'].value.trim()
      };
      if (!data.name)    { showError('name', 'Por favor ingresa tu nombre');    valid = false; }
      if (!data.email)   { showError('email','Por favor ingresa tu email');     valid = false; }
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
        showError('email','Email inválido'); valid = false;
      }
      if (!data.message) { showError('message','Por favor ingresa un mensaje'); valid = false; }
      if (!valid) return;

      fetch('/api/contacto', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      })
      .then(res => {
        if (res.ok) {
          alert('¡Gracias! Pronto nos contactamos.');
          form.reset();
        } else throw new Error('Error servidor');
      })
      .catch(() => alert('Hubo un problema, por favor intentá nuevamente.'));
    });
  }

  // === 3) Modal de selección de viandas ===
  const modal      = document.getElementById('viandas-seleccion');
  const grid       = document.getElementById('viandas-container');
  const btnConfirm = document.getElementById('btn-confirmar-menu');
  // Selector de botones “Elige Tus Viandas”
  const btnPlanes  = document.querySelectorAll('button[data-action="select-viandas"]');
  const sheetUrl   = 'https://docs.google.com/spreadsheets/d/1nXhQZoX0UpdepfnHybTd8onCbHPXwtcgdycCx9Z2nWU/gviz/tq?tqx=out:json';
  let diasPlan, viandas = [], seleccionadas = [];

  // Función cerrar modal
  function closeModal() {
    modal.classList.remove('open');
    modal.hidden = true;
    grid.innerHTML = '';
    btnConfirm.disabled = true;
    seleccionadas = [];
  }
  // Cerrar al click fuera o en botón “×”
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.id === 'btn-cerrar-modal') closeModal();
  });

  btnPlanes.forEach(btn => {
    btn.addEventListener('click', async () => {
      diasPlan = parseInt(btn.closest('.plan-card').dataset.plan);
      // mostrar modal
      modal.hidden = false;
      modal.classList.add('open');
      grid.innerHTML = '<p>Cargando viandas…</p>';
      // fetch con fallback
      try {
        const res  = await fetch(sheetUrl);
        const text = await res.text();
        const json = JSON.parse(text.match(/setResponse\((.*)\);/)[1]);
        const rows = json.table.rows.map(r => r.c.map(c => c && c.v));
        viandas = rows.map(([id,nombre,desc,img,whText]) => ({ id, nombre, desc, img, whText }));
      } catch {
        // datos de prueba
        viandas = [
          {id:'1', nombre:'Tarta de acelga', desc:'Tarta integral de acelga', img:'assets/imagenes/tarta-ejemplo.jpg', whText:'Tarta%20de%20acelga'},
          {id:'2', nombre:'Filet de merluza',desc:'Merluza apanada', img:'assets/imagenes/merluza-ejemplo.jpg', whText:'Filet%20de%20merluza'},
          {id:'3', nombre:'Ensalada variada',desc:'Mix de hojas y vegetales', img:'assets/imagenes/ensalada-ejemplo.jpg', whText:'Ensalada%20variada'},
          {id:'4', nombre:'Puré de batata',  desc:'Puré cremoso de batata',    img:'assets/imagenes/pure-ejemplo.jpg',    whText:'Puré%20de%20batata'},
        ];
      }
      // render viandas
      grid.innerHTML = '';
      viandas.forEach(v => {
        const card = document.createElement('div');
        card.className = 'plan-card';
        card.innerHTML = `
          <button id="btn-cerrar-modal" aria-label="Cerrar">×</button>
          <img src="${v.img}" alt="${v.nombre}">
          <h3>${v.nombre}</h3>
          <p>${v.desc}</p>
          <label>
            <input type="checkbox" value="${v.id}">
            Seleccionar
          </label>
        `;
        grid.append(card);
      });
      // gestión selección
      grid.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', () => {
          const marcados = Array.from(grid.querySelectorAll('input:checked'));
          if (marcados.length > diasPlan) {
            chk.checked = false;
            return alert(`Solo podés elegir ${diasPlan} viandas.`);
          }
          seleccionadas = marcados.map(i => viandas.find(v => v.id == i.value));
          btnConfirm.disabled = (seleccionadas.length !== diasPlan);
        });
      });
    });
  });

  // confirmar → WhatsApp
  btnConfirm.addEventListener('click', () => {
    const lineas = seleccionadas.map(v => decodeURIComponent(v.whText));
    const texto  = encodeURIComponent(
      `Hola, quiero el plan de ${diasPlan} días con estas viandas:\n- ${lineas.join('\n- ')}`
    );
    window.open(`https://wa.me/5491124047100?text=${texto}`, '_blank');
    closeModal();
  });
});

