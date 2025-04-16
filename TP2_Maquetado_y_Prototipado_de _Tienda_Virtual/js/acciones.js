document.addEventListener("DOMContentLoaded", function () {
    const linkMostrar = document.getElementById("mostrar-registro");
    const botonRegistro = document.getElementById("boton-registro");

    linkMostrar.addEventListener("click", function (e) {
        e.preventDefault();
        botonRegistro.style.display = "block"; // mostrar el botón
        botonRegistro.classList.add("fade-in"); // aplicar animación
    });
});