import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Importa Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Importa los componentes y directivas de Vuetify
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Define el tema de Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Puedes establecer 'dark' si prefieres modo oscuro por defecto
    themes: {
      light: {
        colors: {
          primary: '#6200EA', // Morado
          secondary: '#03DAC6', // Verde/Azul claro
          accent: '#FF4081', // Rosa brillante
          error: '#FF5252', // Rojo
          info: '#2196F3', // Azul
          success: '#4CAF50', // Verde
          warning: '#FFC107', // Amarillo
        },
      },
      dark: {
        colors: {
          primary: '#BB86FC', // Morado claro para modo oscuro
          secondary: '#03DAC6',
          accent: '#FF4081',
        },
      },
    },
  },
});

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
