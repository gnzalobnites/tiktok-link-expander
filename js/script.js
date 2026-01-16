function limpiarEnlace() {
    const urlInput = document.getElementById('urlInput');
    const mensajeError = document.getElementById('mensajeError');
    const resultadoContainer = document.getElementById('resultadoContainer');
    const urlResultado = document.getElementById('urlResultado');
    
    // Ocultar contenedores previos
    resultadoContainer.style.display = 'none';
    mensajeError.style.display = 'none';
    
    let url = urlInput.value.trim();
    
    if (!url) {
        mostrarError('Por favor, ingresa un enlace de TikTok.');
        return;
    }
    
    try {
        // Caso 1: Enlace corto de TikTok (vm.tiktok.com)
        if (url.includes('vm.tiktok.com')) {
            //  Llamada a tu backend en Render
            // const backendUrl = 'https://tiktok-link-expander.onrender.com/expand?url=' + encodeURIComponent(url);
            const backendUrl = 'https://tiktok-link-expander-1ut6.onrender.com/expand?url=' + encodeURIComponent(url);
            
            
            fetch(backendUrl)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.error || 'Error del servidor');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.expanded) {
                        urlResultado.value = data.expanded;
                        resultadoContainer.style.display = 'block';
                    } else {
                        mostrarError(data.error || 'No se pudo limpiar el enlace.');
                    }
                })
                .catch(err => {
                    console.error(err);
                    mostrarError('Error al procesar el enlace corto. Asegúrate de que sea válido.');
                });
            return;
        }
        
        // Caso 2: Enlace largo de TikTok con parámetros de tracking
        if (url.includes('tiktok.com') && url.includes('/video/')) {
            const urlObj = new URL(url);
            const cleanUrl = urlObj.origin + urlObj.pathname;
            urlResultado.value = cleanUrl;
            resultadoContainer.style.display = 'block';
            return;
        }
        
        // Si no es un enlace de TikTok reconocido
        mostrarError('El enlace ingresado no parece ser un enlace válido de TikTok.');
        
    } catch (e) {
        mostrarError('URL inválida. Por favor, ingresa una URL correcta.');
    }
}

function mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;
    mensajeError.style.display = 'block';
}

function copiarEnlace() {
    const urlResultado = document.getElementById('urlResultado');
    urlResultado.select();
    document.execCommand('copy');
    
    // Mostrar feedback visual
    const botonCopiar = document.querySelector('.copiar-btn');
    const textoOriginal = botonCopiar.textContent;
    botonCopiar.textContent = '\u00A1Copiado!';  // \u00A1 es el código Unicode para "¡"
    setTimeout(() => {
        botonCopiar.textContent = textoOriginal;
    }, 2000);
}

function borrarResultado() {
    const resultadoContainer = document.getElementById('resultadoContainer');
    const urlInput = document.getElementById('urlInput');
    const urlResultado = document.getElementById('urlResultado');
    const mensajeError = document.getElementById('mensajeError');
    
    // Ocultar el resultado
    resultadoContainer.style.display = 'none';
    
    // Limpiar los campos de entrada
    urlInput.value = '';
    urlResultado.value = '';
    
    // Ocultar mensajes de error
    mensajeError.style.display = 'none';
    
    // Enfocar el campo de entrada
    urlInput.focus();
}

// Permitir pegar con Ctrl+V o Cmd+V
document.getElementById('urlInput').addEventListener('paste', function(e) {
    setTimeout(limpiarEnlace, 100);

});
