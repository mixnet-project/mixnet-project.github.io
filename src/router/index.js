import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Calculator from '../components/Calculator.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/network',
    name: 'Network',
    component: () => import('@/components/NetworkView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 