<template>
  <div class="relative rounded-2xl overflow-hidden bg-white mb-6 shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer">
    <img :src="imageUrl" alt="" class="w-full h-auto object-cover" referrerpolicy="no-referrer" />
    
    <router-link 
      v-if="equipmentName && equipmentId"
      :to="`/equipment/${equipmentId}`"
      class="absolute bottom-14 left-3 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-105 transition-transform"
    >
      <CameraIcon class="w-3.5 h-3.5" />
      {{ equipmentName }}
    </router-link>

    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <img :src="authorAvatar" :alt="authorName" class="w-6 h-6 rounded-full object-cover" referrerpolicy="no-referrer" />
        <span class="text-sm font-medium text-ink">{{ authorName }}</span>
      </div>
      <div class="text-sm text-gray-text flex items-center gap-1.5">
        <HeartIcon class="w-4 h-4" />
        {{ likes }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraIcon, HeartIcon } from 'lucide-vue-next'

defineProps<{
  id: string
  imageUrl: string
  equipmentName?: string
  equipmentId?: string
  authorName: string
  authorAvatar: string
  likes: number
}>()
</script>
