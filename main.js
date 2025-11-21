import { BitiaConnector } from './bitia_connector.js';

// Instancia global del conector serial
const arduino = new BitiaConnector(); 

const statusDisplay = document.getElementById('status');
const contentFrame = document.getElementById('contentFrame'); 

// EXPOSICIÓN GLOBAL CRUCIAL: 
// Esto permite que el código DENTRO del IFRAME acceda al conector serial.
window.app = arduino;

// Función global para que los iframes naveguen
window.changePage = (url) => {
    // Si la URL es la misma, no recargar (útil para la navegación interna de la barra lateral)
    if (contentFrame.src.endsWith(url)) {
        console.log(`Página ${url} ya cargada.`);
        return;
    }
    contentFrame.src = url;
};

// --- 1. CONECTAR ---
document.getElementById('btnConnect').addEventListener('click', () => {
    arduino.conectar();
});

// --- 2. FEEDBACK VISUAL DE ESTADO ---
arduino.onStatus = (msg) => {
    statusDisplay.innerText = msg;
    statusDisplay.style.color = "#0f0";
};

arduino.onError = (err) => {
    statusDisplay.innerText = "Error de conexión. Intente reconectar.";
    statusDisplay.style.color = "red";
    console.error("Error de conexión serial:", err);
};

// --- 3. SCROLL APLICADO AL IFRAME ---
arduino.onScroll = (direccion) => {
    const velocidad = 150; 
    
    // Obtener la ventana del IFRAME
    const frameWindow = contentFrame.contentWindow;

    if (frameWindow) {
        // Enviar el comando 'scroll' al script DENTRO del iframe
        frameWindow.postMessage({ command: 'scroll', direction: direccion }, '*');
        
        // **OPCIONAL:** Si el script interno no responde, puedes aplicar scroll directamente aquí
        /*
        if (direccion === "CW") {
            frameWindow.scrollBy({ top: velocidad, behavior: 'smooth' });
        } else {
            frameWindow.scrollBy({ top: -velocidad, behavior: 'smooth' });
        }
        */
    }
};

// Configura el Nucleo inicial si es necesario
// arduino.setNucleo(1); // Notifica al Arduino que estamos en el Núcleo 1