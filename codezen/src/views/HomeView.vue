<template>
  <v-container class="home-page" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
          <v-divider></v-divider>
            <div v-if="!showForm" class="start-container">
              <v-btn color="primary" class="start-button" @click="startPlanning">Empezar Jornada</v-btn>
            </div>
            <div v-else>
              <FormSetup @submit="goToWorkBlocks" />
            </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormSetup from '@/components/FormSetup.vue';

export default {
  components: {
    FormSetup
  },
  data() {
    return {
      showForm: false // Estado para mostrar u ocultar el formulario
    };
  },
  methods: {
    startPlanning() {
      this.showForm = true; // Muestra el formulario al hacer clic en el botón
    },
    goToWorkBlocks(formData) {
      console.log('Datos recibidos en HomeView:', formData);

      if (formData && formData.age) {
        localStorage.setItem('userData', JSON.stringify(formData));
        this.$router.push({ name: 'WorkBlocks' });
      } else {
        console.error("No se han recibido datos correctos del formulario.");
      }
    }
  }
};
</script>

<style scoped>
.start-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* Altura ajustable según tus necesidades */
}

.start-button {
  font-size: 18px;
  padding: 10px 20px;
}
</style>
