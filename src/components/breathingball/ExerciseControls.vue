<template>
    <transition name="fade">
      <div v-if="!exerciseCompleted && showControls" class="control-container">
        <div class="visual-timer">
          <div class="progress" :style="{ width: visualTimerWidth + '%' }"></div>
        </div>
  
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
  </template>
  
  <script>
  import gongAudioSrc from '../../../public/gong.mp3';

  export default {
    props: ['exerciseDuration', 'exerciseCompleted'],
    data() {
      return {
        secondsLeft: this.exerciseDuration,
        isPaused: false,
        intervalId: null,
        showControls: true,
      };
    },
    computed: {
      visualTimerWidth() {
        return (this.secondsLeft / this.exerciseDuration) * 100;
      }
    },
    mounted() {
      this.startExerciseTimer();
      this.setupAutoHideControls();
    },
    methods: {
      startExerciseTimer() {
        this.intervalId = setInterval(() => {
          if (!this.isPaused) {
            this.secondsLeft--;
            if (this.secondsLeft === 4) {
              this.playGongAudio();
            }
            if (this.secondsLeft <= 0) {
              this.endExercise(true);
            }
          }
        }, 1000);
      },
      togglePause() {
        this.isPaused = !this.isPaused;
      },
      endExercise(autoComplete = false) {
        clearInterval(this.intervalId);
        this.$emit('exerciseCompleted', autoComplete);
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
            hideTimeout = setTimeout(hideControls, 3000);
          }
        };
       
        window.addEventListener('mousemove', resetHideTimeout);
  
        resetHideTimeout();
      },
      playGongAudio() {
      const gongAudio = new Audio(gongAudioSrc);
      gongAudio.play();
    }
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
      window.removeEventListener('mousemove', this.setupAutoHideControls);
    }
  };
  </script>
  
  <style scoped>
  .control-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #000;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  
  .visual-timer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: #676767;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .visual-timer .progress {
    height: 100%;
    background-color: white;
    width: 0%;
    transition: width 1s linear;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
  }
  
  .icon-button {
    width: 50px;
    height: 50px;
    background-color: var(--v-btn-background, #fff);
    color: var(--v-btn-color, #000);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .icon-button:hover {
    background-color: var(--v-btn-hover-background, #f0f0f0);
    color: var(--v-btn-hover-color, #000);
  }
  
  .icon-button .icon {
    font-size: 24px;
    fill: #000;
  }
  </style>
  