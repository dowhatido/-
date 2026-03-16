<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="bg-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
      <div class="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div class="relative group cursor-pointer" @click="openEditProfile">
          <img :src="user.avatar" :alt="user.name" class="w-24 h-24 rounded-full object-cover shadow-md" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <CameraIcon class="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h1 class="text-3xl font-bold text-ink">{{ user.name }}</h1>
            <button @click="openEditProfile" class="text-apple-blue hover:bg-apple-blue/10 p-1.5 rounded-full transition-colors">
              <Edit2Icon class="w-4 h-4" />
            </button>
          </div>
          <div class="flex items-center justify-center md:justify-start gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium w-max mx-auto md:mx-0">
            <ShieldCheckIcon class="w-4 h-4" />
            信用分 {{ user.creditScore }}
          </div>
        </div>
      </div>
      <button class="p-3 text-gray-text hover:bg-gray-bg rounded-full transition-colors">
        <SettingsIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Order Stats -->
    <div class="bg-white p-8 rounded-3xl shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-ink">我的订单</h2>
        <button @click="openOrders('全部')" class="text-sm text-gray-text hover:text-apple-blue flex items-center gap-1 transition-colors">
          全部订单 <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(order, index) in orders" :key="index" @click="openOrders(order.label)" class="flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer relative">
          <div v-if="order.count > 0" class="absolute top-2 right-1/4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
            {{ order.count }}
          </div>
          <component :is="order.icon" class="w-8 h-8 text-ink mb-3" stroke-width="1.5" />
          <span class="text-sm font-medium text-gray-text">{{ order.label }}</span>
        </div>
      </div>
    </div>

    <!-- Menu List -->
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
      <button 
        v-for="(item, index) in menuItems" 
        :key="index" 
        @click="handleMenuClick(item.label)"
        class="w-full flex items-center justify-between p-6 border-b border-black/5 last:border-0 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-4 text-ink">
          <component :is="item.icon" class="w-6 h-6 text-gray-text" />
          <span class="font-medium text-lg">{{ item.label }}</span>
        </div>
        <ChevronRightIcon class="w-6 h-6 text-gray-text" />
      </button>
      <button 
        @click="handleLogout"
        class="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors"
      >
        <div class="flex items-center gap-4 text-red-500">
          <LogOutIcon class="w-6 h-6" />
          <span class="font-medium text-lg">退出登录</span>
        </div>
      </button>
    </div>

    <!-- Edit Profile Modal -->
    <Transition name="modal">
      <div v-if="showEditProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showEditProfile = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
          <h2 class="text-2xl font-bold text-ink mb-6">修改个人资料</h2>
          <div class="flex flex-col items-center gap-4 mb-6">
            <div class="relative group cursor-pointer" @click="fileInput?.click()">
              <img :src="editForm.avatar" class="w-24 h-24 rounded-full object-cover shadow-sm" />
              <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <CameraIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            <p class="text-xs text-gray-text">点击更换头像</p>
          </div>
          <div class="mb-8">
            <label class="block text-sm text-gray-text mb-2">昵称</label>
            <input v-model="editForm.name" type="text" class="w-full bg-gray-bg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/50 text-ink font-medium" />
          </div>
          <div class="flex gap-4">
            <button @click="showEditProfile = false" class="flex-1 bg-gray-bg py-3 rounded-full font-medium text-ink hover:bg-gray-200 transition-colors">取消</button>
            <button @click="saveProfile" class="flex-1 bg-apple-blue text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors">保存</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Favorites Modal -->
    <Transition name="modal">
      <div v-if="showFavorites" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showFavorites = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
          <div class="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 class="text-xl font-bold text-ink">我的收藏</h2>
            <button @click="showFavorites = false" class="p-2 hover:bg-gray-bg rounded-full transition-colors"><XIcon class="w-6 h-6 text-gray-text" /></button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 space-y-4">
            <div v-for="item in favorites" :key="item.id" class="flex gap-4 items-center bg-gray-bg p-4 rounded-2xl cursor-pointer hover:bg-gray-200 transition-colors" @click="$router.push(`/equipment/${item.id}`)">
              <img :src="item.image" class="w-20 h-20 rounded-xl object-cover" referrerpolicy="no-referrer" />
              <div class="flex-1">
                <h3 class="font-bold text-ink line-clamp-1">{{ item.name }}</h3>
                <p class="text-apple-blue font-bold mt-2">¥{{ item.dailyRent }} <span class="text-xs font-normal text-gray-text">/ 天</span></p>
              </div>
              <button @click.stop="removeFavorite(item.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <HeartIcon class="w-6 h-6 fill-current" />
              </button>
            </div>
            <div v-if="favorites.length === 0" class="text-center text-gray-text py-8">暂无收藏</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Addresses Modal -->
    <Transition name="modal">
      <div v-if="showAddresses" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showAddresses = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
          <div class="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 class="text-xl font-bold text-ink">收货地址</h2>
            <button @click="showAddresses = false" class="p-2 hover:bg-gray-bg rounded-full transition-colors"><XIcon class="w-6 h-6 text-gray-text" /></button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 space-y-4">
            <div v-for="addr in addresses" :key="addr.id" class="bg-gray-bg p-5 rounded-2xl relative group">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-bold text-ink text-lg">{{ addr.name }}</span>
                <span class="text-gray-text font-medium">{{ addr.phone }}</span>
                <span v-if="addr.isDefault" class="bg-apple-blue/10 text-apple-blue text-xs px-2.5 py-0.5 rounded-full font-bold">默认</span>
              </div>
              <p class="text-sm text-ink leading-relaxed pr-8">{{ addr.detail }}</p>
              <button class="absolute top-5 right-5 text-apple-blue text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">编辑</button>
            </div>
            <button class="w-full py-5 border-2 border-dashed border-gray-300 rounded-2xl text-gray-text font-medium hover:border-apple-blue hover:text-apple-blue hover:bg-apple-blue/5 transition-all flex items-center justify-center gap-2">
              <PlusIcon class="w-5 h-5" /> 新增收货地址
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Customer Service Modal -->
    <Transition name="modal">
      <div v-if="showCustomerService" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showCustomerService = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center">
          <div class="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircleIcon class="w-8 h-8 text-apple-blue" />
          </div>
          <h2 class="text-2xl font-bold text-ink mb-2">联系客服</h2>
          <p class="text-gray-text mb-8 text-sm">工作时间：周一至周日 9:00-22:00</p>
          <div class="space-y-3">
            <button @click="openChatBox" class="w-full bg-apple-blue text-white py-3.5 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <MessageCircleIcon class="w-5 h-5" />
              在线客服
            </button>
            <button class="w-full bg-gray-bg text-ink py-3.5 rounded-full font-bold hover:bg-gray-200 transition-colors">
              拨打电话
            </button>
          </div>
          <button @click="showCustomerService = false" class="mt-6 text-gray-text hover:text-ink transition-colors text-sm font-medium">关闭</button>
        </div>
      </div>
    </Transition>

    <!-- Orders Modal -->
    <Transition name="modal">
      <div v-if="showOrders" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showOrders = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-3xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">
          <div class="p-6 border-b border-black/5 flex justify-between items-center bg-white z-10">
            <h2 class="text-xl font-bold text-ink">我的订单</h2>
            <button @click="showOrders = false" class="p-2 hover:bg-gray-bg rounded-full transition-colors"><XIcon class="w-6 h-6 text-gray-text" /></button>
          </div>
          
          <!-- Tabs -->
          <div class="flex overflow-x-auto hide-scrollbar border-b border-black/5 px-6 bg-white z-10 shrink-0">
            <button 
              v-for="tab in orderTabs" 
              :key="tab"
              @click="currentOrderTab = tab"
              class="px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
              :class="currentOrderTab === tab ? 'border-apple-blue text-apple-blue' : 'border-transparent text-gray-text hover:text-ink'"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Order List -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
            <div v-for="order in filteredOrders" :key="order.id" class="bg-white p-5 rounded-2xl shadow-sm">
              <div class="flex justify-between items-center mb-4 pb-4 border-b border-black/5">
                <span class="text-xs text-gray-text font-mono">订单号: {{ order.id }}</span>
                <span class="text-sm font-bold" :class="getStatusColor(order.status)">{{ order.status }}</span>
              </div>
              <div class="flex gap-4 mb-4">
                <img :src="order.image" class="w-20 h-20 rounded-xl object-cover" />
                <div class="flex-1">
                  <h3 class="font-bold text-ink line-clamp-1">{{ order.equipmentName }}</h3>
                  <p class="text-xs text-gray-text mt-1">租期: {{ order.startDate }} 至 {{ order.endDate }} ({{ order.days }}天)</p>
                  <p class="text-sm font-bold text-ink mt-2">总计: ¥{{ order.totalAmount }}</p>
                </div>
              </div>
              <div class="flex justify-end gap-3">
                <button v-if="order.status === '已完成' && !order.isReviewed" @click="openReviewModal(order)" class="px-4 py-2 bg-apple-blue text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-colors">去评价</button>
                <button v-if="order.status === '已完成' && order.isReviewed" class="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-full cursor-not-allowed">已评价</button>
                <button v-if="order.status === '待支付'" class="px-4 py-2 bg-apple-blue text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-colors">立即支付</button>
                <button v-if="order.status === '租借中'" class="px-4 py-2 border border-ink text-ink text-sm font-bold rounded-full hover:bg-gray-50 transition-colors">确认归还</button>
              </div>
            </div>
            <div v-if="filteredOrders.length === 0" class="text-center text-gray-text py-12">暂无相关订单</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Review Modal -->
    <Transition name="modal">
      <div v-if="showReviewModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showReviewModal = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
          <h2 class="text-2xl font-bold text-ink mb-2">评价设备</h2>
          <p class="text-sm text-gray-text mb-6">{{ currentReviewOrder?.equipmentName }}</p>
          
          <div class="flex justify-center gap-2 mb-8">
            <button v-for="i in 5" :key="i" @click="reviewForm.rating = i" class="p-1 transition-transform hover:scale-110">
              <StarIcon class="w-10 h-10" :class="i <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'" />
            </button>
          </div>

          <textarea v-model="reviewForm.content" placeholder="分享您的使用体验..." class="w-full bg-gray-bg rounded-2xl p-4 outline-none focus:ring-2 focus:ring-apple-blue/50 text-sm h-32 resize-none mb-6"></textarea>

          <div class="flex gap-4">
            <button @click="showReviewModal = false" class="flex-1 bg-gray-bg py-3 rounded-full font-medium text-ink hover:bg-gray-200 transition-colors">取消</button>
            <button @click="submitReview" class="flex-1 bg-apple-blue text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50" :disabled="!reviewForm.content.trim() || reviewForm.rating === 0">提交评价</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Chat Modal -->
    <Transition name="modal">
      <div v-if="showChatBox" class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showChatBox = false"></div>
        <div class="relative bg-white w-full h-[85vh] sm:h-[600px] sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden">
          <div class="p-4 border-b border-black/5 flex justify-between items-center bg-white z-10 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-apple-blue/10 rounded-full flex items-center justify-center">
                <MessageCircleIcon class="w-5 h-5 text-apple-blue" />
              </div>
              <div>
                <h3 class="font-bold text-ink text-sm">在线客服</h3>
                <p class="text-xs text-green-500 flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>当前在线</p>
              </div>
            </div>
            <button @click="showChatBox = false" class="p-2 hover:bg-gray-bg rounded-full transition-colors"><XIcon class="w-6 h-6 text-gray-text" /></button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 flex flex-col">
            <div v-for="msg in chatMessages" :key="msg.id" class="flex flex-col" :class="msg.sender === 'user' ? 'items-end' : 'items-start'">
              <div class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm" :class="msg.sender === 'user' ? 'bg-apple-blue text-white rounded-tr-sm' : 'bg-white text-ink shadow-sm rounded-tl-sm'">
                {{ msg.text }}
              </div>
              <span class="text-[10px] text-gray-400 mt-1 mx-1">{{ msg.time }}</span>
            </div>
          </div>

          <div class="p-4 bg-white border-t border-black/5 shrink-0">
            <div class="flex items-center gap-2 bg-gray-bg rounded-full p-1 pl-4">
              <input v-model="chatInput" @keyup.enter="sendMessage" type="text" placeholder="输入消息..." class="flex-1 bg-transparent outline-none text-sm text-ink" />
              <button @click="sendMessage" class="w-8 h-8 bg-apple-blue rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shrink-0 disabled:opacity-50" :disabled="!chatInput.trim()">
                <SendIcon class="w-4 h-4 -ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  SettingsIcon, ShieldCheckIcon, ClockIcon, PackageIcon, 
  CheckCircle2Icon, ChevronRightIcon, CameraIcon, HeartIcon, 
  MapPinIcon, MessageCircleIcon, Edit2Icon, XIcon, PlusIcon,
  StarIcon, SendIcon, LogOutIcon
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { isLoggedIn, currentUser, logout } = useAuth()

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
  } else if (currentUser.value) {
    user.value = { ...user.value, ...currentUser.value }
    editForm.value = { ...user.value }
  }
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    logout()
    router.push('/login')
  }
}

const user = ref({
  name: '摄影爱好者',
  avatar: 'https://picsum.photos/seed/myavatar/200/200',
  creditScore: 100
})

const orders = [
  { icon: ClockIcon, label: '待支付', count: 1 },
  { icon: PackageIcon, label: '待发货', count: 0 },
  { icon: CameraIcon, label: '租借中', count: 2 },
  { icon: CheckCircle2Icon, label: '已完成', count: 5 },
]

const menuItems = [
  { label: '我的收藏', icon: HeartIcon },
  { label: '收货地址', icon: MapPinIcon },
  { label: '联系客服', icon: MessageCircleIcon },
]

// Modal states
const showEditProfile = ref(false)
const showFavorites = ref(false)
const showAddresses = ref(false)
const showCustomerService = ref(false)

// Edit Profile
const fileInput = ref<HTMLInputElement | null>(null)
const editForm = ref({
  name: '',
  avatar: ''
})

const openEditProfile = () => {
  editForm.value = { ...user.value }
  showEditProfile.value = true
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    editForm.value.avatar = URL.createObjectURL(file)
  }
}

const saveProfile = () => {
  if (editForm.value.name.trim()) {
    user.value.name = editForm.value.name.trim()
    user.value.avatar = editForm.value.avatar
    showEditProfile.value = false
  }
}

// Favorites Data
const favorites = ref([
  { id: '1', name: 'Sony A7M4 全画幅微单相机', image: 'https://picsum.photos/seed/sony1/200/200', dailyRent: 150 },
  { id: '3', name: 'DJI Mavic 3 Pro 航拍无人机', image: 'https://picsum.photos/seed/dji1/200/200', dailyRent: 200 }
])

const removeFavorite = (id: string) => {
  favorites.value = favorites.value.filter(f => f.id !== id)
}

// Addresses Data
const addresses = ref([
  { id: '1', name: '张三', phone: '138****8000', detail: '北京市朝阳区望京SOHO T1 1001', isDefault: true },
  { id: '2', name: '李四', phone: '139****9000', detail: '上海市浦东新区陆家嘴环路1000号', isDefault: false }
])

// Menu Handler
const handleMenuClick = (label: string) => {
  if (label === '我的收藏') showFavorites.value = true
  if (label === '收货地址') showAddresses.value = true
  if (label === '联系客服') showCustomerService.value = true
}

// Orders logic
const showOrders = ref(false)
const orderTabs = ['全部', '待支付', '待发货', '租借中', '待验收', '已完成']
const currentOrderTab = ref('全部')
const ordersList = ref([
  { id: 'ORD1001', equipmentName: 'Sony A7M4 全画幅微单相机', image: 'https://picsum.photos/seed/sony1/200/200', startDate: '2026-03-10', endDate: '2026-03-13', days: 3, totalAmount: 450, status: '已完成', isReviewed: false },
  { id: 'ORD1002', equipmentName: 'DJI Mavic 3 Pro 航拍无人机', image: 'https://picsum.photos/seed/dji1/200/200', startDate: '2026-03-15', endDate: '2026-03-16', days: 1, totalAmount: 200, status: '租借中', isReviewed: false },
  { id: 'ORD1003', equipmentName: 'Canon EOS R5', image: 'https://picsum.photos/seed/canon1/200/200', startDate: '2026-03-20', endDate: '2026-03-22', days: 2, totalAmount: 600, status: '待支付', isReviewed: false }
])

const filteredOrders = computed(() => {
  if (currentOrderTab.value === '全部') return ordersList.value
  return ordersList.value.filter(o => o.status === currentOrderTab.value)
})

const openOrders = (tab: string = '全部') => {
  currentOrderTab.value = tab
  showOrders.value = true
}

const getStatusColor = (status: string) => {
  switch(status) {
    case '待支付': return 'text-orange-500'
    case '待发货': return 'text-blue-500'
    case '租借中': return 'text-apple-blue'
    case '已完成': return 'text-green-500'
    default: return 'text-gray-text'
  }
}

// Review logic
const showReviewModal = ref(false)
const currentReviewOrder = ref<any>(null)
const reviewForm = ref({ rating: 0, content: '' })

const openReviewModal = (order: any) => {
  currentReviewOrder.value = order
  reviewForm.value = { rating: 5, content: '' }
  showReviewModal.value = true
}

const submitReview = () => {
  if (currentReviewOrder.value) {
    currentReviewOrder.value.isReviewed = true
  }
  showReviewModal.value = false
}

// Chat logic
const showChatBox = ref(false)
const chatInput = ref('')
const chatMessages = ref([
  { id: 1, sender: 'cs', text: '您好！我是专属客服，请问有什么可以帮您？', time: '10:00' }
])

const openChatBox = () => {
  showCustomerService.value = false
  showChatBox.value = true
}

const sendMessage = () => {
  if (!chatInput.value.trim()) return
  
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  chatMessages.value.push({
    id: Date.now(),
    sender: 'user',
    text: chatInput.value.trim(),
    time: timeStr
  })
  
  chatInput.value = ''
  
  setTimeout(() => {
    chatMessages.value.push({
      id: Date.now(),
      sender: 'cs',
      text: '好的，我已经收到您的问题。稍后会有专员为您解答。',
      time: timeStr
    })
  }, 1000)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
