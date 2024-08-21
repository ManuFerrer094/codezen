<template>
  <div v-if="!exerciseStarted && !exerciseCompleted" class="start-container">
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <StartGuide v-if="currentStep === 1" @nextStep="nextStep" />
        <ColorCustomization
          v-if="currentStep === 2"
          :backgroundColor="backgroundColor"
          :sphereColor="sphereColor"
          :shadowColor="shadowColor"
          @update:backgroundColor="backgroundColor = $event"
          @update:sphereColor="sphereColor = $event"
          @update:shadowColor="shadowColor = $event"
          @previousStep="previousStep"
          @nextStep="nextStep"
        />
        <DurationSelection
          v-if="currentStep === 3"
          :selectedDuration="selectedDuration"
          @update:selectedDuration="selectedDuration = $event"
          @previousStep="previousStep"
          @confirmDuration="confirmDuration"
        />
      </v-card>
    </v-dialog>
  </div>

  <div
    v-else-if="exerciseStarted || exerciseCompleted"
    class="exercise-container fullscreen-exercise"
    :style="{ backgroundColor: backgroundColor }"
    ref="exerciseContainer"
  >
    <div v-if="!exerciseCompleted" class="breathing-sphere" :style="sphereStyle"></div>

    <ExerciseControls
      v-if="!exerciseCompleted"
      :secondsLeft="secondsLeft"
      :exerciseDuration="exerciseDuration"
      :isPaused="isPaused"
      @togglePause="togglePause"
      @exerciseCompleted="handleExerciseCompleted"
    />

    <ReflectionForm v-if="exerciseCompleted" @reflectionSaved="handleReflectionSaved" />
  </div>
</template>

<script>
import StartGuide from '../breathingball/StartGuide.vue';
import ColorCustomization from '../breathingball/ColorCustomization.vue';
import DurationSelection from '../breathingball/DurationSelection.vue';
import ExerciseControls from '../breathingball/ExerciseControls.vue';
import ReflectionForm from '../ReflectionForm.vue';
import meditationAudioSrc from '../../../public/meditation.mp3';

export default {
  components: {
    StartGuide,
    ColorCustomization,
    DurationSelection,
    ExerciseControls,
    ReflectionForm,
  },
  data() {
    return {
      exerciseStarted: false,
      exerciseCompleted: false,
      isPaused: false,
      sphereSize: 100,
      phase: 0,
      phaseDurations: [3, 4, 6, 2],
      exerciseDuration: 60,
      secondsLeft: 60,
      intervalId: null,
      dialogVisible: true,
      currentStep: 1,
      selectedDuration: 60,
      sphereColor: '#ffd700',
      backgroundColor: '#2c003e',
      shadowColor: '#ffd700',
      meditationAudio: null,
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
    confirmDuration(selectedDuration) {
      this.exerciseDuration = selectedDuration || 60;
      this.secondsLeft = this.exerciseDuration;
      this.dialogVisible = false;
      this.startExercise();
    },
    async startExercise() {
      this.exerciseStarted = true;
      this.playMeditationAudio();
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
      this.startPhase(true);
    },
    startExerciseTimer() {
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.secondsLeft--;
          if (this.secondsLeft <= 0) {
            this.handleExerciseCompleted(true);
          }
        }
      }, 1000);
    },
    startPhase(isFirstPhase = false) {
      if (this.exerciseCompleted) return;

      switch (this.phase) {
        case 0: // Inhalar
          this.sphereSize = 100;
          this.transitionDuration = isFirstPhase ? 0 : this.phaseDurations[this.phase];
          setTimeout(() => {
            this.sphereSize = 300;
            this.transitionDuration = this.phaseDurations[this.phase];
          }, 0);
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
        if (!this.isPaused && !this.exerciseCompleted) {
          this.startPhase();
        }
      }, this.phaseDurations[this.phase] * 1000);
    },
    togglePause() {
      this.isPaused = !this.isPaused;
      if (!this.isPaused && !this.exerciseCompleted) {
        this.startPhase();
      }
    },
    handleExerciseCompleted(autoComplete) {
      clearInterval(this.intervalId);
      this.exerciseCompleted = true;
      this.exerciseStarted = false;
      this.stopMeditationAudio();
      if (autoComplete) {
        this.showReflectionForm();
      }
    },
    handleReflectionSaved() {
      this.exerciseCompleted = false;
      this.$router.push({ name: 'Home' });
    },
    showReflectionForm() {
      this.exerciseCompleted = true;
    },
    playMeditationAudio() {
      if (!this.meditationAudio) {
        this.meditationAudio = new Audio(meditationAudioSrc);
        this.meditationAudio.loop = true;
      }
      this.meditationAudio.play();
    },
    stopMeditationAudio() {
      if (this.meditationAudio) {
        this.meditationAudio.pause();
        this.meditationAudio.currentTime = 0;
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    this.stopMeditationAudio();
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
  transition: all 1s ease-in-out;
}

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
</style>
