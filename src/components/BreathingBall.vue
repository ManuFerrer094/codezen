<template>
  <div v-if="!exerciseStarted && !exerciseCompleted" class="start-container">
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <!-- Paso 1: Guía de Respiración -->
        <div v-if="currentStep === 1">
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
            <v-btn color="primary" @click="nextStep">Siguiente</v-btn>
          </v-card-actions>
        </div>

        <!-- Paso 2: Personalización de Colores -->
        <div v-if="currentStep === 2">
          <v-card-title class="headline">Personalización de Colores</v-card-title>
          <v-card-text>
            <div class="color-configuration">
              <!-- Columna 1: Selectores de Color -->
              <div class="color-selectors">
                <label>Color de fondo:</label>
                <div class="color-input-container">
                  <input type="color" v-model="backgroundColor" class="color-input"/>
                </div>

                <label>Color de la esfera:</label>
                <div class="color-input-container">
                  <input type="color" v-model="sphereColor" class="color-input"/>
                </div>

                <label>Color de la sombra:</label>
                <div class="color-input-container">
                  <input type="color" v-model="shadowColor" class="color-input"/>
                </div>
              </div>

              <!-- Columna 2: Vista previa -->
              <div class="preview-container" :style="{ backgroundColor: backgroundColor }">
                <div class="preview-sphere" :style="previewStyle"></div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="previousStep">Atrás</v-btn>
            <v-btn color="primary" @click="nextStep">Siguiente</v-btn>
          </v-card-actions>
        </div>

        <!-- Paso 3: Selección de Tiempo -->
        <div v-if="currentStep === 3">
          <v-card-title class="headline">Selecciona la Duración</v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedDuration" :mandatory="false">
              <v-radio label="1 minuto" :value="60"></v-radio>
              <v-radio label="3 minutos" :value="180"></v-radio>
              <v-radio label="5 minutos" :value="300"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="previousStep">Atrás</v-btn>
            <v-btn color="primary" @click="confirmDuration">Confirmar</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>

  <div v-else-if="exerciseStarted || exerciseCompleted" class="exercise-container fullscreen-exercise" :style="{ backgroundColor: backgroundColor }" ref="exerciseContainer">
    <div
      v-if="!exerciseCompleted"
      class="breathing-sphere animated-breathing"
      :style="sphereStyle"
    ></div>

    <!-- Contenedor negro para el visual-timer y los botones -->
    <transition name="fade">
      <div v-if="!exerciseCompleted && showControls" class="control-container">
        <!-- Barra de progreso visual -->
        <div class="visual-timer">
          <div class="progress" :style="{ width: visualTimerWidth + '%' }"></div>
        </div>

        <!-- Botones para pausar/reanudar y terminar -->
        <div class="action-buttons">
          <v-btn class="icon-button pause-button" @click="togglePause">
            <v-icon v-if="!isPaused" class="icon">mdi-pause</v-icon>
            <v-icon v-else class="icon">mdi-play</v-icon>
          </v-btn>

          <v-btn class="icon-button end-button" @click="endExercise">
            <v-icon class="icon">mdi-stop</v-icon>
          </v-btn>
        </div>
      </div>
    </transition>

    <!-- Reflexión y Sentimiento -->
    <div v-if="exerciseCompleted" class="reflection-container">
      <ReflectionForm @reflectionSaved="endDay" />
    </div>
  </div>
</template>

<script>
import meditationAudioSrc from '../../public/meditation.mp3';
import gongAudioSrc from '../../public/gong.mp3';
import ReflectionForm from './ReflectionForm.vue';
export default {
  components: {
    ReflectionForm
  },
  data() {
    return {
      exerciseStarted: false,
      exerciseCompleted: false,
      isPaused: false,
      sphereSize: 100,
      phase: -1,
      phaseDurations: [3, 4, 6, 2],
      exerciseDuration: 60,
      secondsLeft: 60,
      intervalId: null,
      transitionDuration: 0,
      dialogVisible: true,
      currentStep: 1, // Paso actual
      selectedDuration: 60,
      sphereColor: '#ffd700', // Color inicial de la esfera
      backgroundColor: '#2c003e', // Color inicial de fondo
      shadowColor: '#ffd700', // Color inicial de la sombra
      gainNode: null,
      campanaBuffer: null,
      gongBuffer: null,
      showControls: true,
      meditationAudio: null, // Nuevo: Audio de meditación
      gongAudio: null, // Nuevo: Audio del gong
    };
  },
  computed: {
    sphereStyle() {
      return {
        width: `${this.sphereSize}px`,
        height: `${this.sphereSize}px`,
        transition: `width ${this.transitionDuration}s ease-in-out, height ${this.transitionDuration}s ease-in-out`,
        backgroundColor: this.sphereColor,
        boxShadow: `0px 10px 30px ${this.shadowColor}`,
        borderRadius: '50%',
      };
    },
    previewStyle() {
      return {
        width: '100px',
        height: '100px',
        backgroundColor: this.sphereColor,
        boxShadow: `0px 10px 30px ${this.shadowColor}`,
        borderRadius: '50%',
        transition: 'all 0.3s ease-in-out',
      };
    },
    visualTimerWidth() {
      return (this.secondsLeft / this.exerciseDuration) * 100;
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    confirmDuration() {
      this.exerciseDuration = this.selectedDuration;
      this.secondsLeft = this.exerciseDuration;
      this.dialogVisible = false;
      this.startExercise();
    },
    async startExercise() {
      this.exerciseStarted = true;
      this.playMeditationAudio(); // Reproducir el audio de fondo
      this.$nextTick(() => {
        const exerciseElement = this.$refs.exerciseContainer;
        if (exerciseElement && exerciseElement.requestFullscreen) {
          exerciseElement.requestFullscreen().catch((err) => {
            console.error("Error al intentar entrar en modo pantalla completa:", err);
          });
        }
      });

      this.phase = 0;
      this.startExerciseTimer();
      this.startPhase();
      this.setupAutoHideControls();
    },
    startExerciseTimer() {
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.secondsLeft--;
          if (this.secondsLeft === 5) {
            this.playGongAudio(); // Reproducir el gong cuando falten 5 segundos
          }
          if (this.secondsLeft <= 0) {
            this.endExercise(true); // Pasamos true para indicar que terminó automáticamente
          }
        }
      }, 1000);
    },
    async endExercise(autoComplete = false) {
      clearInterval(this.intervalId);
      this.exerciseCompleted = true;
      this.exerciseStarted = false;
      this.secondsLeft = 0; // Resetea el contador de tiempo a 0
      this.stopMeditationAudio(); // Detener el audio de meditación
      if (autoComplete || !this.exerciseStarted) {
        this.showReflectionForm();
      }
    },
    startPhase() {
      switch (this.phase) {
        case 0: // Inhalar
          this.sphereSize = 300;
          this.transitionDuration = this.phaseDurations[this.phase];
          break;
        case 1: // Retener
          this.sphereSize = 300;
          this.transitionDuration = 0;
          break;
        case 2: // Exhalar
          this.sphereSize = 100;
          this.transitionDuration = this.phaseDurations[this.phase];
          break;
        case 3: // Esperar
          this.sphereSize = 100;
          this.transitionDuration = 0;
          break;
      }

      setTimeout(() => {
        this.phase = (this.phase + 1) % 4;
        if (!this.isPaused) {
          this.startPhase();
        }
      }, this.phaseDurations[this.phase] * 1000);
    },
    togglePause() {
      this.isPaused = !this.isPaused;
      if (!this.isPaused) {
        this.startPhase(); // Reanudar la fase actual si el ejercicio se ha pausado
      }
    },
    setupAutoHideControls() {
      let hideTimeout;
      const hideControls = () => {
        this.showControls = false;
      };

      const resetHideTimeout = () => {
        if (!this.exerciseCompleted) {
          this.showControls = true;
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(hideControls, 3000); // Ocultar después de 3 segundos
        }
      };

      // Escuchar movimiento del ratón
      window.addEventListener('mousemove', resetHideTimeout);

      resetHideTimeout(); // Comenzar el temporizador al iniciar el ejercicio
    },
    showReflectionForm() {
      this.exerciseCompleted = true;
    },
    endDay() {
      this.exerciseCompleted = false;
      this.$router.push({ name: 'Home' }); // Redirigir a la página de inicio o cualquier otra lógica
    },
    // Nuevo: Métodos para controlar el audio
    playMeditationAudio() {
      if (!this.meditationAudio) {
        this.meditationAudio = new Audio(meditationAudioSrc); // Asegúrate de que el archivo esté en la carpeta assets
        this.meditationAudio.loop = true; // Repetir el audio en bucle
      }
      this.meditationAudio.play();
    },
    stopMeditationAudio() {
      if (this.meditationAudio) {
        this.meditationAudio.pause();
        this.meditationAudio.currentTime = 0; // Reiniciar el audio
      }
    },
    playGongAudio() {
      if (!this.gongAudio) {
        this.gongAudio = new Audio(gongAudioSrc); // Asegúrate de que el archivo esté en la carpeta assets
      }
      this.gongAudio.play();
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener('mousemove', this.setupAutoHideControls); // Eliminar el event listener
    this.stopMeditationAudio(); // Detener el audio de meditación cuando el componente se desmonte
  }
};

</script>

<style scoped>
.start-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c003e;
}

.exercise-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
}

.fullscreen-exercise {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.breathing-sphere {
  transition: all 1s ease-in-out; /* Hacer la animación más suave y prolongada */
}

.animated-breathing {
  animation: colorPulse 3s ease-in-out infinite, brightnessPulse 2s ease-in-out infinite;
}

/* Animación para el cambio de color, brillo y contraste */
@keyframes colorPulse {
  0%, 100% {
    filter: brightness(100%) contrast(100%);
  }
  50% {
    filter: brightness(120%) contrast(110%);
  }
}

@keyframes brightnessPulse {
  0%, 100% {
    filter: brightness(100%);
  }
  50% {
    filter: brightness(130%);
  }
}

/* Transición para el contenedor de controles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active en versiones anteriores de Vue */ {
  opacity: 0;
}

/* Contenedor para el visual-timer y los botones */
.control-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #000; /* Fondo negro */
  padding: 10px 0;
  display: flex;
  justify-content: space-between; /* Repartir los botones */
  align-items: center;
  flex-direction: row;
}

/* Contenedor de la barra de progreso visual */
.visual-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: #676767; /* Fondo de la barra que no se consume */
  border-radius: 2px; /* Bordes redondeados */
  overflow: hidden; /* Para que el progreso no salga del contenedor */
}

/* Barra de progreso superpuesta */
.visual-timer .progress {
  height: 100%;
  background-color: white; /* Color de la barra de progreso */
  width: 0%; /* Ancho inicial */
  transition: width 1s linear; /* Transición suave */
}


/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px; /* Espaciado de los botones */
}

/* Estilos generales */
.icon-button {
  width: 50px;
  height: 50px;
  background-color: var(--v-btn-background, #fff); /* Fondo adaptable */
  color: var(--v-btn-color, #000); /* Color del ícono adaptable */
  border-radius: 50%; /* Botón redondo */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Modo oscuro */
@media (prefers-color-scheme: dark) {
  .icon-button {
    background-color: var(--v-btn-background-dark, #333); /* Fondo oscuro */
    color: var(--v-btn-color-dark, #fff); /* Color del ícono en modo oscuro */
  }
}

.icon-button:hover {
  background-color: var(--v-btn-hover-background, #f0f0f0); /* Fondo en hover adaptable */
  color: var(--v-btn-hover-color, #000); /* Color del ícono en hover adaptable */
}

@media (prefers-color-scheme: dark) {
  .icon-button:hover {
    background-color: var(--v-btn-hover-background-dark, #444); /* Fondo oscuro en hover */
    color: var(--v-btn-hover-color-dark, #fff); /* Color del ícono en hover oscuro */
  }
}

/* Manteniendo los íconos con tamaño consistente */
.icon-button .icon {
  font-size: 24px;
}

.icon-button .icon {
  fill: #000;
  font-size: 24px;
}

/* Reflexión y Sentimiento */
.reflection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}

/* Color Selector Styles */
.color-configuration {
  display: flex;
  justify-content: space-between;
}

.color-selectors {
  margin-right: 20px;
}

.color-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.color-input {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

/* Vista previa de la esfera */
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30vh;
  height: 20vh;
  transition: all 0.3s ease-in-out;
}

.preview-sphere {
  transition: all 0.3s ease-in-out;
}

/* Animaciones */
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
