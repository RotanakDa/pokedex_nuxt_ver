<template>
    <span 
      class="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize"
      :class="typeColor"
    >
      <span v-if="icon" class="mr-1">{{ icon }}</span>
      {{ type }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  })
  
  const typeColor = computed(() => {
    const colorMap = {
      normal: 'bg-gray-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      grass: 'bg-green-500',
      ice: 'bg-cyan-500',
      fighting: 'bg-orange-500',
      poison: 'bg-purple-500',
      ground: 'bg-amber-500',
      flying: 'bg-indigo-500',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-stone-500',
      ghost: 'bg-violet-500',
      dragon: 'bg-fuchsia-500',
      dark: 'bg-zinc-500',
      steel: 'bg-slate-500',
      fairy: 'bg-rose-500'
    }
    return colorMap[props.type] || 'bg-gray-500'
  })
  
  const sizeClasses = computed(() => {
    return {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5'
    }[props.size]
  })
  </script>