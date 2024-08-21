<template>
  <v-form @submit.prevent="submitForm">
    <v-card class="custom-card pa-6">
      <v-select
        v-model="formData.profession"
        :items="professions"
        label="Profesión"
        outlined
        required
        dense
        class="mb-4 custom-select"
      ></v-select>

      <div class="lapso-header mb-3">
        <h3 class="subtitle">Añadir Lapsos de Tiempo</h3>
        <v-btn
          icon
          size="small"
          @click="addLapso"
          :disabled="formData.workLapses.length >= 2"
        >
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </div>

      <div v-for="(lapso, index) in formData.workLapses" :key="index" class="lapso-container mb-3">
        <v-select
          v-model="lapso.startTime"
          :items="getStartTimeOptions(index)"
          label="Hora de Inicio"
          outlined
          dense
          required
          class="mr-2 custom-select"
        ></v-select>
        <v-select
          v-model="lapso.endTime"
          :items="getEndTimeOptions(lapso.startTime)"
          label="Hora de Fin"
          outlined
          dense
          required
          class="ml-2 custom-select"
        ></v-select>
        <v-btn
          icon
          size="small"
          color="error"
          @click="removeLapso(index)"
          :disabled="formData.workLapses.length === 1"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-btn
        color="success"
        type="submit"
        class="submit-button mt-4"
        block
        large
      >
        Empezar
      </v-btn>
    </v-card>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        profession: '',
        workLapses: [{ startTime: null, endTime: null }]
      },
      professions: [
        'Desarrollador Full Stack',
        'Desarrollador Frontend',
        'Desarrollador Backend',
        'DevOps',
        'Ingeniero de Datos',
        'Arquitecto de Software',
        'Administrador de Sistemas',
        'QA / Tester',
        'Ingeniero de Seguridad',
        'Product Manager'
      ],
      timeOptions: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ]
    };
  },
  methods: {
    addLapso() {
      if (this.formData.workLapses.length < 2) {
        this.formData.workLapses.push({ startTime: null, endTime: null });
      }
    },
    removeLapso(index) {
      if (this.formData.workLapses.length > 1) {
        this.formData.workLapses.splice(index, 1);
      }
    },
    getStartTimeOptions(index) {
      if (index > 0) {
        const lastEndTime = this.formData.workLapses[index - 1].endTime;
        return this.timeOptions.slice(this.timeOptions.indexOf(lastEndTime) + 1);
      }
      return this.timeOptions;
    },
    getEndTimeOptions(startTime) {
      if (startTime) {
        return this.timeOptions.slice(this.timeOptions.indexOf(startTime) + 1);
      }
      return this.timeOptions;
    },
    submitForm() {
      const lapses = this.formData.workLapses.map(lapso => ({
        startTime: lapso.startTime,
        endTime: lapso.endTime
      }));

      localStorage.setItem('workLapses', JSON.stringify(lapses));
      this.$emit('submit', JSON.parse(JSON.stringify(this.formData)));
    }
  }
};
</script>

<style scoped>
.custom-card {
  background-color: var(--v-surface-base);
  color: var(--v-text-base);
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
}

.subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: var(--v-text-base);
  margin-bottom: 16px;
}

.lapso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lapso-container {
  display: flex;
  align-items: center;
}

.custom-select {
  font-family: 'Poppins', sans-serif;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-select .v-input__control {
  background-color: var(--v-surface-variant);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

.custom-select .v-label {
  color: var(--v-text-secondary);
  font-weight: 600;
  font-size: 14px;
}

.submit-button {
  background-color: var(--v-success-base);
  color: white;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: var(--v-success-darken);
}

.v-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
}

button.v-btn.v-btn--elevated.v-btn--icon.v-theme--light.bg-error.v-btn--density-default.v-btn--size-small.v-btn--variant-elevated,
button.v-btn.v-btn--disabled.v-btn--icon.v-theme--light.bg-error.v-btn--density-default.v-btn--size-small.v-btn--variant-elevated,
button.v-btn.v-btn--elevated.v-btn--icon.v-theme--dark.bg-error.v-btn--density-default.v-btn--size-small.v-btn--variant-elevated,
button.v-btn.v-btn--disabled.v-btn--icon.v-theme--dark.bg-error.v-btn--density-default.v-btn--size-small.v-btn--variant-elevated {
  margin-left: 2vh;
  position: relative;
  bottom: 1vh;
}

.v-btn,
.custom-select .v-input__control {
  transition: all 0.3s ease;
}
</style>
