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
      secondsLeft: this.workDuration * 60, // Cambiado a segundos
      interval: null,
      notificationSent: false // Para controlar cuándo enviar notificaciones
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
      this.secondsLeft = newVal === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      this.notificationSent = false; // Restablece el estado de la notificación al cambiar de fase
    }
  },
  mounted() {
    this.requestNotificationPermission();
  },
  methods: {
    startTimer() {
      if (!this.isRunning) {
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

        // Enviar notificación solo al inicio de la fase de trabajo o descanso
        if (!this.notificationSent && this.isRunning) {
          this.showNotification(
            this.currentTab === 0 ? '¡Hora de trabajar!' : '¡Es hora de descansar!',
            this.currentTab === 0
              ? 'Mantén el enfoque y sigue adelante.'
              : 'Tómate un respiro y relájate.'
          );
          this.notificationSent = true; // Marca que la notificación ya se envió
        }
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
      this.notificationSent = false; // Restablece el estado de la notificación para la nueva fase
      this.startTimer();
    },
    manualSwitchMode() {
      this.pauseTimer();
      this.secondsLeft = this.currentTab === 0 ? this.workDuration * 60 : this.breakDuration * 60;
      this.notificationSent = false; // Restablece el estado de la notificación al cambiar de fase manualmente
    },
    completeBlock() {
      clearInterval(this.interval);
      this.$emit('blockComplete');

      if (this.isLastBlock) {
        this.showNotification('¡Jornada finalizada!', 'Puedes realizar el ejercicio de cierre.');
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
      if (Notification.permission === 'granted' && this.isRunning) {
        new Notification(title, { body });
      } else {
        console.log('Notificaciones no permitidas o temporizador en pausa.');
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
