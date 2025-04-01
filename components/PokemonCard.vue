<template>
  <div 
    class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-gray-200 group"
    :class="`hover:border-${getTypeColor(pokemon.types[0])}-400`"
     @click="$emit('view', pokemon.id)"
  >
    <!-- Pokemon Image with Background -->
    <div 
      class="relative p-4 flex justify-center"
      :class="`bg-${getTypeColor(pokemon.types[0])}-100`"
    >
      <img 
        :src="pokemon.image" 
        :alt="pokemon.name" 
        class="h-40 w-40 object-contain transform group-hover:scale-110 transition-transform duration-300 z-10"
      >
      <div class="absolute inset-0 flex items-center justify-center opacity-10">
        <svg width="200" height="200" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Pokéball base -->
          <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="10"/>
          
          <!-- Horizontal divider line -->
          <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" stroke-width="10"/>
          
          <!-- Center circle -->
          <circle cx="60" cy="60" r="15" fill="currentColor"/>
          <circle cx="60" cy="60" r="10" fill="white"/>
          
          <!-- Top half fill -->
          <path d="M60,10 A50,50 0 0,1 110,60 L10,60 A50,50 0 0,0 60,10 Z" fill="currentColor" fill-opacity="0.2"/>
        </svg>
      </div>
    </div>

    <!-- Pokemon Info -->
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-bold text-gray-800 capitalize">{{ pokemon.name }}</h3>
        <span class="text-gray-500">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
      </div>

      <!-- Types -->
      <div class="flex gap-2 mt-2">
        <TypeBadge 
          v-for="type in pokemon.types" 
          :key="type"
          :type="type"
          size="sm"
        />
      </div>

      <!-- View Button -->
      <!-- <button 
        class="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-md transition-all duration-200 flex items-center justify-center group"
        @click="$emit('view', pokemon.id)"
      >
        <span>View Details</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

const getTypeColor = (type) => {
  const typeColors = {
    normal: 'gray',
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    ice: 'cyan',
    fighting: 'orange',
    poison: 'purple',
    ground: 'amber',
    flying: 'indigo',
    psychic: 'pink',
    bug: 'lime',
    rock: 'stone',
    ghost: 'violet',
    dragon: 'fuchsia',
    dark: 'zinc',
    steel: 'slate',
    fairy: 'rose'
  }
  return typeColors[type] || 'gray'
}

const getStatColor = (value) => {
  if (value >= 100) return 'green-500'
  if (value >= 75) return 'blue-500'
  if (value >= 50) return 'yellow-500'
  return 'red-500'
}
</script>