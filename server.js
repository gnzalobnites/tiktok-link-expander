// server.js
const express = require('express');
const { fetch } = require('undici');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware CORS (permite peticiones desde tu frontend)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Ruta principal (para verificar que el servidor funciona)
app.get('/', (req, res) => {
  res.json({ message: '✅ TikTok Link Expander API funcionando' });
});

// Ruta para expandir enlaces cortos
app.get('/expand', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Falta el parámetro "url"' });
  }

  if (!url.includes('vm.tiktok.com')) {
    return res.status(400).json({ error: 'La URL debe ser un enlace corto de TikTok (vm.tiktok.com)' });
  }

  try {
    // Hacemos una solicitud HEAD para seguir redirecciones
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      timeout: 5000
    });

    const finalUrl = response.url;

    // Limpiar la URL: solo dominio + ruta (sin parámetros como ?t=...)
    const cleanUrl = new URL(finalUrl);
    const cleaned = `${cleanUrl.origin}${cleanUrl.pathname}`;

    res.json({
      original: url,
      expanded: cleaned
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'No se pudo expandir el enlace. Asegúrate de que es válido.' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
