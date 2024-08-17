<template>
  <div :class="[currentTab === 0 ? 'work-timer' : 'break-timer']">
    <v-tabs v-model="currentTab" @change="manualSwitchMode">
      <v-tab>Work</v-tab>
      <v-tab>Break</v-tab>
    </v-tabs>

    <v-tab-item>
      <div class="timer-display">
        <p>{{ formattedTime }}</p>
      </div>
      <v-btn v-if="!isRunning" @click="startTimer">Start</v-btn>
      <v-btn v-if="isRunning" @click="pauseTimer">Pause</v-btn>
      <v-btn v-if="isRunning" @click="nextStep">Next</v-btn>
    </v-tab-item>
  </div>
</template>

<script>
export default {
  name: 'WorkTimer',
  props: {
    workDuration: {
      type: Number,
      default: 25
    },
    breakDuration: {
      type: Number,
      default: 5
    },
    isLastBlock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTab: 0, // 0: Work, 1: Break
      isRunning: false,
      secondsLeft: this.workDuration * 60,
      interval: null
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  },
  methods: {
    startTimer() {
      this.currentTab = 0; // Asegura que comience en la fase de trabajo
      this.secondsLeft = this.workDuration * 60;
      this.runTimer();
    },
    startBreak() {
      this.currentTab = 1; // Cambia a la fase de descanso
      this.secondsLeft = this.breakDuration * 60;
      this.runTimer();
    },
    runTimer() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.interval = setInterval(() => {
          if (this.secondsLeft === 0) {
            if (this.currentTab === 0) {
              this.pauseTimer();
              this.$emit('workComplete');
            } else {
              this.pauseTimer();
              this.$emit('breakComplete');
            }
          } else {
            this.secondsLeft--;
          }
        }, 1000);
      }
    },
    pauseTimer() {
      this.isRunning = false;
      clearInterval(this.interval);
    },
    nextStep() {
      if (this.currentTab === 0) {
        // Cambiar a descanso
        this.startBreak();
      } else {
        // Completar el bloque al finalizar el descanso
        this.pauseTimer();
        this.$emit('breakComplete');
      }
    },
    manualSwitchMode() {
      this.pauseTimer();
      this.secondsLeft = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.work-timer {
  background-color: #ffcccc;
  text-align: center;
  font-size: 24px;
}
.break-timer {
  background-color: #ccffff;
  text-align: center;
  font-size: 24px;
}
.timer-display {
  font-size: 48px;
  margin: 20px 0;
}
</style>
