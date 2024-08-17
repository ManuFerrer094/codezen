<template>
    <v-card class="reflection-form-card pa-4">
      <h2>Registrar Reflexión</h2>
  
      <!-- Textarea para la reflexión -->
      <v-textarea
        v-model="reflection"
        label="Escribe tus reflexiones aquí..."
        rows="5"
        outlined
        required
        class="mb-4"
      ></v-textarea>
  
      <!-- Selección de sentimiento -->
      <div class="sentiment-selection mb-4">
        <p>¿Cómo te sientes hoy?</p>
        <v-row>
          <v-col cols="4" class="sentiment-icon" @click="selectSentiment('happy')">
            😊 Feliz
          </v-col>
          <v-col cols="4" class="sentiment-icon" @click="selectSentiment('neutral')">
            😐 Neutral
          </v-col>
          <v-col cols="4" class="sentiment-icon" @click="selectSentiment('sad')">
            😔 Triste
          </v-col>
        </v-row>
      </div>
  
      <!-- Botón para guardar la reflexión -->
      <v-btn color="primary" @click="saveReflection">Guardar Reflexión</v-btn>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        reflection: '',
        selectedSentiment: '',
      };
    },
    methods: {
      selectSentiment(sentiment) {
        this.selectedSentiment = sentiment;
      },
      saveReflection() {
        // Validación básica
        if (!this.reflection || !this.selectedSentiment) {
          alert("Por favor, completa todos los campos.");
          return;
        }
  
        // Cargar las horas trabajadas automáticamente desde el localStorage
        const hoursWorked = localStorage.getItem('totalHoursWorked') || '0';
  
        // Guardar la reflexión en el localStorage o en el store
        const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
        reflections.push({
          date: new Date().toLocaleString(),
          text: this.reflection,
          hoursWorked: hoursWorked, // Añadir las horas trabajadas automáticamente
          sentiment: this.selectedSentiment,
        });
        localStorage.setItem('reflections', JSON.stringify(reflections));
  
        // Redirigir a la página de inicio después de guardar
        this.$router.push({ name: 'Home' });
      }
    }
  };
  </script>
  
  <style scoped>
  .reflection-form-card {
    background-color: #f7f7f7;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .sentiment-selection {
    text-align: center;
  }
  
  .sentiment-icon {
    font-size: 30px;
    cursor: pointer;
    padding: 10px;
    transition: background-color 0.3s ease;
  }
  
  .sentiment-icon:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  </style>
  