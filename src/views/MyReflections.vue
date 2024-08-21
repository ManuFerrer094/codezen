<template>
  <div class="container my-reflections">
    <div class="card reflections-card">
      <div class="card-header reflections-title">Mis Reflexiones</div>
      <div class="card-body">
        <v-btn @click="exportToPDF" color="primary" class="mb-4">Exportar a PDF</v-btn>
        <div class="table-responsive">
          <table class="table reflections-table table-hover">
            <thead>
              <tr>
                <th @click="sortTable('date')">
                  Fecha
                  <span v-if="sortColumn === 'date'">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V4.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 4.707V11.5A.5.5 0 0 1 8 12z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v6.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 11.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('text')">
                  Reflexión
                  <span v-if="sortColumn === 'text'">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V4.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 4.707V11.5A.5.5 0 0 1 8 12z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v6.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 11.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('sentiment')">
                  Ánimo
                  <span v-if="sortColumn === 'sentiment'">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V4.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 4.707V11.5A.5.5 0 0 1 8 12z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v6.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1-.708-.708L7.5 11.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('hoursWorked')">
                  Horas Trabajadas
                  <span v-if="sortColumn === 'hoursWorked'">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V4.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 4.707V11.5A.5.5 0 0 1 8 12z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v6.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 11.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                  </span>
                </th>
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
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortColumn = ref(null);
const sortDirection = ref('asc');

const loadReflections = () => {
  reflections.value = JSON.parse(localStorage.getItem('reflections')) || [];
};

const sortTable = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  reflections.value.sort((a, b) => {
    let comparison = 0;
    if (a[column] > b[column]) {
      comparison = 1;
    } else if (a[column] < b[column]) {
      comparison = -1;
    }
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
};

const paginatedReflections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return reflections.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(reflections.value.length / itemsPerPage.value);
});

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor('#6a00ff');
  doc.text('Registro de Reflexiones', 20, 20);
  doc.autoTable({
    head: [['Fecha', 'Reflexión', 'Ánimo', 'Horas Trabajadas']],
    body: reflections.value.map(reflection => [
      reflection.date,
      reflection.text,
      reflection.sentiment,
      reflection.hoursWorked
    ]),
    headStyles: {
      fillColor: [106, 0, 255],
      textColor: [255, 255, 255],
      halign: 'left',
      fontSize: 12,
      padding: 10
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
      fontSize: 10,
      padding: 10
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: { top: 30 },
    styles: {
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'middle'
    },
    theme: 'plain'
  });
  doc.save('registro-reflexiones.pdf');
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

.reflections-table th {
  background-color: #6a00ff;
  color: white;
  text-align: left;
  padding: 12px;
  cursor: pointer;
}

.reflections-table td {
  padding: 12px;
  text-align: left;
  background-color: var(--v-surface-base);
  color: var(--v-text-base);
  border: 1px solid var(--v-border-color);
}

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

:root {
  --v-border-color: black;
}

@media (prefers-color-scheme: dark) {
  :root {
    --v-border-color: white;
  }
}
</style>
