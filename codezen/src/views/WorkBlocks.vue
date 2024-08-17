<template>
  <v-container class="work-blocks" fluid>
    <div v-if="!allBlocksCompleted">
      <h2>Bloques de Trabajo Generados</h2>
      <div v-for="(block, index) in workBlocks" :key="index">
        <v-card
          :class="{
            'block-completed': block.completed,
            'block-incomplete': !block.completed
          }"
          class="mb-4"
        >
          <v-card-title>{{ block.time }}</v-card-title>
          <v-card-text>
            <WorkTimer
              v-if="activeBlockIndex === index"
              ref="workTimer"
              :workDuration="block.workDuration"
              :breakDuration="block.breakDuration"
              @workComplete="handleWorkComplete"
              @breakComplete="handleBreakComplete"
              :isLastBlock="index === workBlocks.length - 1"
            />
            <p v-if="block.completed">Bloque completado</p>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div v-else>
      <h3>Todos los bloques han sido completados</h3>
      <v-btn @click="goToEndOfDay" color="primary">Ir al Ejercicio de Cierre</v-btn>
    </div>

    <!-- Modal para notificaciones -->
    <NotificationModal 
      v-if="notificationVisible" 
      :title="notificationTitle" 
      :message="notificationMessage" 
      @accept="handleNotificationAccept"
    />
  </v-container>
</template>

<script>
import WorkTimer from '@/components/WorkTimer.vue';
import NotificationModal from '@/components/NotificationModal.vue';

export default {
  components: {
    WorkTimer,
    NotificationModal
  },
  data() {
    return {
      workBlocks: [],
      activeBlockIndex: 0,
      notificationVisible: false,
      notificationTitle: '',
      notificationMessage: '',
      totalHoursWorked: 0, // Nuevo: Para almacenar el total de horas trabajadas
      nextAction: null // Acción a ejecutar después de aceptar la notificación
    };
  },
  computed: {
    allBlocksCompleted() {
      return this.workBlocks.every(block => block.completed);
    }
  },
  mounted() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.workLapses) {
      const workLapses = userData.workLapses;
      const workDuration = userData.workDuration || 1;
      const breakDuration = userData.breakDuration || 5;

      const workBlocks = [];

      workLapses.forEach((lapso) => {
        const start = parseInt(lapso.startTime.split(":")[0]);
        const end = parseInt(lapso.endTime.split(":")[0]);

        if (!isNaN(start) && !isNaN(end)) {
          for (let hour = start; hour < end; hour++) {
            workBlocks.push({
              time: `${hour}:00 - ${hour + 1}:00`,
              completed: false,
              workDuration,
              breakDuration
            });
          }
        }
      });

      this.workBlocks = workBlocks;
      this.showNotification(
        "¡Empieza el primer bloque de trabajo!", 
        "Recuerda mantener tu enfoque.", 
        this.startFirstBlock // Inicia el primer bloque después de aceptar
      );
    }
  },
  methods: {
    handleWorkComplete() {
      this.totalHoursWorked += 1; // Incrementa las horas trabajadas
      this.showNotification(
        "¡Es hora de descansar!",
        "Relájate antes de empezar el siguiente bloque.",
        this.startBreak // Inicia el descanso después de aceptar
      );
    },
    handleBreakComplete() {
      this.completeBlock(this.activeBlockIndex); // Completa el bloque actual
      if (this.activeBlockIndex < this.workBlocks.length - 1) {
        this.showNotification(
          `Bloque ${this.activeBlockIndex + 1} completado`,
          "Prepárate para el siguiente bloque de trabajo.",
          this.startNextBlock // Inicia el siguiente bloque después del descanso
        );
      } else {
        this.showNotification("Todos los bloques completados", "¡Buen trabajo!", this.goToEndOfDay);
      }
    },
    completeBlock(index) {
      this.workBlocks[index].completed = true;
    },
    goToEndOfDay() {
      // Almacenar las horas trabajadas en el localStorage
      localStorage.setItem('totalHoursWorked', this.totalHoursWorked);
      this.$router.push('/end-of-day');
    },
    showNotification(title, message, action = null) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationVisible = true;
      this.nextAction = action; // Guarda la acción que se ejecutará al aceptar
    },
    handleNotificationAccept() {
      this.notificationVisible = false; // Cierra la notificación
      if (this.nextAction) {
        this.nextAction(); // Ejecuta la acción pendiente
      }
    },
    startFirstBlock() {
      if (this.$refs.workTimer) {
        this.$refs.workTimer[0].startTimer(); // Asegura que se inicie el primer bloque
      }
    },
    startNextBlock() {
      if (this.activeBlockIndex < this.workBlocks.length - 1) {
        this.activeBlockIndex++; // Pasa al siguiente bloque
        this.$nextTick(() => {
          if (this.$refs.workTimer && this.$refs.workTimer[0]) {
            this.showNotification(
              "¡Empieza el siguiente bloque de trabajo!",
              "Mantén tu enfoque en el trabajo.",
              () => this.$refs.workTimer[0].startTimer()
            ); // Notificación para empezar el siguiente bloque
          }
        });
      }
    },
    startBreak() {
      if (this.$refs.workTimer && this.$refs.workTimer[0]) {
        this.$refs.workTimer[0].startBreak(); // Inicia el temporizador del descanso
      }
    }
  }
};
</script>

<style scoped>
.block-completed {
  background-color: #e0ffe0;
}
.block-incomplete {
  background-color: #ffe0e0;
}
</style>
