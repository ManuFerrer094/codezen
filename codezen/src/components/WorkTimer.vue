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
import { enviarNotificacion } from '@/utils/notifications.js'; // Importa la función

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
      secondsLeft: this.workDuration * 60,
      interval: null,
      notificationSent: false
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
    showNotification() {
      const title = this.currentTab === 0 ? '¡Hora de trabajar!' : '¡Es hora de descansar!';
      const message = this.currentTab === 0
        ? 'Mantén el enfoque y sigue adelante.'
        : 'Tómate un respiro y relájate.';

      enviarNotificacion(title, message);
    },
    startTimer() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.showNotification(); // Mover aquí la llamada para que la notificación se muestre al iniciar
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
      }
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
      this.secondsLeft = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      this.notificationSent = false;
      this.showNotification();
    },
    manualSwitchMode() {
      this.pauseTimer();
      this.secondsLeft = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      this.notificationSent = false;
    },
    completeBlock() {
      clearInterval(this.interval);
      this.$emit('blockComplete');

      if (this.isLastBlock) {
        this.showNotification('¡Jornada finalizada!', 'Puedes realizar el ejercicio de cierre.');
      } else {
        this.showNotification('¡Bloque completado!', 'Buen trabajo, pasa al siguiente bloque.');
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
