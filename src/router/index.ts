import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/views/Home.vue'
import EquipmentDetail from '@/views/EquipmentDetail.vue'
import Community from '@/views/Community.vue'
import Profile from '@/views/Profile.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', component: Home },
        { path: 'equipment/:id', component: EquipmentDetail },
        { path: 'community', component: Community },
        { path: 'profile', component: Profile }
      ]
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
