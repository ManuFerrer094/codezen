<template>
    <div>
      <v-card-title class="headline">Guía de Respiración</v-card-title>
      <v-card-text>
        <p>Este ejercicio de respiración te ayudará a relajarte. Sigue las indicaciones en pantalla:</p>
        <ul>
          <li>Inhala cuando la esfera se expanda.</li>
          <li>Aguanta el aire cuando la esfera esté completamente expandida.</li>
          <li>Exhala cuando la esfera se contraiga.</li>
          <li>Repite este ciclo hasta que finalice el ejercicio.</li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="$emit('nextStep')">Siguiente</v-btn>
      </v-card-actions>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StartGuide',
  };
  </script>
  
  <style scoped>
   .headline {
      font-size: 24px;
      margin-bottom: 16px;
    }

    p {
      margin-bottom: 16px;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
      margin-bottom: 16px;
    }

    ul li {
      margin-bottom: 8px;
    }
  </style>