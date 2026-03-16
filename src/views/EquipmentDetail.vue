<template>
  <div class="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[70vh]">
    <!-- Gallery -->
    <div class="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full">
      <img 
        :src="equipment.images[0]" 
        :alt="equipment.name" 
        class="w-full h-full object-cover absolute inset-0"
        referrerpolicy="no-referrer"
      />
    </div>

    <!-- Info -->
    <div class="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
      <div class="flex justify-between items-start mb-4">
        <h1 class="text-3xl lg:text-4xl font-bold text-ink leading-tight">{{ equipment.name }}</h1>
        <div class="flex items-center gap-1.5 bg-gray-bg px-3 py-1.5 rounded-full shrink-0">
          <StarIcon class="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span class="text-sm font-medium">{{ equipment.rating }}</span>
        </div>
      </div>
      
      <p class="text-gray-text text-base leading-relaxed mb-8">{{ equipment.description }}</p>
      
      <div class="grid grid-cols-2 gap-6 mb-10">
        <div class="bg-gray-bg p-4 rounded-2xl">
          <p class="text-sm text-gray-text mb-1">日租金</p>
          <p class="text-2xl font-bold text-ink">¥{{ equipment.dailyRent }}</p>
        </div>
        <div class="bg-gray-bg p-4 rounded-2xl">
          <p class="text-sm text-gray-text mb-1">押金</p>
          <p class="text-2xl font-bold text-ink">¥{{ equipment.deposit }}</p>
        </div>
      </div>

      <div class="mb-10">
        <h3 class="font-bold text-ink mb-4 text-lg">设备参数</h3>
        <div class="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div class="flex justify-between border-b border-black/5 pb-2">
            <span class="text-gray-text">品牌</span>
            <span class="font-medium">{{ equipment.brand }}</span>
          </div>
          <div class="flex justify-between border-b border-black/5 pb-2">
            <span class="text-gray-text">传感器</span>
            <span class="font-medium">全画幅</span>
          </div>
          <div class="flex justify-between border-b border-black/5 pb-2">
            <span class="text-gray-text">像素</span>
            <span class="font-medium">3300万</span>
          </div>
          <div class="flex justify-between border-b border-black/5 pb-2">
            <span class="text-gray-text">卡口</span>
            <span class="font-medium">E卡口</span>
          </div>
        </div>
      </div>

      <div class="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-text">总价 ({{ days }}天)</p>
          <p class="text-3xl font-bold text-ink">¥{{ totalPrice }}</p>
        </div>
        <button 
          @click="showCalendar = true"
          class="bg-apple-blue text-white px-10 py-4 rounded-full font-medium text-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          选择档期
        </button>
      </div>
    </div>
  </div>

  <!-- Reviews Section -->
  <div class="max-w-5xl mx-auto mt-8 bg-white rounded-3xl p-8 shadow-sm">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-ink">用户评价 <span class="text-gray-text text-lg font-normal">({{ reviews.length }})</span></h2>
      <div class="flex items-center gap-2">
        <span class="text-3xl font-bold text-ink">{{ equipment.rating }}</span>
        <div class="flex flex-col">
          <div class="flex gap-0.5">
            <StarIcon v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400 fill-current" />
          </div>
          <span class="text-xs text-gray-text mt-1">综合评分</span>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="review in reviews" :key="review.id" class="bg-gray-bg rounded-3xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img :src="review.avatar" class="w-10 h-10 rounded-full object-cover" referrerpolicy="no-referrer" />
            <div>
              <p class="font-bold text-ink text-sm">{{ review.userName }}</p>
              <p class="text-xs text-gray-text">{{ review.date }}</p>
            </div>
          </div>
          <div class="flex gap-1">
            <StarIcon v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" />
          </div>
        </div>
        <p class="text-ink text-sm leading-relaxed">{{ review.content }}</p>
      </div>
    </div>
  </div>

  <!-- Dialog for Calendar -->
  <Transition name="fade">
    <div v-if="showCalendar" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showCalendar = false"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all">
        <h3 class="text-2xl font-bold text-ink mb-6">选择租借时间</h3>
        
        <div class="bg-gray-bg rounded-2xl p-5 mb-8 flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <CalendarIcon class="w-6 h-6 text-apple-blue shrink-0 mt-1" />
            <div class="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-text mb-1">起租日期</label>
                <input type="date" v-model="startDate" :min="today" class="w-full bg-white px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink" />
              </div>
              <div>
                <label class="block text-xs text-gray-text mb-1">归还日期</label>
                <input type="date" v-model="endDate" :min="startDate" class="w-full bg-white px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink" />
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-black/5">
            <p class="text-sm text-gray-text">共 <span class="font-bold text-ink text-lg">{{ days }}</span> 天</p>
            <p class="text-sm text-gray-text">预计租金: <span class="font-bold text-apple-blue text-lg">¥{{ totalPrice }}</span></p>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            @click="showCalendar = false"
            class="flex-1 bg-gray-bg text-ink py-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button 
            @click="confirmBooking"
            class="flex-1 bg-apple-blue text-white py-4 rounded-2xl font-bold shadow-md hover:bg-blue-600 transition-colors"
          >
            确认档期
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Payment Modal -->
  <Transition name="fade">
    <div v-if="showPaymentModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center text-center">
        <template v-if="paymentStatus === 'processing'">
          <Loader2Icon class="w-16 h-16 text-apple-blue animate-spin mb-6" />
          <h3 class="text-xl font-bold text-ink mb-2">正在处理支付...</h3>
          <p class="text-sm text-gray-text mb-4">请勿关闭此页面</p>
          <div class="bg-gray-bg px-4 py-2 rounded-full">
            <span class="text-sm font-medium text-ink">支付总额: ¥{{ totalPayment }}</span>
          </div>
        </template>
        <template v-else-if="paymentStatus === 'success'">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon class="w-10 h-10 text-green-500" />
          </div>
          <h3 class="text-xl font-bold text-ink mb-2">支付成功！</h3>
          <p class="text-sm text-gray-text mb-8">您的订单已生成，状态：待发货</p>
          <button 
            @click="closePayment"
            class="w-full bg-apple-blue text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
          >
            完成
          </button>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon, CalendarIcon, CheckCircle2Icon, Loader2Icon, CheckCircleIcon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const showCalendar = ref(false)
const showPaymentModal = ref(false)
const paymentStatus = ref<'idle' | 'processing' | 'success'>('idle')

const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const nextDay = new Date()
nextDay.setDate(nextDay.getDate() + 3)
const endDate = ref(nextDay.toISOString().split('T')[0])

const days = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
})

const totalPrice = computed(() => days.value * equipment.dailyRent)
const totalPayment = computed(() => totalPrice.value + equipment.deposit)

const equipment = {
  name: 'Sony A7M4 全画幅微单相机',
  brand: 'Sony',
  dailyRent: 150,
  deposit: 5000,
  images: ['https://picsum.photos/seed/sony1/1200/1200'],
  rating: 4.9,
  reviews: 128,
  description: '采用新研发的约3300万像素全画幅背照式Exmor R CMOS影像传感器，实现出色的影像画质。适合专业摄影师与视频创作者。'
}

const reviews = ref([
  {
    id: 1,
    userName: '胶片狂热者',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    date: '2026-03-10',
    rating: 5,
    content: '相机成色非常新，按键反馈干脆，没有任何暗病。店家的包装也很用心，顺丰包邮第二天就到了，非常满意的一次租借体验！'
  },
  {
    id: 2,
    userName: '风光猎人',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100',
    date: '2026-03-05',
    rating: 4,
    content: '设备没得说，A7M4的对焦和画质确实是目前微单里的水桶机。唯一一点小遗憾是附带的电池健康度只有85%了，希望能定期更换一下电池。'
  }
])

const confirmBooking = () => {
  showCalendar.value = false
  showPaymentModal.value = true
  paymentStatus.value = 'processing'
  
  // 模拟网络请求和支付处理
  setTimeout(() => {
    paymentStatus.value = 'success'
  }, 1500)
}

const closePayment = () => {
  showPaymentModal.value = false
  paymentStatus.value = 'idle'
  router.push('/profile')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
