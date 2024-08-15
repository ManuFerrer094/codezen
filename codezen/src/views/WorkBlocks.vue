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
              :workDuration="5"
              :breakDuration="5"
              @blockComplete="completeBlock(index)"
              :isLastBlock="index === workBlocks.length - 1"
            />
            <p v-if="block.completed">Bloque completado</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!block.completed && activeBlockIndex === index"
              @click="completeBlock(index)"
              color="success"
            >
              Completar Bloque
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div v-else>
      <h3>Todos los bloques han sido completados</h3>
      <v-btn @click="goToEndOfDay" color="primary">Ir al Ejercicio de Cierre</v-btn> <!-- Botón para redirigir -->
    </div>
  </v-container>
</template>

<script>
import WorkTimer from '@/components/WorkTimer.vue';

export default {
  components: {
    WorkTimer
  },
  data() {
    return {
      workBlocks: [],
      activeBlockIndex: 0 // Controla el bloque que está en curso
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

      const workBlocks = [];

      workLapses.forEach((lapso) => {
        const start = parseInt(lapso.startTime.split(":")[0]);
        const end = parseInt(lapso.endTime.split(":")[0]);

        if (!isNaN(start) && !isNaN(end)) {
          for (let hour = start; hour < end; hour++) {
            workBlocks.push({
              time: `${hour}:00 - ${hour + 1}:00`,
              completed: false
            });
          }
        }
      });

      this.workBlocks = workBlocks;
      this.showNotification("¡Empieza el primer bloque de trabajo!", "Recuerda mantener tu enfoque.");
    }
  },
  methods: {
    completeBlock(index) {
      this.workBlocks[index].completed = true;

      // Notificar sobre el bloque completado y siguiente bloque
      this.showNotification(`Bloque ${index + 1} completado`, "Tómate un descanso antes del siguiente bloque.");

      // Pasar al siguiente bloque si existe
      if (index + 1 < this.workBlocks.length) {
        this.activeBlockIndex = index + 1;
      }
    },
    goToEndOfDay() {
      this.$router.push('/end-of-day'); // Redirige a la página del ejercicio de cierre cuando el usuario haga clic en el botón
    },
    showNotification(title, body) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
        Notification.requestPermission();
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
