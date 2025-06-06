import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home.vue';
import Task from '@/views/task.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/tasks',
    name: 'Task',
    component: Task,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
