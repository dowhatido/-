<template>
  <router-link :to="`/equipment/${id}`" class="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div class="relative aspect-square bg-gray-100">
      <img :src="image" :alt="name" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-ink shadow-sm">
        ¥{{ dailyRent }}/天
      </div>
    </div>
    <div class="p-4">
      <div class="text-xs text-gray-text mb-1.5 font-medium">{{ brand }} · {{ category }}</div>
      <h3 class="font-bold text-ink text-lg mb-2 line-clamp-1">{{ name }}</h3>
      <div class="flex items-center gap-1 text-sm text-gray-text font-medium">
        <StarIcon class="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span>{{ rating }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { StarIcon } from 'lucide-vue-next'

defineProps<{
  id: string
  name: string
  category: string
  brand: string
  dailyRent: number
  image: string
  rating: number
}>()
</script>
