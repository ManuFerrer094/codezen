<template>
  <div class="fullscreen-container">
    <BreathingBall @exerciseCompleted="handleExerciseCompletion" />
  </div>
</template>

<script>
import BreathingBall from '@/components/BreathingBall.vue';

export default {
  components: {
    BreathingBall
  },
  methods: {
    handleExerciseCompletion() {
      // Aquí podrías manejar cualquier acción adicional cuando se complete el ejercicio.
      console.log('Ejercicio completado');
    }
  }
};
</script>

<style scoped>
.fullscreen-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c003e; /* Color de fondo oscuro */
}
</style>
