<template>
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Type Weaknesses</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div 
          v-for="(effectiveness, type) in typeChart" 
          :key="type"
          class="flex items-center gap-2 p-2 rounded"
          :class="{
            'bg-green-200': effectiveness >= 2,
            'bg-red-200': effectiveness <= 0.5,
            'bg-gray-100': effectiveness === 0
          }"
        >
          <TypeBadge :type="type" size="sm" />
          <span 
            class="text-sm font-medium"
            :class="{
              'text-green-600': effectiveness >= 2,
              'text-red-600': effectiveness <= 0.5,
              'text-gray-600': effectiveness === 0
            }"
          >
            {{ effectiveness === 0 ? '0x' : `${effectiveness}x` }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    types: {
      type: Array,
      required: true
    }
  })
  
  // Enhanced type effectiveness chart
  const typeEffectiveness = {
    normal: { fighting: 2, ghost: 0 },
    fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, ground: 2, bug: 0.5, rock: 2, steel: 0.5, fairy: 0.5 },
    water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 },
    electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
    grass: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, poison: 2, ground: 0.5, flying: 2, bug: 2, steel: 2 },
    ice: { fire: 2, ice: 0.5, fighting: 2, rock: 2, steel: 2 },
    fighting: { flying: 2, psychic: 2, bug: 0.5, rock: 0.5, dark: 0.5, fairy: 2 },
    poison: { grass: 0.5, poison: 0.5, ground: 2, psychic: 2, bug: 0.5, fairy: 0.5 },
    ground: { water: 2, grass: 2, electric: 0, ice: 2, poison: 0.5, rock: 0.5 },
    flying: { electric: 2, grass: 0.5, ice: 2, fighting: 0.5, ground: 0, bug: 0.5, rock: 2 },
    psychic: { psychic: 0.5, bug: 2, ghost: 2, dark: 2 },
    bug: { fire: 2, grass: 0.5, fighting: 0.5, ground: 0.5, flying: 2, rock: 2 },
    rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, steel: 2 },
    ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
    dragon: { fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, dragon: 2, fairy: 2 },
    dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
    steel: { normal: 0.5, fire: 2, grass: 0.5, ice: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
    fairy: { fighting: 0.5, poison: 2, bug: 0.5, steel: 2, dark: 0.5, dragon: 0 }
  }
  
  const typeChart = computed(() => {
    const effectiveness = {}
    const allTypes = Object.keys(typeEffectiveness)
    
    // Initialize all types to 1
    allTypes.forEach(type => {
      effectiveness[type] = 1
    })
    
    // Calculate effectiveness for each type
    props.types.forEach(pokemonType => {
      const type = pokemonType.toLowerCase()
      const weaknesses = typeEffectiveness[type] || {}
      
      Object.entries(weaknesses).forEach(([defendingType, multiplier]) => {
        effectiveness[defendingType] = effectiveness[defendingType] * multiplier
      })
    })
    
    return effectiveness
  })
  </script>