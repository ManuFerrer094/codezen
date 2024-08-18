<template>
  <v-form @submit.prevent="submitForm">
    <v-card class="custom-card pa-6">
      <!-- Campo de Profesión -->
      <v-select
        v-model="formData.profession"
        :items="professions"
        label="Profesión"
        outlined
        required
        dense
        class="mb-4 custom-select"
      ></v-select>

      <!-- Añadir Lapsos de Tiempo -->
      <h3 class="subtitle mb-3">Añadir Lapsos de Tiempo</h3>
      <div v-for="(lapso, index) in formData.workLapses" :key="index" class="lapso-container mb-4">
        <v-select
          v-model="lapso.startTime"
          :items="timeOptions"
          label="Hora de Inicio"
          outlined
          dense
          required
          class="mr-2 custom-select"
        ></v-select>
        <v-select
          v-model="lapso.endTime"
          :items="timeOptions"
          label="Hora de Fin"
          outlined
          dense
          required
          class="ml-2 custom-select"
        ></v-select>
        <v-btn color="error" @click="removeLapso(index)" icon class="ml-2 custom-delete-btn">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <!-- Botón para agregar lapso -->
      <v-btn
        color="primary"
        @click="addLapso"
        class="add-button mt-4"
        block
        outlined
        large
      >
        Agregar Lapso
      </v-btn>

      <!-- Botón para enviar formulario -->
      <v-btn
        color="success"
        type="submit"
        class="submit-button mt-4"
        block
        large
      >
        Generar Bloques de Trabajo
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
        workLapses: [
          { startTime: null, endTime: null }
        ]
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
      this.formData.workLapses.push({ startTime: null, endTime: null });
    },
    removeLapso(index) {
      this.formData.workLapses.splice(index, 1);
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
/* Estilo personalizado para una apariencia más profunda y moderna */

/* Colores para el modo claro y oscuro */
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
  color: var(--v-text-base); /* Texto que se adapta al tema */
  margin-bottom: 16px;
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
  padding: 12px;
  border-radius: 8px;
}

.custom-select:hover .v-input__control {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-select .v-label {
  color: var(--v-text-secondary);
  font-weight: 600;
  font-size: 14px;
}

.custom-delete-btn {
  padding: 0;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  background-color: #ff6b6b;
  transition: background-color 0.3s ease;
}

.custom-delete-btn:hover {
  background-color: #ff4a4a;
}

.add-button {
  color: var(--v-primary-base);
  border-color: var(--v-primary-base);
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: var(--v-primary-base);
  color: white;
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

/* Transiciones suaves */
.v-btn,
.custom-select .v-input__control {
  transition: all 0.3s ease;
}
</style>
