<template>
  <v-container class="my-reflections" fluid>
    <v-card class="pa-4 reflections-card">
      <v-card-title class="text-h5 reflections-title">Mis Reflexiones</v-card-title>
      <v-divider></v-divider>

      <!-- Sección de estadísticas -->
      <v-row class="stats-row">
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-title>Total Reflexiones</v-card-title>
            <v-card-text>{{ totalReflections }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-title>Fecha más reciente</v-card-title>
            <v-card-text>{{ latestReflectionDate }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-title>Fecha más antigua</v-card-title>
            <v-card-text>{{ earliestReflectionDate }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtros -->
      <v-row class="filters-row">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.text"
            label="Buscar por texto"
            outlined
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="filters.date"
                label="Buscar por fecha"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                clearable
              ></v-text-field>
            </template>
            <v-date-picker v-model="filters.date" @input="dateMenu = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Botón de exportar a PDF -->
      <v-btn color="primary" class="mb-4" @click="exportToPDF">Exportar a PDF</v-btn>

      <!-- Tabla de reflexiones -->
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredReflections"
          class="elevation-1 reflections-table"
          item-value="text"
          item-key="date"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  data() {
    return {
      headers: [
        { text: 'Fecha', value: 'date' },
        { text: 'Reflexión', value: 'text' }
      ],
      reflections: [],
      filters: {
        text: '',
        date: ''
      },
      dateMenu: false,
    };
  },
  computed: {
    totalReflections() {
      return this.reflections.length;
    },
    latestReflectionDate() {
      return this.reflections.length > 0
        ? this.reflections[0].date
        : 'N/A';
    },
    earliestReflectionDate() {
      return this.reflections.length > 0
        ? this.reflections[this.reflections.length - 1].date
        : 'N/A';
    },
    filteredReflections() {
      let filtered = this.reflections;

      if (this.filters.text) {
        filtered = filtered.filter(reflection =>
          reflection.text.toLowerCase().includes(this.filters.text.toLowerCase())
        );
      }

      if (this.filters.date) {
        filtered = filtered.filter(reflection =>
          reflection.date.startsWith(this.filters.date)
        );
      }

      return filtered;
    }
  },
  mounted() {
    this.loadReflections();
  },
  methods: {
    loadReflections() {
      this.reflections = JSON.parse(localStorage.getItem('reflections')) || [];
      this.reflections.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    exportToPDF() {
      const doc = new jsPDF();
      doc.text('Mis Reflexiones', 20, 20);

      // Generar la tabla con reflexiones
      doc.autoTable({
        head: [['Fecha', 'Reflexión']],
        body: this.filteredReflections.map(reflection => [reflection.date, reflection.text]),
      });

      doc.save('mis-reflexiones.pdf');
    }
  }
};
</script>

<style scoped>
.my-reflections {
  margin-top: 40px;
  background: linear-gradient(135deg, #6a00ff, #ff89e9);
  padding: 20px;
  border-radius: 15px;
}

.reflections-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 20px;
}

.reflections-title {
  font-size: 2rem;
  color: #6a00ff;
  text-align: center;
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  background-color: #f3f3f3;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.filters-row {
  margin-bottom: 20px;
}

.reflections-table {
  background-color: white;
  border-radius: 15px;
}

.v-btn {
  font-size: 18px;
  font-weight: bold;
  background-color: #6a00ff;
  color: white;
}

.v-btn:hover {
  background-color: #4b0082;
}
</style>
