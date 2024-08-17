<template>
  <v-form @submit.prevent="submitForm">
    <v-card-title class="text-h5">Planifica tu Jornada</v-card-title>
    <!-- Campo de Profesión -->
    <v-select v-model="formData.profession" :items="professions" label="Profesión" outlined required></v-select>

    <h3>Añadir Lapsos de Tiempo</h3>
    <div v-for="(lapso, index) in formData.workLapses" :key="index" class="lapso-container">
      <v-select
        v-model="lapso.startTime"
        :items="timeOptions"
        label="Hora de Inicio"
        outlined
        required
      ></v-select>
      <v-select
        v-model="lapso.endTime"
        :items="timeOptions"
        label="Hora de Fin"
        outlined
        required
      ></v-select>
      <v-btn color="error" @click="removeLapso(index)" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <v-btn color="primary" @click="addLapso" class="mt-4">Agregar Lapso</v-btn>
    
    <v-btn color="primary" type="submit" class="mt-4">Generar Bloques de Trabajo</v-btn>
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
      // Emitir los datos como un objeto plano
      this.$emit('submit', JSON.parse(JSON.stringify(this.formData)));
    }
  }
};
</script>

<style scoped>
.lapso-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
