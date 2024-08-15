import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import WorkBlocks from '@/views/WorkBlocks.vue';
import EndOfDay from '@/components/EndOfDay.vue';
import MyReflections from '@/views/MyReflections.vue';  // Importa la nueva vista

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/work-blocks',
    name: 'WorkBlocks',
    component: WorkBlocks
  },
  {
    path: '/end-of-day',
    name: 'EndOfDay',
    component: EndOfDay
  },
  {
    path: '/my-reflections',
    name: 'MyReflections',
    component: MyReflections   // Añade la ruta
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
