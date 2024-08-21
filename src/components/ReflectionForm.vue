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
        <v-col
          cols="4"
          class="sentiment-icon"
          :class="{ selected: selectedSentiment === 'Happy' }"
          @click="selectSentiment('Happy')"
        >
          😊
        </v-col>
        <v-col
          cols="4"
          class="sentiment-icon"
          :class="{ selected: selectedSentiment === 'Neutral' }"
          @click="selectSentiment('Neutral')"
        >
          😐
        </v-col>
        <v-col
          cols="4"
          class="sentiment-icon"
          :class="{ selected: selectedSentiment === 'Sad' }"
          @click="selectSentiment('Sad')"
        >
          😔
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
    calculateTotalHoursWorked() {
      const lapses = JSON.parse(localStorage.getItem('workLapses')) || [];
      let totalHours = 0;

      lapses.forEach((lapso) => {
        const startHour = parseInt(lapso.startTime.split(':')[0]);
        const endHour = parseInt(lapso.endTime.split(':')[0]);
        totalHours += endHour - startHour;
      });

      return totalHours;
    },
    saveReflection() {
      // Validación básica
      if (!this.reflection || !this.selectedSentiment) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Calcular las horas trabajadas basadas en los lapsos
      const totalHoursWorked = this.calculateTotalHoursWorked();

      // Guardar la reflexión en el localStorage o en el store
      const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
      reflections.push({
        date: new Date().toLocaleString(),
        text: this.reflection,
        hoursWorked: totalHoursWorked, // Añadir las horas trabajadas calculadas
        sentiment: this.selectedSentiment,
      });
      localStorage.setItem('reflections', JSON.stringify(reflections));  
      this.$router.push({ name: 'MyReflections' });
    },
  },
};
</script>

<style scoped>
.reflection-form-card {
  border-radius: 15px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  width: 44vh;
  max-width: 80vh;
  margin: 0 auto;
}

.sentiment-selection {
  text-align: center;
}

.sentiment-icon {
  font-size: 30px;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.sentiment-icon:hover {
  transform: scale(1.2);
  border-radius: 10px;
}

.sentiment-icon.selected {
  border-radius: 10px;
  transform: scale(1.5);
}
</style>
