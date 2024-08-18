<template>
  <v-container class="home-page" fluid>
    <v-row justify="center" class="form-row">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="pa-6 elevation-3 custom-card" rounded="lg">
          <v-card-title class="text-h5 text-center">Planifica tu Jornada</v-card-title>
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
/* Definimos el Pantone personalizado basado en blanco, morado y negro */
:root {
  --primary-color: #6A0DAD; /* Morado profundo */
  --background-color: #FFFFFF; /* Fondo blanco */
  --text-color: #1A1A1A; /* Negro para el texto */
  --button-color: #6A0DAD; /* Morado para botones */
  --button-hover-color: #4B0082; /* Un tono más oscuro de morado para hover */
  --card-background-color: #F0F0F0; /* Fondo gris claro para tarjetas */
  --divider-color: #E0E0E0; /* Color claro para el divisor */
}

.home-page {
  padding: 24px;
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilo para las tarjetas */
.custom-card {
  background-color: var(--card-background-color);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Tipografía moderna */
.v-card-title {
  font-family: 'Palo Alto', sans-serif;
  font-weight: 700;
  color: var(--text-color);
  font-size: 24px;
}

.v-card-text {
  font-family: 'Palo Alto', sans-serif;
  color: var(--text-color);
  font-size: 16px;
}

/* Botones minimalistas y modernos */
.custom-button {
  background-color: var(--button-color);
  color: white;
  border-radius: 30px;
  padding: 14px 28px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: background-color 0.3s ease, transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.custom-button:hover {
  background-color: var(--button-hover-color);
  transform: translateY(-2px);
}

/* Ajustes responsive para mobile */
@media (max-width: 600px) {
  .home-page {
    padding: 0;
    background-color: var(--background-color);
  }

  .form-row {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .custom-card {
    border-radius: 0;
    width: 100%;
    height: 100%;
    padding: 32px;
    box-shadow: none;
  }

  .v-card-title {
    font-size: 28px;
  }

  .v-card-text {
    font-size: 18px;
  }

  .custom-button {
    width: 100%;
    padding: 16px 0;
  }
}
</style>
