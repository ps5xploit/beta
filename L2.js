// Función para manejar el evento de pulsación de tecla
    function manejarKeyPress(event) {
        // Verifica si la tecla presionada es la tecla Shift (código 16)
        if (event.keyCode === 16) {
            // Redirige directamente a google.com
            window.location.href = "https://www.google.com";
        }
    }

    // Registra un escuchador de eventos para keydown
    document.addEventListener("keydown", manejarKeyPress);