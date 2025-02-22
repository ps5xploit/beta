function manejarKeyPressV(event) {
    if (event.keyCode === 118) {
        console.log("Tecla V funcionando"); // Mensaje de depuración
        window.location.href = "https://www.google.com";
    }
}
document.addEventListener("keydown", manejarKeyPressV);