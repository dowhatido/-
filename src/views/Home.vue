<template>
  <div class="space-y-12">
    <!-- Hero Section with Carousel and Search -->
    <section class="relative h-[60vh] min-h-[450px] rounded-3xl overflow-hidden bg-ink flex items-center justify-center shadow-lg">
      <!-- Carousel Backgrounds -->
      <div class="absolute inset-0 w-full h-full">
        <transition-group name="fade">
          <img 
            v-for="(img, index) in banners" 
            :key="img"
            v-show="currentBanner === index"
            :src="img" 
            alt="Hero Camera" 
            class="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerpolicy="no-referrer"
          />
        </transition-group>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"></div>
      
      <!-- Carousel Indicators -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button 
          v-for="(_, index) in banners" 
          :key="index"
          @click="currentBanner = index"
          class="h-2 rounded-full transition-all duration-300"
          :class="currentBanner === index ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'"
        ></button>
      </div>

      <div class="relative z-10 text-center px-4 w-full max-w-3xl">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">探索专业影像世界</h1>
        <p class="text-lg text-gray-200 mb-10 drop-shadow">发现适合你的完美摄影器材，随时随地开启创作之旅。</p>
        
        <!-- Search Bar -->
        <div class="relative max-w-xl mx-auto">
          <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <SearchIcon class="w-6 h-6 text-gray-400" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索设备名称、品牌..." 
            class="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:bg-white/20 transition-all text-lg shadow-lg"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section>
      <div class="flex gap-4 overflow-x-auto hide-scrollbar pb-4 px-2">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer',
            activeCategory === cat 
              ? 'bg-ink text-white shadow-md scale-105' 
              : 'bg-white text-ink hover:bg-gray-100 shadow-sm'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- Equipment List -->
    <section>
      <div class="flex justify-between items-end mb-6">
        <h2 class="text-2xl font-bold text-ink tracking-tight">
          {{ searchQuery ? '搜索结果' : (activeCategory === '全部' ? '推荐设备' : activeCategory) }}
        </h2>
        <span class="text-sm text-gray-text font-medium">共 {{ filteredEquipments.length }} 款设备</span>
      </div>
      
      <div v-if="filteredEquipments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <EquipmentCard 
          v-for="eq in filteredEquipments"
          :key="eq.id"
          v-bind="eq"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-20 text-center bg-white rounded-3xl shadow-sm">
        <div class="w-20 h-20 bg-gray-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchIcon class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-ink mb-2">未找到相关设备</h3>
        <p class="text-gray-text">尝试更换搜索词或分类筛选条件</p>
        <button 
          @click="resetFilters" 
          class="mt-6 text-apple-blue font-medium hover:underline"
        >
          清除筛选条件
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import EquipmentCard from '@/components/EquipmentCard.vue'

// --- Carousel Logic ---
const banners = [
  'https://picsum.photos/seed/camera-hero1/1920/1080',
  'https://picsum.photos/seed/camera-hero2/1920/1080',
  'https://picsum.photos/seed/camera-hero3/1920/1080'
]
const currentBanner = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.length
  }, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// --- Search & Category Logic ---
const searchQuery = ref('')
const activeCategory = ref('全部')
const categories = ['全部', '微单', '单反', '胶片相机', '镜头', '无人机', '运动相机', '稳定器', '灯光', '收音设备', '三脚架', '配件']

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = '全部'
}

// Mock Equipment Data
const equipments = ref([
  // 微单
  { id: '1', name: 'Sony A7M4 全画幅微单相机', category: '微单', brand: 'Sony', dailyRent: 150, image: 'https://picsum.photos/seed/sony1/600/600', rating: 4.9 },
  { id: '2', name: 'Canon EOS R5', category: '微单', brand: 'Canon', dailyRent: 220, image: 'https://picsum.photos/seed/canon1/600/600', rating: 4.8 },
  { id: '6', name: 'Nikon Z9 旗舰微单', category: '微单', brand: 'Nikon', dailyRent: 350, image: 'https://picsum.photos/seed/nikon1/600/600', rating: 4.9 },
  { id: '9', name: 'Fujifilm X-T5 半画幅微单', category: '微单', brand: 'Fujifilm', dailyRent: 130, image: 'https://picsum.photos/seed/fuji1/600/600', rating: 4.8 },
  { id: '10', name: 'Panasonic Lumix GH6', category: '微单', brand: 'Panasonic', dailyRent: 160, image: 'https://picsum.photos/seed/pana1/600/600', rating: 4.7 },
  // 单反
  { id: '11', name: 'Canon EOS 5D Mark IV', category: '单反', brand: 'Canon', dailyRent: 180, image: 'https://picsum.photos/seed/canon5d4/600/600', rating: 4.8 },
  { id: '12', name: 'Nikon D850', category: '单反', brand: 'Nikon', dailyRent: 190, image: 'https://picsum.photos/seed/nikond850/600/600', rating: 4.9 },
  // 胶片相机
  { id: '26', name: 'Leica M6 旁轴胶片相机', category: '胶片相机', brand: 'Leica', dailyRent: 250, image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=600', rating: 4.9 },
  { id: '27', name: 'Hasselblad 500C/M 中画幅', category: '胶片相机', brand: 'Hasselblad', dailyRent: 300, image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&q=80&w=600', rating: 4.9 },
  { id: '28', name: 'Contax T3 胶片傻瓜机', category: '胶片相机', brand: 'Contax', dailyRent: 180, image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&q=80&w=600', rating: 4.8 },
  // 镜头
  { id: '4', name: 'Sony FE 24-70mm f/2.8 GM II', category: '镜头', brand: 'Sony', dailyRent: 120, image: 'https://picsum.photos/seed/lens1/600/600', rating: 4.9 },
  { id: '7', name: 'Canon EF 70-200mm f/2.8L IS III', category: '镜头', brand: 'Canon', dailyRent: 100, image: 'https://picsum.photos/seed/lens2/600/600', rating: 4.8 },
  { id: '13', name: 'Sony FE 35mm f/1.4 GM', category: '镜头', brand: 'Sony', dailyRent: 90, image: 'https://picsum.photos/seed/lens3/600/600', rating: 4.9 },
  { id: '14', name: 'Sigma 24-70mm f/2.8 DG DN Art', category: '镜头', brand: 'Sigma', dailyRent: 80, image: 'https://picsum.photos/seed/lens4/600/600', rating: 4.7 },
  // 无人机
  { id: '3', name: 'DJI Mavic 3 Pro 航拍无人机', category: '无人机', brand: 'DJI', dailyRent: 300, image: 'https://picsum.photos/seed/dji1/600/600', rating: 4.9 },
  { id: '15', name: 'DJI Mini 4 Pro', category: '无人机', brand: 'DJI', dailyRent: 150, image: 'https://picsum.photos/seed/dji2/600/600', rating: 4.8 },
  // 运动相机
  { id: '16', name: 'GoPro Hero 12 Black', category: '运动相机', brand: 'GoPro', dailyRent: 60, image: 'https://picsum.photos/seed/gopro1/600/600', rating: 4.7 },
  { id: '17', name: 'Insta360 X3 全景相机', category: '运动相机', brand: 'Insta360', dailyRent: 70, image: 'https://picsum.photos/seed/insta1/600/600', rating: 4.8 },
  { id: '18', name: 'DJI Osmo Action 4', category: '运动相机', brand: 'DJI', dailyRent: 65, image: 'https://picsum.photos/seed/action4/600/600', rating: 4.8 },
  // 稳定器
  { id: '5', name: 'Zhiyun Weebill 3S 稳定器', category: '稳定器', brand: 'Zhiyun', dailyRent: 80, image: 'https://picsum.photos/seed/zhiyun1/600/600', rating: 4.7 },
  { id: '19', name: 'DJI RS 3 Pro 稳定器', category: '稳定器', brand: 'DJI', dailyRent: 120, image: 'https://picsum.photos/seed/rs3/600/600', rating: 4.9 },
  // 灯光
  { id: '8', name: 'Godox AD600Pro 影室闪光灯', category: '灯光', brand: 'Godox', dailyRent: 60, image: 'https://picsum.photos/seed/godox1/600/600', rating: 4.6 },
  { id: '20', name: 'Aputure 120d II 影视灯', category: '灯光', brand: 'Aputure', dailyRent: 90, image: 'https://picsum.photos/seed/aputure1/600/600', rating: 4.8 },
  // 收音设备
  { id: '21', name: 'Rode Wireless GO II 无线麦克风', category: '收音设备', brand: 'Rode', dailyRent: 50, image: 'https://picsum.photos/seed/rode1/600/600', rating: 4.8 },
  { id: '22', name: 'DJI Mic 2 无线收音系统', category: '收音设备', brand: 'DJI', dailyRent: 60, image: 'https://picsum.photos/seed/djimic/600/600', rating: 4.9 },
  // 三脚架
  { id: '23', name: 'Peak Design Travel Tripod 碳纤维', category: '三脚架', brand: 'Peak Design', dailyRent: 40, image: 'https://picsum.photos/seed/pd1/600/600', rating: 4.9 },
  // 配件
  { id: '24', name: 'PolarPro VND 2-5档 可调ND镜', category: '配件', brand: 'PolarPro', dailyRent: 20, image: 'https://picsum.photos/seed/polar1/600/600', rating: 4.7 },
  { id: '25', name: 'SanDisk 128GB CFexpress Type A', category: '配件', brand: 'SanDisk', dailyRent: 30, image: 'https://picsum.photos/seed/sandisk1/600/600', rating: 4.8 }
])

const filteredEquipments = computed(() => {
  return equipments.value.filter(eq => {
    const matchCategory = activeCategory.value === '全部' || eq.category === activeCategory.value
    const matchSearch = eq.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        eq.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
