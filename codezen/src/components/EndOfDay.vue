<template>
    <v-container class="final-block" fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title class="text-h5">Ejercicio de Cierre - Sigue la Bolita</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <BreathingBall />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title class="text-h5">Reflexión del Día</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-textarea
                v-model="reflection"
                label="Anota tus reflexiones del día"
                outlined
                rows="5"
              ></v-textarea>
              <v-btn color="primary" @click="endDay" class="mt-4">Finalizar Día</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import BreathingBall from '@/components/BreathingBall.vue';
  
  export default {
    components: {
      BreathingBall
    },
    data() {
      return {
        reflection: ''
      };
    },
    methods: {
      endDay() {
        // Guardar la reflexión en localStorage o en el store
        const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
        reflections.push({ date: new Date().toLocaleString(), text: this.reflection });
        localStorage.setItem('reflections', JSON.stringify(reflections));
  
        // Redirigir a la página principal al finalizar
        this.$router.push({ name: 'Home' });
      }
    }
  };
  </script>
  