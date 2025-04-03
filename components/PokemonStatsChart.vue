<template>
    <div>
      <h3 class="text-lg font-semibold mb-3">Base Stats</h3>
      <div class="space-y-3">
        <div v-for="stat in formattedStats" :key="stat.name" class="flex items-center">
          <span class="w-24 text-sm font-medium capitalize text-gray-600">{{ stat.name }}</span>
          <div class="flex-1 bg-gray-200 rounded-full h-2.5">
            <div 
              class="h-2.5 rounded-full" 
              :class="stat.color"
              :style="{ width: `${stat.percentage}%` }"
            ></div>
          </div>
          <span class="w-8 text-right text-sm ml-2 font-medium" :class="stat.textColor">
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    stats: {
      type: Array,
      required: true
    }
  })
  
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
  }
  
  const formattedStats = computed(() => {
    return props.stats.map(stat => {
      const value = stat.base_stat
      let color = 'bg-red-500'
      let textColor = 'text-red-600'
      
      if (value >= 120) {
        color = 'bg-blue-500'
        textColor = 'text-green-600'
      } else if (value >= 100) {
        color = 'bg-green-500'
        textColor = 'text-blue-600'
      } else if (value >= 75) {
        color = 'bg-yellow-500'
        textColor = 'text-yellow-600'
      } else if (value >= 50) {
        color = 'bg-orange-500'
        textColor = 'text-blue-600'
      } else if (value >= 25) {
        color = 'bg-red-500'
        textColor = 'text-yellow-600'
      }
      
      
      return {
        name: statNames[stat.stat.name] || stat.stat.name,
        value: value,
        percentage: Math.min(100, value),
        color,
        textColor
      }
    })
  })
  </script>