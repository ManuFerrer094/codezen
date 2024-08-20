<template>
  <div class="container my-reflections">
    <div class="card reflections-card">
      <div class="card-header reflections-title">Mis Reflexiones</div>
      <div class="card-body">
        <!-- Filtros -->
        <div class="row filter-row mb-4">
          <div class="col-md-4">
            <v-select
              v-model="filters.sentiment"
              :items="sentimentOptions"
              label="Filtrar por Ánimo"
              dense
              outlined
              class="custom-input"
            ></v-select>
          </div>
          <div class="col-md-4">
            <v-text-field
              v-model="filters.text"
              label="Buscar por Reflexión"
              dense
              outlined
              class="custom-input"
            ></v-text-field>
          </div>
          <div class="col-md-4">
            <v-btn @click="clearFilters" color="primary">Limpiar Filtros</v-btn>
          </div>
        </div>

        <!-- Botón de exportar a PDF -->
        <v-btn @click="exportToPDF" color="primary" class="mb-4">Exportar a PDF</v-btn>

        <!-- Tabla de reflexiones usando Bootstrap -->
        <div class="table-responsive">
          <table class="table reflections-table table-hover">
            <thead>
              <tr>
                <th @click="sortTable('date')">Fecha</th>
                <th @click="sortTable('text')">Reflexión</th>
                <th @click="sortTable('sentiment')">Ánimo</th>
                <th @click="sortTable('hoursWorked')">Horas Trabajadas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reflection, index) in paginatedReflections" :key="index">
                <td>{{ reflection.date }}</td>
                <td>{{ reflection.text }}</td>
                <td>{{ reflection.sentiment }}</td>
                <td>{{ reflection.hoursWorked }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          class="mt-4"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const reflections = ref([]);
const sentimentOptions = ref(['Happy', 'Neutral', 'Sad']);
const filters = ref({
  sentiment: '',
  text: ''
});
const sortColumn = ref('');
const sortOrder = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const filteredReflections = computed(() => {
  let filtered = reflections.value.filter(reflection => {
    const matchesSentiment = filters.value.sentiment
      ? reflection.sentiment === filters.value.sentiment
      : true;
    const matchesText = reflection.text
      .toLowerCase()
      .includes(filters.value.text.toLowerCase());
    return matchesSentiment && matchesText;
  });

  if (sortColumn.value) {
    filtered = filtered.sort((a, b) => {
      const aValue = a[sortColumn.value];
      const bValue = b[sortColumn.value];

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  return filtered;
});

const paginatedReflections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredReflections.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredReflections.value.length / itemsPerPage.value);
});

const loadReflections = () => {
  reflections.value = JSON.parse(localStorage.getItem('reflections')) || [];
};

const exportToPDF = () => {
  const doc = new jsPDF();

  // Configura el título del PDF
  doc.setFontSize(18);
  doc.setTextColor('#6a00ff');  // Título en color morado
  doc.text('Registro de Reflexiones', 20, 20);

  // Exporta la tabla con un estilo personalizado
  doc.autoTable({
    head: [['Fecha', 'Reflexión', 'Ánimo', 'Horas Trabajadas']],
    body: reflections.value.map(reflection => [
      reflection.date,
      reflection.text,
      reflection.sentiment,
      reflection.hoursWorked
    ]),
    // Estilos personalizados para que se asemeje a la tabla HTML
    headStyles: {
      fillColor: [106, 0, 255], // Color de fondo morado para el encabezado
      textColor: [255, 255, 255], // Color del texto blanco
      halign: 'left', // Alineación a la izquierda
      fontSize: 12,
      padding: 10
    },
    bodyStyles: {
      fillColor: [245, 245, 245], // Fondo gris claro para las celdas del cuerpo
      textColor: [0, 0, 0], // Color del texto negro
      fontSize: 10,
      padding: 10
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255] // Fondo blanco para filas alternas
    },
    margin: { top: 30 }, // Margen superior para evitar el título
    styles: {
      cellPadding: 4, // Espaciado dentro de las celdas
      overflow: 'linebreak', // Ajuste de texto si es largo
      valign: 'middle' // Alineación vertical al centro
    },
    theme: 'plain' // Usamos un tema plano sin bordes predefinidos
  });

  // Guarda el PDF con un nombre específico
  doc.save('registro-reflexiones.pdf');
};

const clearFilters = () => {
  filters.value.sentiment = '';
  filters.value.text = '';
};

const sortTable = column => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
};

onMounted(() => {
  loadReflections();
});
</script>

<style scoped>
.my-reflections {
  margin-top: 40px;
  padding: 20px;
}

.reflections-card {
  background-color: var(--v-surface-base);
  color: var(--v-text-base);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 20px;
}

.reflections-title {
  font-size: 2rem;
  color: var(--v-primary-base);
  text-align: center;
  margin-bottom: 20px;
}

.filter-row {
  margin-bottom: 20px;
  justify-content: center;
}

/* Estilos personalizados para la tabla usando Bootstrap */
.reflections-table th {
  background-color: #6a00ff; /* Siempre morado */
  color: white;
  text-align: left;
  padding: 12px;
}

.reflections-table td {
  padding: 12px;
  text-align: left;
  background-color: var(--v-surface-base); /* Fondo dinámico basado en el tema */
  color: var(--v-text-base); /* Color dinámico basado en el tema */
  border: 1px solid var(--v-border-color); /* Bordes dinámicos */
}

/* Estilos personalizados para inputs */
.custom-input .v-input__control {
  background-color: var(--v-surface-base);
  color: var(--v-text-base);
  border-color: var(--v-border-color);
}

.custom-input .v-input__control:hover {
  background-color: var(--v-surface-variant);
}

.custom-input .v-label {
  color: var(--v-text-base);
}

/* Bordes personalizados en modo claro y oscuro */
:root {
  --v-border-color: black;
}

@media (prefers-color-scheme: dark) {
  :root {
    --v-border-color: white;
  }
}
</style>
