<template>
  <div class="min-h-screen bg-gray-bg flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-ink mb-2">{{ isLogin ? '欢迎回来' : '创建账号' }}</h1>
        <p class="text-sm text-gray-text">LensShare - 摄影设备租借社区</p>
      </div>

      <!-- Toggle Login/Register -->
      <div class="flex bg-gray-bg rounded-full p-1 mb-8">
        <button 
          @click="isLogin = true" 
          class="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
          :class="isLogin ? 'bg-white text-ink shadow-sm' : 'text-gray-text hover:text-ink'"
        >
          登录
        </button>
        <button 
          @click="isLogin = false" 
          class="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
          :class="!isLogin ? 'bg-white text-ink shadow-sm' : 'text-gray-text hover:text-ink'"
        >
          注册
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        
        <!-- Registration Type Toggle (Only for Register) -->
        <div v-if="!isLogin" class="flex gap-4 mb-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="regType" value="phone" class="text-apple-blue focus:ring-apple-blue" />
            <span class="text-sm text-ink font-medium">手机号注册</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="regType" value="email" class="text-apple-blue focus:ring-apple-blue" />
            <span class="text-sm text-ink font-medium">邮箱注册</span>
          </label>
        </div>

        <!-- Inputs -->
        <div>
          <label class="block text-sm font-medium text-gray-text mb-1.5">
            {{ isLogin ? '账号 (手机号/邮箱)' : (regType === 'phone' ? '手机号' : '邮箱') }}
          </label>
          <input 
            v-model="form.account" 
            :type="regType === 'email' && !isLogin ? 'email' : 'text'" 
            required
            class="w-full bg-gray-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink transition-all"
            :placeholder="isLogin ? '请输入手机号或邮箱' : (regType === 'phone' ? '请输入手机号' : '请输入邮箱')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-text mb-1.5">密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full bg-gray-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink transition-all"
            placeholder="请输入密码"
          />
        </div>

        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-text mb-1.5">确认密码</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required
            class="w-full bg-gray-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink transition-all"
            placeholder="请再次输入密码"
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full bg-apple-blue text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors mt-4 flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <Loader2Icon v-if="loading" class="w-5 h-5 animate-spin" />
          {{ isLogin ? '登录' : '注册' }}
        </button>
      </form>

      <!-- Back to Home -->
      <div class="mt-8 text-center">
        <router-link to="/" class="text-sm text-gray-text hover:text-apple-blue transition-colors">
          暂不登录，先去逛逛
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2Icon } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const isLogin = ref(true)
const regType = ref<'phone' | 'email'>('phone')
const loading = ref(false)

const form = ref({
  account: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async () => {
  if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  loading.value = true
  
  // Mock API call
  setTimeout(() => {
    loading.value = false
    
    // Mock user data
    const mockUser = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name: form.value.account.split('@')[0] || '新用户',
      avatar: 'https://picsum.photos/seed/' + form.value.account + '/100/100',
      creditScore: 100
    }
    
    login(mockUser)
    
    // Redirect to home or previous page
    router.push('/')
  }, 1000)
}
</script>
