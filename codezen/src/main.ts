import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importar estilos de Vuetify
import '@mdi/font/css/materialdesignicons.css'; // Importar los íconos de Material Design

// Importar todos los componentes de Vuetify (si usas tree-shaking, ajusta esto)
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(router).use(vuetify).mount('#app');
