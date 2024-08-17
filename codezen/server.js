const express = require('express');
const cors = require('cors'); // Asegúrate de que cors está importado y configurado
const notifier = require('node-notifier');

const app = express();
app.use(cors()); // Permitir solicitudes de cualquier origen
app.use(express.json());

app.post('/notify', (req, res) => {
  const { title, message } = req.body;

  notifier.notify({
    title: title,
    message: message,
    wait: true
  });

  res.status(200).json({ success: true, message: 'Notificación enviada' });
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en el puerto 3000');
});
