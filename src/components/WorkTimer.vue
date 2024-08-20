<template>
  <div :class="currentTab === 0 ? 'work-timer' : 'break-timer'">
    <v-tabs v-model="currentTab" @change="manualSwitchMode" class="custom-tabs">
      <v-tab>Work</v-tab>
      <v-tab>Break</v-tab>
    </v-tabs>

    <v-tab-item>
      <div class="timer-display">
        <p>{{ formattedTime }}</p>
        <div 
          class="progress-bar"
          @mousedown="startSeeking"
          @mousemove="handleSeeking"
          @mouseup="endSeeking"
          @mouseleave="endSeeking"
          :style="{ cursor: isDragging ? 'grabbing' : 'pointer' }"
          ref="progressBar"
        >
          <div class="progress" :style="progressStyle"></div>
        </div>
      </div>
      <v-btn v-if="!isRunning" @click="startTimer" class="start-btn">
        <v-icon>{{ isPaused ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>
      
      <div v-if="isRunning" class="button-container">
        <v-btn @click="togglePause" class="icon-button">
          <v-icon>{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
        </v-btn>
        <v-btn v-if="!isPaused" @click="nextStep" class="icon-button">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </div>
    </v-tab-item>
  </div>
</template>

<script>
export default {
  name: 'WorkTimer',
  props: {
    workDuration: {
      type: Number,
      default: 50,
    },
    breakDuration: {
      type: Number,
      default: 10,
    },
    isLastBlock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentTab: 0,
      isRunning: false,
      isPaused: false,
      secondsLeft: this.workDuration * 60,
      interval: null,
      isDragging: false,
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
    startSeeking(event) {
      this.isDragging = true;
      this.seek(event);
    },
    handleSeeking(event) {
      if (this.isDragging) {
        this.seek(event);
      }
    },
    endSeeking() {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.isRunning) {
          this.runTimer();
        }
      }
    },
    seek(event) {
      const progressBar = this.$refs.progressBar;
      const totalWidth = progressBar.clientWidth;
      const clickPosition = event.offsetX;

      const totalDuration = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      const newTime = Math.floor((clickPosition / totalWidth) * totalDuration);

      this.secondsLeft = totalDuration - newTime;
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

.start-btn, .icon-button {
  margin: 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.start-btn {
  background-color: #ffcc00;
}

.icon-button {
  background-color: #ff6f61;
}

.icon-button + .icon-button {
  background-color: #43cea2;
}

.start-btn:hover, .icon-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.progress-bar {
  cursor: pointer;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: 48px;
  }

  .start-btn {
    font-size: 16px;
    padding: 8px 16px;
  }

  .icon-button {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
