<template>
  <v-container class="home-page" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Planifica tu Jornada</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <FormSetup @submit="goToWorkBlocks" />
          </v-card-text>
        </v-card>
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
  methods: {
    goToWorkBlocks(formData) {
      console.log('Datos recibidos en HomeView:', formData);

      if (formData && formData.profession && formData.workLapses.length > 0) {
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
