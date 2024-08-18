<template>
    <div class="notification-overlay">
      <div class="notification-modal">
        <div class="modal-content">
          <h2>{{ title }}</h2>
          <p>{{ message }}</p>
          <v-btn @click="acceptNotification" color="primary">Aceptar</v-btn>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      message: String
    },
    methods: {
      acceptNotification() {
        this.$emit('accept'); // Emitir el evento para cerrar el modal y ejecutar la acción
      }
    }
  };
  </script>
  
  <style scoped>
  .notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); /* Hacer el fondo opaco */
    z-index: 9999; /* Asegurarse de que esté por encima de todo */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .notification-modal {
    background-color: #6a00ff;
    color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  .modal-content h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }
  
  .modal-content p {
    margin-bottom: 20px;
  }
  </style>
  