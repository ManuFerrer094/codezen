<template>
  <div class="fullscreen-container">
    <BreathingBall @exerciseCompleted="handleExerciseCompletion" />
  </div>
</template>

<script>
import BreathingBall from '@/components/breathingball/BreathingBall.vue';

export default {
  components: {
    BreathingBall
  },
  methods: {
    handleExerciseCompletion() {
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
  background-color: #2c003e;
}
</style>
