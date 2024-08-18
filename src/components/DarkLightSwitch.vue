<template>
    <div class="theme-switcher">
      <v-btn
        icon
        @click="toggleTheme"
        class="theme-toggle-btn"
        :aria-label="`Cambiar a ${isDarkTheme ? 'Light' : 'Dark'} Theme`"
      >
        <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
      </v-btn>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDarkTheme: false, // Inicializado con el tema claro
      };
    },
    mounted() {
      // Al montar, carga el tema preferido del usuario desde localStorage o usa 'light' como predeterminado
      const userPreferredTheme = localStorage.getItem('theme') || 'light';
      this.isDarkTheme = userPreferredTheme === 'dark';
      this.$vuetify.theme.global.name = userPreferredTheme;
    },
    methods: {
      toggleTheme() {
        // Cambia entre los temas claro y oscuro
        this.isDarkTheme = !this.isDarkTheme;
        const newTheme = this.isDarkTheme ? 'dark' : 'light';
        this.$vuetify.theme.global.name = newTheme;
        localStorage.setItem('theme', newTheme); // Guarda la preferencia del usuario
      },
    },
  };
  </script>
  
  <style scoped>
  .theme-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .theme-toggle-btn {
    color: var(--v-primary-base); /* Ajusta el color del botón al color primario del tema */
  }
  </style>
  