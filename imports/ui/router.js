import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/categories',
      name: 'categories',
      component:()=>import('./pages/Categories.vue'),
    },
    {
      path: '/',
      name: 'items',
      component:()=>import('./pages/Items.vue'),
    },
    // {
    //   path: '/image',
    //   name: 'image',
    //   component:()=>import('./pages/ImageShow.vue'),
    // },
  ]
});
