<template>
  <v-app>
    <!-- Navbar Responsivo -->
    <v-app-bar app color="primary" dark>
      <!-- Título que redirige a la home -->
      <v-toolbar-title>
        <router-link to="/" class="nav-title-link">RemoteZen</router-link>
      </v-toolbar-title>

      <!-- Enlaces de navegación en desktop -->
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn to="/" class="nav-link">Inicio</v-btn>
        <v-btn to="/my-reflections" class="nav-link">Mis Reflexiones</v-btn>
        <v-btn to="/end-of-day" class="nav-link">Final</v-btn>
      </v-toolbar-items>

      <!-- Switch Dark/Light Mode -->
      <DarkLightSwitch />

      <!-- Botón de menú para móviles -->
      <v-btn icon @click="drawer = !drawer" class="d-md-none">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Drawer de navegación para móvil -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      left
      class="d-md-none custom-drawer"
    >
      <v-list>
        <v-list-item to="/" @click="drawer = false">Inicio</v-list-item>
        <v-list-item to="/my-reflections" @click="drawer = false">Mis Reflexiones</v-list-item>
        <v-list-item to="/end-of-day" @click="drawer = false">Final</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import DarkLightSwitch from '@/components/DarkLightSwitch.vue';

export default {
  name: 'App',
  components: {
    DarkLightSwitch,
  },
  data() {
    return {
      drawer: false, // Controla el estado del drawer en móviles
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados para el navbar */
.nav-link {
  font-weight: bold;
  color: white;
  text-transform: uppercase;
}

.nav-link:hover {
  color: #ffffffcc; /* Cambia a un blanco más claro al hacer hover */
}

.nav-title-link {
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}

.nav-title-link:hover {
  color: #ffffffcc; /* Efecto hover para el título */
}

.v-app-bar {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  display: flex;
  align-items: center; /* Asegura que los elementos se alineen verticalmente en el centro */
}

/* Clases de Vuetify para hacer responsive */
.d-none {
  display: none !important;
}

.d-md-flex {
  display: flex !important;
}

.d-md-none {
  display: none !important;
}

@media (max-width: 960px) {
  .d-md-none {
    display: flex !important;
  }
  .d-md-flex {
    display: none !important;
  }
}

.theme-switch-container {
  margin-left: 16px; /* Espaciado a la izquierda del switch */
}

.v-toolbar-title {
  margin-right: 16px; /* Asegura espacio entre el título y los enlaces */
}

/* Estilos personalizados para el v-navigation-drawer en modo oscuro */
.custom-drawer {
  background-color: var(--v-surface-base) !important; /* Ajusta el fondo al color del tema */
  border-right: 1px solid var(--v-border-color) !important; /* Ajusta el borde al color del tema */
}

@media (prefers-color-scheme: dark) {
  .custom-drawer {
    background-color: #121212 !important; /* Fondo oscuro para el drawer */
    border-right: 1px solid #121212 !important; /* Borde oscuro */
  }
}
</style>
