<template>
  <div :class="currentTab === 0 ? 'work-timer' : 'break-timer'">
    <v-tabs v-model="currentTab" @change="manualSwitchMode" class="custom-tabs">
      <v-tab>Work</v-tab>
      <v-tab>Break</v-tab>
    </v-tabs>

    <v-tab-item>
      <div class="timer-display">
        <p>{{ formattedTime }}</p>
      </div>
      <v-btn v-if="!isRunning" @click="startTimer" class="start-btn">Start</v-btn>
      <v-btn v-if="isRunning" @click="togglePause" class="pause-btn">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </v-btn>
      <v-btn v-if="isRunning && !isPaused" @click="nextStep" class="next-btn">Next</v-btn>
    </v-tab-item>
  </div>
</template>

<script>
export default {
  name: 'WorkTimer',
  props: {
    workDuration: {
      type: Number,
      default: 25,
    },
    breakDuration: {
      type: Number,
      default: 5,
    },
    isLastBlock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentTab: 0, // 0: Work, 1: Break
      isRunning: false,
      isPaused: false,
      secondsLeft: this.workDuration * 60,
      interval: null,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
  },
  watch: {
    currentTab(newTab) {
      if (newTab === 0) {
        this.$emit('phaseChange', 'work'); // Emitir evento de cambio de fase a "Work"
      } else {
        this.$emit('phaseChange', 'break'); // Emitir evento de cambio de fase a "Break"
      }
    },
  },
  methods: {
    startTimer() {
      this.currentTab = 0; // Asegura que comience en la fase de trabajo
      this.secondsLeft = this.workDuration * 60;
      this.runTimer();
      this.$emit('phaseChange', 'work'); // Emitir evento de cambio de fase a "Work"
    },
    startBreak() {
      this.currentTab = 1; // Cambia a la fase de descanso
      this.secondsLeft = this.breakDuration * 60;
      this.runTimer();
      this.$emit('phaseChange', 'break'); // Emitir evento de cambio de fase a "Break"
    },
    runTimer() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.interval = setInterval(() => {
          if (!this.isPaused && this.secondsLeft > 0) {
            this.secondsLeft--;
          } else if (this.secondsLeft === 0) {
            this.pauseTimer();
            if (this.currentTab === 0) {
              this.$emit('workComplete');
            } else {
              this.$emit('breakComplete');
            }
          }
        }, 1000);
      }
    },
    pauseTimer() {
      this.isRunning = false;
      clearInterval(this.interval);
    },
    togglePause() {
      this.isPaused = !this.isPaused;
    },
    nextStep() {
      if (this.currentTab === 0) {
        this.startBreak();
      } else {
        this.pauseTimer();
        this.$emit('breakComplete');
      }
    },
    manualSwitchMode() {
      this.pauseTimer();
      this.secondsLeft =
        this.currentTab === 0
          ? this.workDuration * 60
          : this.breakDuration * 60;
      this.$emit('phaseChange', this.currentTab === 0 ? 'work' : 'break'); // Emitir evento al cambiar manualmente
    },
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.work-timer {
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
  transition: background-image 0.5s ease;
}

.break-timer {
  background-image: linear-gradient(135deg, #43cea2, #185a9d);
  transition: background-image 0.5s ease;
}

.custom-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 5px;
  width: 250px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.custom-tabs .v-tab {
  flex: 1;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  padding: 10px 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 30px;
}

.custom-tabs .v-tab:first-child {
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.custom-tabs .v-tab:last-child {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

.custom-tabs .v-tab:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffcc00;
}

.timer-display {
  font-size: 64px;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
  margin: 15px 0;
}

.start-btn, .pause-btn, .next-btn {
  margin: 10px;
}
</style>
