function mostrarModulo(id) {
    const modulos = document.querySelectorAll('.modulo');

    modulos.forEach(mod => {
        mod.classList.remove('activo');
    });

    document.getElementById(id).classList.add('activo');
}