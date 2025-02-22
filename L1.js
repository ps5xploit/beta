function manejarKeyPressShift(event) {
    if (event.keyCode === 16) {
        console.log("Tecla Shift funcionando"); // Mensaje de depuración
        window.location.href = "https://www.google.com";
    }
}
document.addEventListener("keydown", manejarKeyPressShift);