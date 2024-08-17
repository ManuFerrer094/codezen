export function enviarNotificacion(title, message) {
    fetch('http://localhost:3000/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, message }),
    })
      .then(response => response.text()) // Cambiar a .text() en lugar de .json()
      .then(data => {
        console.log('Notificación enviada:', data); // Esto mostrará el mensaje "Notificación enviada"
      })
      .catch(error => {
        console.error('Error al enviar la notificación:', error);
      });
  }
  