<template>
  <div v-if="!exerciseStarted && !exerciseCompleted" class="start-container">
    <v-btn class="start-button" @click="startExercise">Empezar ejercicio</v-btn>
  </div>
  <div v-else-if="exerciseStarted || exerciseCompleted" class="exercise-container fullscreen-exercise" ref="exerciseContainer">
    <div
      v-if="!exerciseCompleted"
      class="breathing-sphere"
      :style="{
        width: sphereSize + 'px',
        height: sphereSize + 'px',
        transition: 'width ' + transitionDuration + 's, height ' + transitionDuration + 's',
      }"
    ></div>
    <div v-if="!exerciseCompleted" class="bottom-info">
      <p class="breathing-text">{{ breathingInstruction }}</p>
      <p class="timer">Tiempo restante: {{ formattedTime }}</p>
    </div>

    <!-- Reflexión y Sentimiento -->
    <div v-if="exerciseCompleted" class="reflection-container">
      <ReflectionForm @reflectionSaved="endDay" />
    </div>
  </div>
</template>

<script>
import ReflectionForm from '@/components/ReflectionForm.vue';

export default {
  components: {
    ReflectionForm
  },
  data() {
    return {
      exerciseStarted: false,
      exerciseCompleted: false,
      sphereSize: 100, // Tamaño inicial de la esfera (pequeña)
      phase: -1,
      phaseDurations: [3, 4, 6, 2], // Duraciones de cada fase en segundos
      exerciseDuration: 5, // Duración total del ejercicio en segundos (5 minutos)
      secondsLeft: 5,
      intervalId: null,
      transitionDuration: 0, // Duración de la transición en segundos
      breathingInstruction: '',
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
  },
  methods: {
    startExercise() {
      this.exerciseStarted = true;
      this.$nextTick(() => {
        const exerciseElement = this.$refs.exerciseContainer;
        if (exerciseElement && exerciseElement.requestFullscreen) {
          exerciseElement.requestFullscreen().catch((err) => {
            console.error("Error al intentar entrar en modo pantalla completa:", err);
          });
        } else {
          console.error("requestFullscreen no está disponible en el elemento.");
        }
      });

      this.phase = 0;
      this.startExerciseTimer();
      this.startPhase();
    },
    startExerciseTimer() {
      this.intervalId = setInterval(() => {
        this.secondsLeft--;
        if (this.secondsLeft <= 0) {
          this.endExercise();
        }
      }, 1000);
    },
    startPhase() {
      switch (this.phase) {
        case 0: // Inhalar
          this.sphereSize = 300; // La esfera crece
          this.transitionDuration = this.phaseDurations[this.phase];
          this.breathingInstruction = 'Inhala';
          break;
        case 1: // Retener
          this.sphereSize = 300; // La esfera se mantiene inflada
          this.transitionDuration = 0; // Sin transición
          this.breathingInstruction = 'Aguanta el aire';
          break;
        case 2: // Exhalar
          this.sphereSize = 100; // La esfera se desinfla
          this.transitionDuration = this.phaseDurations[this.phase];
          this.breathingInstruction = 'Exhala';
          break;
        case 3: // Esperar
          this.sphereSize = 100; // La esfera se mantiene desinflada
          this.transitionDuration = 0; // Sin transición
          this.breathingInstruction = 'Aguanta sin aire';
          break;
      }

      setTimeout(() => {
        this.phase = (this.phase + 1) % 4;
        this.startPhase();
      }, this.phaseDurations[this.phase] * 1000);
    },
    endExercise() {
      clearInterval(this.intervalId);
      this.exerciseCompleted = true;
      this.exerciseStarted = false;
    },
    exitFullScreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error("Error al salir de la pantalla completa:", err);
        });
      }
    },
    endDay() {
      // Salir de pantalla completa y redirigir a la página principal
      this.exitFullScreen();
      this.$router.push({ name: 'Home' }); // Redirigir a la página de inicio
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    this.exitFullScreen(); // Asegurarse de salir de pantalla completa si se desmonta el componente
  }
};
</script>

<style scoped>
.start-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c003e; /* Color de fondo oscuro para un efecto inmersivo */
}

.start-button {
  background-color: #6a00ff; /* Botón púrpura brillante */
  color: white;
  font-size: 24px;
  padding: 15px 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* Centra el texto horizontalmente */
  line-height: 1; /* Asegura que la altura de línea no afecte la alineación */
}

.start-button:hover {
  background-color: #4b0082; /* Cambia a un púrpura más oscuro al pasar el ratón */
}

.exercise-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2c003e; /* Color de fondo oscuro */
  width: 100vw;
  height: 100vh;
  position: relative;
}

.fullscreen-exercise {
  /* Ocupa la pantalla completa con la esfera */
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.breathing-sphere {
  background-color: #ffd700; /* Color de la bola: amarillo brillante como el sol */
  border-radius: 50%;
  box-shadow: 0px 10px 30px rgba(255, 215, 0, 0.8);
}

.bottom-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  text-align: left;
  color: white;
}

.breathing-text {
  font-size: 32px;
  font-weight: bold;
  color: #ffd700; /* Texto en amarillo para resaltar */
  animation: pulse 2s infinite;
}

.timer {
  margin-top: 10px;
  font-size: 24px;
  color: #bbbbbb;
}

.reflection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c003e;
  color: white;
}

.reflection-textarea {
  width: 90vh;
  height: 200px;
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  border: none;
  background-color: #fff9d8; /* Fondo similar a la bola */
  color: #2c003e; /* Texto en color oscuro */
  font-size: 18px;
  box-shadow: 0px 10px 30px rgba(255, 215, 0, 0.8); /* Sombra similar */
}

/* Efecto de latido para el texto */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
