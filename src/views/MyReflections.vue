<template>
  <div class="container my-reflections">
    <div class="card reflections-card">
      <div class="card-header reflections-title">Mis Reflexiones</div>
      <div class="card-body">
        <!-- Filtros -->
        <div class="row filter-row mb-4">
          <div class="col-md-4">
            <select v-model="filters.sentiment" class="form-select">
              <option value="">Filtrar por Ánimo</option>
              <option v-for="option in sentimentOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <input
              v-model="filters.text"
              type="text"
              class="form-control"
              placeholder="Buscar por Reflexión"
            />
          </div>
          <div class="col-md-4">
            <button @click="clearFilters" class="btn btn-primary">Limpiar Filtros</button>
          </div>
        </div>

        <!-- Botón de exportar a PDF -->
        <button @click="exportToPDF" class="btn btn-primary mb-4">Exportar a PDF</button>

        <!-- Tabla de reflexiones con encabezados estáticos y opciones de ordenamiento -->
        <div class="table-responsive">
          <table class="table reflections-table">
            <thead>
              <tr>
                <th @click="sortTable('date')">
                  Fecha
                  <span class="sort-icon" v-if="sortColumn === 'date'">
                    <svg
                      v-if="sortOrder === 'asc'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-up"
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-down"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('text')">
                  Reflexión
                  <span class="sort-icon" v-if="sortColumn === 'text'">
                    <svg
                      v-if="sortOrder === 'asc'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-up"
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-down"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('sentiment')">
                  Ánimo
                  <span class="sort-icon" v-if="sortColumn === 'sentiment'">
                    <svg
                      v-if="sortOrder === 'asc'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-up"
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-down"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </span>
                </th>
                <th @click="sortTable('hoursWorked')">
                  Horas Trabajadas
                  <span class="sort-icon" v-if="sortColumn === 'hoursWorked'">
                    <svg
                      v-if="sortOrder === 'asc'"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-up"
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-arrow-down"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(reflection, index) in paginatedReflections"
                :key="index"
                class="reflection-row"
              >
                <td>{{ reflection.date }}</td>
                <td>{{ reflection.text }}</td>
                <td>{{ reflection.sentiment }}</td>
                <td>{{ reflection.hoursWorked }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <nav aria-label="Page navigation example" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                Anterior
              </button>
            </li>
            <li
              class="page-item"
              :class="{ active: page === currentPage }"
              v-for="page in totalPages"
              :key="page"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const reflections = ref([])
const sentimentOptions = ref(['Happy', 'Neutral', 'Sad'])
const filters = ref({
  sentiment: '',
  text: ''
})
const sortColumn = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredReflections = computed(() => {
  let filtered = reflections.value.filter(reflection => {
    const matchesSentiment = filters.value.sentiment
      ? reflection.sentiment === filters.value.sentiment
      : true
    const matchesText = reflection.text
      .toLowerCase()
      .includes(filters.value.text.toLowerCase())
    return matchesSentiment && matchesText
  })

  if (sortColumn.value) {
    filtered = filtered.sort((a, b) => {
      const aValue = a[sortColumn.value]
      const bValue = b[sortColumn.value]

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  return filtered
})

const paginatedReflections = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReflections.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredReflections.value.length / itemsPerPage.value)
})

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const loadReflections = () => {
  reflections.value = JSON.parse(localStorage.getItem('reflections')) || []
}

const exportToPDF = () => {
  const doc = new jsPDF();

  // Detalles del usuario y fecha
  const name = 'Nombre Apellido'; // Reemplaza con el nombre y apellido del usuario
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  doc.setFontSize(12);
  doc.text(`Nombre: ${name}`, 70, 20);
  doc.text(`Fecha: ${day} de ${month} de ${year}`, 70, 30);

  // Título del documento
  doc.setFontSize(18);
  doc.text('Registro de Reflexiones', 20, 50);

  // Definir colores personalizados para el PDF
  const headerColor = [106, 0, 255]; // Color morado del header
  const headerTextColor = [255, 255, 255]; // Texto blanco
  const rowColorEven = [243, 243, 243]; // Color de fila par
  const rowColorOdd = [255, 255, 255]; // Color de fila impar
  const borderColor = [0, 0, 0]; // Color negro para las líneas de las celdas

  // Calcular el total de horas trabajadas
  const totalHoursWorked = reflections.value.reduce((total, reflection) => {
    return total + Number(reflection.hoursWorked);
  }, 0);

  // Generar la tabla con los colores definidos y bordes
  doc.autoTable({
    startY: 60, // Inicia la tabla debajo del título
    head: [['Fecha', 'Reflexión', 'Ánimo', 'Horas Trabajadas']],
    body: [
      ...reflections.value.map(reflection => [
        reflection.date,
        reflection.text,
        reflection.sentiment,
        reflection.hoursWorked,
      ]),
      // Fila de total de horas trabajadas
      [{ content: 'Total de Horas Trabajadas', colSpan: 3, styles: { halign: 'right', fillColor: rowColorOdd } }, totalHoursWorked.toString()],
    ],
    headStyles: {
      fillColor: headerColor,
      textColor: headerTextColor,
      lineWidth: 0.5, // Ancho de las líneas de borde en el header
      lineColor: borderColor,
    },
    alternateRowStyles: {
      fillColor: rowColorEven,
      lineWidth: 0.5, // Ancho de las líneas de borde en filas alternas
      lineColor: borderColor,
    },
    rowStyles: {
      fillColor: rowColorOdd,
      lineWidth: 0.5, // Ancho de las líneas de borde en filas impares
      lineColor: borderColor,
    },
    styles: {
      lineWidth: 0.5, // Ancho de las líneas de borde general
      lineColor: borderColor, // Color de las líneas de borde general
    },
  });

  // Espacio para firma, alineado con los dos puntos
  const signatureLineXStart = doc.getTextWidth('Firma del empleado: ') + 22; // Calcula la longitud del texto y ajusta el inicio
  doc.text('Firma del empleado:', 20, doc.autoTable.previous.finalY + 30);
  doc.line(signatureLineXStart, doc.autoTable.previous.finalY + 30, 150, doc.autoTable.previous.finalY + 30); // Línea para la firma

  // Guardar el PDF
  doc.save('registro-reflexiones.pdf');
};

const clearFilters = () => {
  filters.value.sentiment = ''
  filters.value.text = ''
}

const sortTable = column => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

onMounted(() => {
  loadReflections()
})
</script>

<style scoped>
.my-reflections {
  margin-top: 40px;
  padding: 20px;
}

.reflections-card {
  background-color: rgba(255, 255, 255, 0.9);
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

.filter-row {
  margin-bottom: 20px;
  justify-content: center;
}

.reflections-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.reflections-table th,
.reflections-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.reflections-table th {
  background-color: #6a00ff;
  color: white;
  cursor: pointer;
  position: relative;
}

.sort-icon {
  margin-left: 5px;
}

.reflections-table tr:nth-child(even) {
  background-color: #f3f3f3;
}

.reflections-table tr:hover {
  background-color: rgba(106, 0, 255, 0.2);
}

.btn-primary {
  background-color: #6a00ff;
  border-color: #6a00ff;
}

.btn-primary:hover {
  background-color: #4b0082;
  border-color: #4b0082;
}

.pagination .page-item.active .page-link {
  background-color: #6a00ff;
  border-color: #6a00ff;
}
</style>
