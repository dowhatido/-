<template>
  <div class="min-h-screen bg-gray-bg text-ink font-sans">
    <!-- Top Navigation -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <router-link to="/" class="text-xl font-bold tracking-tight text-ink">LensShare</router-link>
            <nav class="hidden md:flex gap-6">
              <router-link to="/" class="text-sm font-medium hover:text-apple-blue transition-colors" active-class="text-apple-blue">探索设备</router-link>
              <router-link to="/community" class="text-sm font-medium hover:text-apple-blue transition-colors" active-class="text-apple-blue">动态广场</router-link>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <template v-if="isLoggedIn">
              <router-link to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <img :src="currentUser?.avatar || 'https://picsum.photos/seed/myavatar/100/100'" alt="Avatar" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                </div>
                <span class="text-sm font-medium hidden md:block">个人中心</span>
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm font-medium bg-apple-blue text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
                登录 / 注册
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view></router-view>
    </main>

    <!-- Mobile Bottom Tab Bar (only visible on small screens when not in equipment detail) -->
    <div v-if="!hideTabBar" class="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div class="bg-white/80 backdrop-blur-xl border-t border-black/5 px-6 py-3 flex justify-between items-center">
        <router-link to="/" class="flex flex-col items-center gap-1 transition-colors" active-class="text-apple-blue">
          <HomeIcon class="w-6 h-6" :class="isActive('/') ? 'text-apple-blue' : 'text-gray-text'" />
          <span class="text-[10px] font-medium" :class="isActive('/') ? 'text-apple-blue' : 'text-gray-text'">探索</span>
        </router-link>
        <router-link to="/community" class="flex flex-col items-center gap-1 transition-colors" active-class="text-apple-blue">
          <CompassIcon class="w-6 h-6" :class="isActive('/community') ? 'text-apple-blue' : 'text-gray-text'" />
          <span class="text-[10px] font-medium" :class="isActive('/community') ? 'text-apple-blue' : 'text-gray-text'">社区</span>
        </router-link>
        <router-link to="/profile" class="flex flex-col items-center gap-1 transition-colors" active-class="text-apple-blue">
          <UserIcon class="w-6 h-6" :class="isActive('/profile') ? 'text-apple-blue' : 'text-gray-text'" />
          <span class="text-[10px] font-medium" :class="isActive('/profile') ? 'text-apple-blue' : 'text-gray-text'">我的</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, CompassIcon, UserIcon } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { isLoggedIn, currentUser } = useAuth()

const hideTabBar = computed(() => {
  return route.path.startsWith('/equipment/')
})

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
