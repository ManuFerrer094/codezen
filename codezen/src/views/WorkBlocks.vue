<template>
  <v-container class="work-blocks" fluid>
    <div v-if="workBlocks.length">
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
              :workDuration="50"
              :breakDuration="10"
              @blockComplete="completeBlock(index)"
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
      <p>No se generaron bloques de trabajo. Verifica la configuración.</p>
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
      activeBlockIndex: 0
    };
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
    }
  },
  methods: {
    completeBlock(index) {
      this.workBlocks[index].completed = true;

      if (index + 1 < this.workBlocks.length) {
        this.activeBlockIndex = index + 1;
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
