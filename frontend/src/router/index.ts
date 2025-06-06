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
    name: 'Tasks',
    component: Task, // Fixed: Using Task component for tasks list
  },
  {
    path: '/task/:id',
    name: 'TaskDetail',
    component: Task, // Individual task detail can use the same component with different logic
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
