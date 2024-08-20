<template>
  <div :class="currentTab === 0 ? 'work-timer' : 'break-timer'">
    <v-tabs v-model="currentTab" @change="manualSwitchMode" class="custom-tabs">
      <v-tab>Work</v-tab>
      <v-tab>Break</v-tab>
    </v-tabs>

    <v-tab-item>
      <div class="timer-display">
        <p>{{ formattedTime }}</p>
        <div class="progress-bar">
          <div class="progress" :style="progressStyle"></div>
        </div>
      </div>
      <v-btn v-if="!isRunning" @click="startTimer" class="start-btn">Start</v-btn>
      <v-btn v-if="isRunning" @click="togglePause" :class="{'paused': isPaused, 'resume': !isPaused}">
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
    progressStyle() {
      const totalDuration = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      const progressPercentage = ((totalDuration - this.secondsLeft) / totalDuration) * 100;
      return { width: `${progressPercentage}%` };
    }
  },
  watch: {
    currentTab(newTab) {
      if (newTab === 0) {
        this.$emit('phaseChange', 'work');
      } else {
        this.$emit('phaseChange', 'break');
      }
    },
  },
  methods: {
    startTimer() {
      this.currentTab = 0;
      this.secondsLeft = this.workDuration * 60;
      this.runTimer();
      this.$emit('phaseChange', 'work');
    },
    startBreak() {
      this.currentTab = 1;
      this.secondsLeft = this.breakDuration * 60;
      this.runTimer();
      this.$emit('phaseChange', 'break');
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
      this.$emit('phaseChange', this.currentTab === 0 ? 'work' : 'break');
    },
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.work-timer {
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
  transition: background-image 0.5s ease;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
}

.break-timer {
  background-image: linear-gradient(135deg, #43cea2, #185a9d);
  transition: background-image 0.5s ease;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
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
  font-family: 'Roboto', sans-serif;
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
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-top: 15px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: white;
  transition: width 1s linear;
}

.start-btn, .pause-btn, .next-btn {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 18px;
  text-transform: uppercase;
  transition: background-color 0.3s ease, color 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.start-btn {
  background-color: #ffcc00;
  color: white;
}

.pause-btn {
  background-color: #ff6f61;
  color: white;
}

.pause-btn.paused {
  background-color: #ffcc00;
}

.next-btn {
  background-color: #43cea2;
  color: white;
}

.start-btn:hover, .pause-btn:hover, .next-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 48px;
  }

  .start-btn, .pause-btn, .next-btn {
    font-size: 16px;
    padding: 8px 16px;
  }
}
</style>
