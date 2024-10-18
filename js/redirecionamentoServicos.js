
function redirecionaPage(evento) {
    const target = evento.currentTarget;
    const url = target.getAttribute('data-url');

    if (url) {
        window.location.href = url;
    }
}

const elementoServicos = document.querySelectorAll('.elemento-servicos');

elementoServicos.forEach(element => {
    element.addEventListener('click', redirecionaPage);
})