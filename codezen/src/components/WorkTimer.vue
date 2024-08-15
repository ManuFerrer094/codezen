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
      default: 5
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
      currentTab: 0,
      isRunning: false,
      secondsLeft: this.workDuration,
      interval: null,
      isManualSwitch: false
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  },
  watch: {
    currentTab(newVal) {
      this.pauseTimer();
      this.secondsLeft = newVal === 0 ? this.workDuration : this.breakDuration;
    }
  },
  mounted() {
    this.requestNotificationPermission();
  },
  methods: {
    startTimer() {
      this.isRunning = true;
      this.interval = setInterval(() => {
        if (this.secondsLeft === 0) {
          if (this.currentTab === 0) {
            this.switchMode();
          } else {
            this.completeBlock();
          }
        } else {
          this.secondsLeft--;
        }
      }, 1000);

      this.showNotification(
        this.currentTab === 0 ? '¡Hora de trabajar!' : '¡Es hora de descansar!',
        this.currentTab === 0
          ? 'Mantén el enfoque y sigue adelante.'
          : 'Tómate un respiro y relájate.'
      );
    },
    pauseTimer() {
      this.isRunning = false;
      clearInterval(this.interval);
    },
    nextStep() {
      this.pauseTimer();
      if (this.currentTab === 0) {
        this.switchMode();
      } else {
        this.completeBlock();
      }
    },
    switchMode() {
      this.currentTab = this.currentTab === 0 ? 1 : 0;
      this.secondsLeft = this.currentTab === 0 ? this.workDuration : this.breakDuration;
      this.startTimer();
    },
    manualSwitchMode() {
      this.pauseTimer();
      this.secondsLeft = this.currentTab === 0 ? this.workDuration : this.breakDuration;
    },
    completeBlock() {
      clearInterval(this.interval);
      this.$emit('blockComplete');

      if (this.isLastBlock) {
        // Redirigir al juego de la bolita
        this.$router.push('/end-of-day');
      } else {
        this.showNotification('¡Bloque completado!', 'Buen trabajo, pasa al siguiente bloque.');
      }
    },
    requestNotificationPermission() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Permiso de notificaciones concedido.');
          } else {
            console.log('Permiso de notificaciones denegado.');
          }
        });
      } else {
        console.log('Permiso de notificaciones ya concedido.');
      }
    },
    showNotification(title, body) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
        console.log('Notificaciones no permitidas. Permiso actual: ' + Notification.permission);
      }
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
