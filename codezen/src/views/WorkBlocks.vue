<template>
  <v-container class="work-blocks" fluid>
    <h2 class="work-title">¡A por la jornada!</h2>
    <div v-if="!allBlocksCompleted">
      <v-row class="justify-center">
        <v-col
          v-for="(block, index) in workBlocks"
          :key="index"
          cols="12"
          md="8"
          class="d-flex justify-center"
        >
          <v-card
            :class="[
              block.completed ? 'block-completed' : 'block-incomplete',
              activeBlockIndex === index && currentPhase === 'work'
                ? 'block-active-work'
                : activeBlockIndex === index && currentPhase === 'break'
                ? 'block-active-break'
                : ''
            ]"
            class="work-block-card no-padding"
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
                @phaseChange="handlePhaseChange"
              />
              <p v-if="block.completed" class="block-status">Bloque completado</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
      totalHoursWorked: 0,
      nextAction: null,
      currentPhase: 'work' // Fase actual: trabajo o descanso
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
        this.startFirstBlock
      );
    }
  },
  methods: {
    handleWorkComplete() {
      this.totalHoursWorked += 1;
      this.showNotification(
        "¡Es hora de descansar!",
        "Relájate antes de empezar el siguiente bloque.",
        this.startBreak
      );
    },
    handleBreakComplete() {
      this.completeBlock(this.activeBlockIndex);
      if (this.activeBlockIndex < this.workBlocks.length - 1) {
        this.showNotification(
          `Bloque ${this.activeBlockIndex + 1} completado`,
          "Prepárate para el siguiente bloque de trabajo.",
          this.startNextBlock
        );
      } else {
        this.showNotification("Todos los bloques completados", "¡Buen trabajo!", this.goToEndOfDay);
      }
    },
    completeBlock(index) {
      this.workBlocks[index].completed = true;
    },
    goToEndOfDay() {
      localStorage.setItem('totalHoursWorked', this.totalHoursWorked);
      this.$router.push('/end-of-day');
    },
    showNotification(title, message, action = null) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationVisible = true;
      this.nextAction = action;
    },
    handleNotificationAccept() {
      this.notificationVisible = false;
      if (this.nextAction) {
        this.nextAction();
      }
    },
    startFirstBlock() {
      if (this.$refs.workTimer) {
        this.$refs.workTimer[0].startTimer();
      }
    },
    startNextBlock() {
      if (this.activeBlockIndex < this.workBlocks.length - 1) {
        this.activeBlockIndex++;
        this.$nextTick(() => {
          if (this.$refs.workTimer && this.$refs.workTimer[0]) {
            this.showNotification(
              "¡Empieza el siguiente bloque de trabajo!",
              "Mantén tu enfoque en el trabajo.",
              () => this.$refs.workTimer[0].startTimer()
            );
          }
        });
      }
    },
    startBreak() {
      if (this.$refs.workTimer && this.$refs.workTimer[0]) {
        this.$refs.workTimer[0].startBreak();
      }
    },
    handlePhaseChange(phase) {
      this.currentPhase = phase;
    }
  }
};
</script>

<style scoped>
.work-block-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

.work-title {
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

.work-block-card {
  width: 90%;
  padding: 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-align: center;
}

.block-completed {
  border-left: 10px solid #00cc00;
}

.block-incomplete {
  border-left: 10px solid #ff0000;
}

.block-active-work {
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
  border-left: 10px solid #ffa500;
}

.block-active-break {
  background-image: linear-gradient(135deg, #43cea2, #185a9d);
  border-left: 10px solid #ffa500;
}

.block-status {
  font-weight: bold;
  color: #006600;
}

.all-completed-container {
  text-align: center;
  padding: 50px;
}

.finish-btn {
  background-color: #43cea2;
  color: white;
  margin-top: 20px;
}

.no-padding {
  padding: 0;
}
</style>
