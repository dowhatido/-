<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-ink">动态广场</h1>
      <button 
        @click="showPublish = true"
        class="bg-apple-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
      >
        <PlusIcon class="w-5 h-5" />
        发布动态
      </button>
    </div>

    <div class="space-y-8">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-4 mb-4">
          <img :src="post.avatar" :alt="post.author" class="w-12 h-12 rounded-full object-cover" referrerpolicy="no-referrer" />
          <div>
            <h3 class="font-medium text-ink text-lg">{{ post.author }}</h3>
            <p class="text-sm text-gray-text">2小时前</p>
          </div>
        </div>
        
        <p class="text-base text-ink leading-relaxed mb-4">{{ post.content }}</p>

        <div class="relative w-full rounded-2xl overflow-hidden bg-gray-100 max-h-[600px]">
          <img :src="post.image" alt="" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
          
          <router-link 
            v-if="post.equipment"
            :to="`/equipment/${post.equipment.id}`"
            class="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <CameraIcon class="w-4 h-4" />
            {{ post.equipment.name }}
          </router-link>
        </div>

        <!-- Interaction Bar -->
        <div class="flex items-center gap-6 mt-4 pt-4 border-t border-black/5">
          <button @click="toggleLike(post)" class="flex items-center gap-2 text-gray-text hover:text-red-500 transition-colors" :class="{'text-red-500': post.isLiked}">
            <HeartIcon class="w-6 h-6" :class="{'fill-current': post.isLiked}" />
            <span class="font-medium">{{ post.likes }}</span>
          </button>
          <button @click="post.showComments = !post.showComments" class="flex items-center gap-2 text-gray-text hover:text-apple-blue transition-colors" :class="{'text-apple-blue': post.showComments}">
            <MessageCircleIcon class="w-6 h-6" :class="{'fill-current': post.showComments}" />
            <span class="font-medium">{{ post.comments.length }}</span>
          </button>
          <button class="flex items-center gap-2 text-gray-text hover:text-ink transition-colors ml-auto">
            <ShareIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Comments Section -->
        <div v-if="post.showComments" class="mt-4 pt-4 border-t border-black/5">
          <div class="space-y-4 mb-4">
            <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
              <img :src="comment.avatar" class="w-8 h-8 rounded-full object-cover" referrerpolicy="no-referrer" />
              <div class="bg-gray-bg rounded-2xl px-4 py-2 flex-1">
                <p class="text-sm font-medium text-ink">{{ comment.author }}</p>
                <p class="text-sm text-gray-text mt-0.5">{{ comment.content }}</p>
              </div>
            </div>
            <div v-if="post.comments.length === 0" class="text-center text-sm text-gray-400 py-4">
              暂无评论，快来抢沙发吧！
            </div>
          </div>
          <div class="flex gap-3 items-center">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-8 h-8 rounded-full bg-gray-200" />
            <div class="flex-1 relative">
              <input 
                v-model="post.newComment" 
                @keyup.enter="submitComment(post)" 
                type="text" 
                placeholder="添加评论..." 
                class="w-full bg-gray-bg rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-apple-blue/50 pr-10" 
              />
              <button 
                @click="submitComment(post)" 
                class="absolute right-2 top-1/2 -translate-y-1/2 text-apple-blue p-1 hover:bg-apple-blue/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent" 
                :disabled="!post.newComment?.trim()"
              >
                <SendIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Publish Modal -->
    <Transition name="modal">
      <div v-if="showPublish" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showPublish = false"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 class="text-xl font-bold text-ink">发布新动态</h2>
            <button @click="showPublish = false" class="p-2 text-gray-text hover:bg-gray-bg rounded-full transition-colors">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto">
            <textarea 
              placeholder="分享你的摄影故事、设备评测..." 
              class="w-full h-40 outline-none resize-none text-lg placeholder:text-gray-text/60"
            ></textarea>
            
            <div class="mb-8">
              <input type="file" ref="fileInput" accept="image/*,video/*" class="hidden" @change="handleFileUpload" />
              
              <div v-if="previewUrl" class="relative w-32 h-32 rounded-2xl overflow-hidden group">
                <img v-if="mediaType === 'image'" :src="previewUrl" class="w-full h-full object-cover" />
                <video v-else-if="mediaType === 'video'" :src="previewUrl" class="w-full h-full object-cover" autoplay muted loop></video>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button @click="clearMedia" class="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors">
                    <XIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div v-else @click="fileInput?.click()" class="w-32 h-32 bg-gray-bg rounded-2xl flex flex-col items-center justify-center text-gray-text gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
                <PlusIcon class="w-8 h-8" />
                <span class="text-sm font-medium">添加图片/视频</span>
              </div>
            </div>

            <div class="border-t border-black/5 pt-6 relative">
              <div v-if="!selectedEquipment">
                <button @click="showEquipmentSelector = !showEquipmentSelector" class="w-full flex items-center justify-between p-4 bg-gray-bg rounded-2xl hover:bg-gray-200 transition-colors">
                  <div class="flex items-center gap-3 text-ink">
                    <CameraIcon class="w-5 h-5 text-apple-blue" />
                    <span class="text-base font-medium">关联拍摄器材</span>
                  </div>
                  <ChevronRightIcon class="w-5 h-5 text-gray-text transition-transform" :class="{'rotate-90': showEquipmentSelector}" />
                </button>
              </div>
              <div v-else class="w-full flex items-center justify-between p-4 bg-apple-blue/10 border border-apple-blue/20 rounded-2xl">
                <div class="flex items-center gap-3 text-apple-blue">
                  <CameraIcon class="w-5 h-5" />
                  <span class="text-base font-medium">{{ selectedEquipment.name }}</span>
                </div>
                <button @click="selectedEquipment = null" class="p-1 hover:bg-apple-blue/20 rounded-full text-apple-blue transition-colors">
                  <XIcon class="w-5 h-5" />
                </button>
              </div>

              <!-- Equipment Selector Dropdown -->
              <Transition name="fade">
                <div v-if="showEquipmentSelector && !selectedEquipment" class="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                  <div class="p-3 border-b border-gray-50">
                    <input v-model="equipmentSearchQuery" type="text" placeholder="搜索器材名称..." class="w-full px-4 py-2 bg-gray-bg rounded-xl outline-none focus:ring-2 focus:ring-apple-blue/50 text-sm" />
                  </div>
                  <div class="max-h-48 overflow-y-auto hide-scrollbar">
                    <button 
                      v-for="eq in filteredEquipments" 
                      :key="eq.id"
                      @click="selectEquipment(eq)"
                      class="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-ink border-b border-gray-50 last:border-0 transition-colors"
                    >
                      {{ eq.name }}
                    </button>
                    <div v-if="filteredEquipments.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
                      未找到相关器材
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="p-6 border-t border-black/5 flex justify-end">
            <button 
              @click="showPublish = false"
              class="bg-apple-blue text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
              立即发布
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, CameraIcon, XIcon, ChevronRightIcon, HeartIcon, MessageCircleIcon, ShareIcon, SendIcon } from 'lucide-vue-next'

const showPublish = ref(false)
const showEquipmentSelector = ref(false)
const equipmentSearchQuery = ref('')
const selectedEquipment = ref<{id: string, name: string} | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const mediaType = ref<'image' | 'video' | null>(null)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    mediaType.value = file.type.startsWith('video/') ? 'video' : 'image'
    previewUrl.value = URL.createObjectURL(file)
  }
}

const clearMedia = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
  mediaType.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const availableEquipments = [
  { id: '1', name: 'Sony A7M4 全画幅微单相机' },
  { id: '2', name: 'Canon EOS R5' },
  { id: '3', name: 'DJI Mavic 3 Pro 航拍无人机' },
  { id: '4', name: 'Sony FE 24-70mm f/2.8 GM II' },
  { id: '5', name: 'Zhiyun Weebill 3S 稳定器' },
  { id: '6', name: 'Nikon Z9 旗舰微单' },
  { id: '7', name: 'Canon EF 70-200mm f/2.8L IS III' },
  { id: '8', name: 'Godox AD600Pro 影室闪光灯' },
  { id: '9', name: 'Fujifilm X-T5 半画幅微单' },
  { id: '10', name: 'Panasonic Lumix GH6' },
  { id: '11', name: 'Canon EOS 5D Mark IV' },
  { id: '12', name: 'Nikon D850' },
  { id: '13', name: 'Sony FE 35mm f/1.4 GM' },
  { id: '14', name: 'Sigma 24-70mm f/2.8 DG DN Art' },
  { id: '15', name: 'DJI Mini 4 Pro' },
  { id: '16', name: 'GoPro Hero 12 Black' },
  { id: '17', name: 'Insta360 X3 全景相机' },
  { id: '18', name: 'DJI Osmo Action 4' },
  { id: '19', name: 'DJI RS 3 Pro 稳定器' },
  { id: '20', name: 'Aputure 120d II 影视灯' },
  { id: '21', name: 'Rode Wireless GO II 无线麦克风' },
  { id: '22', name: 'DJI Mic 2 无线收音系统' },
  { id: '23', name: 'Peak Design Travel Tripod 碳纤维' },
  { id: '24', name: 'PolarPro VND 2-5档 可调ND镜' },
  { id: '25', name: 'SanDisk 128GB CFexpress Type A' },
  { id: '26', name: 'Leica M6 旁轴胶片相机' },
  { id: '27', name: 'Hasselblad 500C/M 中画幅' },
  { id: '28', name: 'Contax T3 胶片傻瓜机' }
]

const filteredEquipments = computed(() => {
  if (!equipmentSearchQuery.value) return availableEquipments
  return availableEquipments.filter(e => e.name.toLowerCase().includes(equipmentSearchQuery.value.toLowerCase()))
})

const selectEquipment = (eq: {id: string, name: string}) => {
  selectedEquipment.value = eq
  showEquipmentSelector.value = false
  equipmentSearchQuery.value = ''
}

const posts = ref([
  {
    id: '1',
    author: '胶片狂热者',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    content: '带着 Leica M6 穿梭在老城区的街头，黄铜机身的质感和过片时的机械声让人着迷。柯达 Portra 400 的色彩依旧是那么温暖，记录下了这些不可复制的瞬间。',
    image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '26', name: 'Leica M6 旁轴胶片相机' },
    likes: 342,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: [
      { id: 'c1', author: '文艺青年', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100', content: '色彩太棒了！' },
      { id: 'c2', author: '老法师', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', content: 'M6 确实是经典中的经典。' }
    ]
  },
  {
    id: '2',
    author: '航拍达人',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    content: '周末去山里飞了一圈，Mavic 3 Pro 的三摄系统太实用了。特别是那颗 70mm 中长焦，空间压缩感绝佳，哈苏色彩科学让原片就非常能打。',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '3', name: 'DJI Mavic 3 Pro 航拍无人机' },
    likes: 89,
    isLiked: true,
    showComments: false,
    newComment: '',
    comments: []
  },
  {
    id: '3',
    author: '人像摄影师-阿杰',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    content: '今天用 Sony FE 35mm f/1.4 GM 拍了一组室内人像。这支镜头的锐度简直可怕，全开光圈下的焦外柔美得像奶油一样化开，暗光环境下的表现也堪称完美。',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '13', name: 'Sony FE 35mm f/1.4 GM' },
    likes: 512,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: [
      { id: 'c3', author: '光影魔术手', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', content: '求参数！' }
    ]
  },
  {
    id: '4',
    author: '风光猎人',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100',
    content: '凌晨四点爬上山顶，终于等到了这场绝美的日出。Nikon Z9 的宽容度救了我，高光和暗部的细节都完美保留了下来。',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '6', name: 'Nikon Z9 旗舰微单' },
    likes: 276,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: []
  },
  {
    id: '5',
    author: '夜猫子',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    content: '赛博朋克风格的夜景扫街。Sony A7M4 的高感表现依然稳如老狗，配合 24-70 GM II，手持拍摄毫无压力，霓虹灯的色彩还原非常准确。',
    image: 'https://images.unsplash.com/photo-1555464096-0ce85e55258c?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '1', name: 'Sony A7M4 全画幅微单相机' },
    likes: 198,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: []
  },
  {
    id: '6',
    author: '极限运动玩家',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    content: '带着 GoPro Hero 12 去滑雪，防抖性能又进化了！即使在高速滑行和跳跃中，画面依然平稳得像是在用稳定器。',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '16', name: 'GoPro Hero 12 Black' },
    likes: 145,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: []
  },
  {
    id: '7',
    author: '商业摄影-老李',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    content: '棚拍产品，Godox AD600Pro 依然是性价比之王。回电速度快，色温稳定，配合柔光箱打出来的光线非常均匀，工作效率大幅提升。',
    image: 'https://images.unsplash.com/photo-1603481546238-487240415920?auto=format&fit=crop&q=80&w=1200',
    equipment: { id: '8', name: 'Godox AD600Pro 影室闪光灯' },
    likes: 67,
    isLiked: false,
    showComments: false,
    newComment: '',
    comments: []
  }
])

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const submitComment = (post: any) => {
  if (!post.newComment?.trim()) return
  
  post.comments.push({
    id: Date.now().toString(),
    author: '当前用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    content: post.newComment.trim()
  })
  post.newComment = ''
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
