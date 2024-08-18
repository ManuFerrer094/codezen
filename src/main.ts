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

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
