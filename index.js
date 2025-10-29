document.addEventListener('DOMContentLoaded', ()=>{
const numeroWp = '5491169017827' //'5491124047100';
const urlBaseWp = `https://api.whatsapp.com/send?phone=${numeroWp}`;
const msjGenerico = 'Hola, ¡me gustaría consultar sobre sus planes y menús!';

const seccionDePlanes = document.querySelector('.articles-planes');
const btnWp = document.querySelector('.anchor-whatsapp');
const todosLosPlanes = document.querySelectorAll('.articles-planes article');
const mensajeCodificado = encodeURIComponent(msjGenerico);
btnWp.href = `${urlBaseWp}&text=${mensajeCodificado}`;

seccionDePlanes.addEventListener('click', (e)=>{

    const artClickeado = e.target.closest('article');
    
    if(!artClickeado){
        console.log('no hubo art clickeado');
        return;
    }

    todosLosPlanes.forEach(plan =>{
        plan.classList.remove('plan-seleccionado');
    }); 

    artClickeado.classList.add('plan-seleccionado');

    const tipoPlan = artClickeado.dataset.plan;
    console.log(tipoPlan);
    const msj = `Hola, ¡estoy interesado/a en: ${tipoPlan}! Me gustaría consultar el menú.`;
    const mensajeCodificado = encodeURIComponent(msj);
    btnWp.href = `${urlBaseWp}&text=${mensajeCodificado}`;
    btnWp.classList.add('wp-seleccionado');

});

});