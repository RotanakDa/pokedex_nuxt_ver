<template>
  <div class="relative max-w-2xl mx-auto">
    <input
      type="text"
      v-model="searchQuery"
      @input="fetchSuggestions"
      @keyup.enter="performSearch"
      placeholder="Search for a Pokémon..."
      class="w-full py-3 px-6 pr-12 rounded-full border-2 border-gray-300 focus:border-red-500 focus:outline-none shadow-sm text-lg"
    >
    <button
      @click="performSearch"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <!-- Suggestions Dropdown -->
    <div 
      v-if="suggestions.length > 0 && searchQuery"
      class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <ul>
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.name"
          @click="selectSuggestion(suggestion)"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize flex items-center"
        >
          <img 
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${suggestion.id}.png`" 
            class="w-8 h-8 mr-2"
          >
          {{ suggestion.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const suggestions = ref([])
const emit = defineEmits(['search', 'select'])

const fetchSuggestions = async () => {
  if (searchQuery.value.length < 2) {
    suggestions.value = []
    return
  }
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    const data = await response.json()
    const matches = data.results.filter(p => 
      p.name.includes(searchQuery.value.toLowerCase())
    ).slice(0, 5)
    
    suggestions.value = matches.map(p => ({
      name: p.name,
      id: p.url.split('/').slice(-2, -1)[0]
    }))
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    suggestions.value = []
  }
}

const selectSuggestion = (pokemon) => {
  searchQuery.value = pokemon.name
  suggestions.value = []
  emit('select', pokemon)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    suggestions.value = []
  }
}
</script>