const express = require('express');
const cors = require('cors');
const notifier = require('node-notifier');
const path = require('path'); // Asegúrate de que path está importado

const app = express();

// Middleware para manejar CORS y JSON
app.use(cors());
app.use(express.json());

// Ruta para enviar notificaciones
app.post('/notify', (req, res) => {
  const { title, message } = req.body;

  notifier.notify({
    title: title,
    message: message,
    wait: true
  });

  res.status(200).json({ success: true, message: 'Notificación enviada' });
});

// Servir los archivos estáticos desde el directorio "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Cualquier ruta que no coincida con las anteriores servirá el archivo "index.html"
// Esto es importante para aplicaciones de página única (SPA) como Vue.js
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
