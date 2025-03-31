<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
    <AppDrawer />
    <!-- <FloatingHomeButton /> -->
    <FloatingSearchButton />
    <!-- Hero Section -->
    <div class="bg-red-600 shadow-lg relative overflow-hidden">
      <div class="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 z-10">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Gotta Catch 'Em All!</h1>
          <p class="text-xl text-white mb-8">Discover your favorite Pokémon and their stats</p>
          <SearchBar 
            @search="handleSearch" 
            @select="handlePokemonSelect"
          />
        </div>
        <div class="md:w-1/2 relative">
          <img 
            src="/assets/images/pokemon-logo.png" 
            alt="Logo"
            class="w-64 h-64 mx-auto md:ml-auto transform hover:scale-110 transition-transform duration-300"
          >
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Search Results (shown only when searching) -->
      <section v-if="searchQuery && searchResults.length > 0" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-gray-800">Search Results for "{{ searchQuery }}"</h2>
          <button 
            @click="clearSearch"
            class="text-red-600 hover:underline flex items-center"
          >
            Clear Search
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <PokemonCard 
            v-for="pokemon in searchResults" 
            :key="pokemon.id"
            :pokemon="pokemon"
            @view="viewPokemon"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>

      <!-- Featured Pokemon (hidden when searching) -->
      <section v-if="!searchQuery" class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-gray-800 flex items-center">
            <span class="bg-blue-500 text-white px-3 py-1 rounded-md mr-3">Featured</span>
            Pokémon
          </h2>
          <NuxtLink to="/search" class="text-red-600 hover:underline flex items-center">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="bg-white rounded-xl shadow-md p-4 h-64 animate-pulse"></div>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <PokemonCard 
            v-for="pokemon in featuredPokemon" 
            :key="pokemon.id"
            :pokemon="pokemon"
            @view="viewPokemon"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>

      <!-- Pokemon Types (hidden when searching) -->
      <section v-if="!searchQuery" class="mt-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Browse by Type</h2>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
          <NuxtLink 
            v-for="type in pokemonTypes" 
            :key="type.name"
            :to="`/types/${type.name}`"
            class="group"
          >
            <div class="flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:shadow-lg"
              :class="`bg-${getTypeColor(type.name)}-100 hover:bg-${getTypeColor(type.name)}-200 border-2 border-${getTypeColor(type.name)}-300`"
            >
              <span class="text-2xl mb-1">{{ type.icon }}</span>
              <span class="text-sm font-medium capitalize">{{ type.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Recently Viewed (hidden when searching) -->
      <section v-if="!searchQuery && recentlyViewed.length > 0" class="mt-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <PokemonCard 
            v-for="pokemon in recentlyViewed" 
            :key="pokemon.id"
            :pokemon="pokemon"
            @view="viewPokemon"
            class="hover:scale-105 transition-transform duration-200"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuredIds = [25, 6, 9, 3, 150, 151,94, 149, 143, 131, 130, 65, 59, 38, 133, 134, 135, 136, 493, 1000]

const featuredPokemon = ref([])
const recentlyViewed = ref([])
const loading = ref(true)
const searchQuery = ref('')
const searchResults = ref([])

const pokemonTypes = [
  { name: 'normal', icon: '⚪' },
  { name: 'fire', icon: '🔥' },
  { name: 'water', icon: '💧' },
  { name: 'electric', icon: '⚡' },
  { name: 'grass', icon: '🌿' },
  { name: 'ice', icon: '❄️' },
  { name: 'fighting', icon: '🥊' },
  { name: 'poison', icon: '☠️' },
  { name: 'ground', icon: '⛰️' },
  { name: 'flying', icon: '🕊️' },
  { name: 'psychic', icon: '🔮' },
  { name: 'bug', icon: '🐛' },
  { name: 'rock', icon: '🪨' },
  { name: 'ghost', icon: '👻' },
  { name: 'dragon', icon: '🐉' },
  { name: 'dark', icon: '🌑' },
  { name: 'steel', icon: '🛡️' },
  { name: 'fairy', icon: '🧚' }
]

const formatPokemonData = (pokemon) => {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
    types: pokemon.types?.map(t => t.type?.name) || [],
    stats: {
      hp: pokemon.stats?.[0]?.base_stat || 0,
      attack: pokemon.stats?.[1]?.base_stat || 0,
      defense: pokemon.stats?.[2]?.base_stat || 0,
      speed: pokemon.stats?.[5]?.base_stat || 0
    }
  }
}

const fetchPokemon = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    if (!response.ok) throw new Error('Pokemon not found')
    const data = await response.json()
    return formatPokemonData(data)
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error)
    return null
  }
}

const searchPokemon = async (query) => {
  try {
    // First try exact match
    const exactMatch = await fetchPokemon(query.toLowerCase())
    if (exactMatch) {
      searchResults.value = [exactMatch]
      return
    }

    // Fallback to search API for partial matches
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    const data = await response.json()
    const matches = data.results.filter(p => 
      p.name.includes(query.toLowerCase()) || 
      p.url.split('/').slice(-2, -1)[0] === query
    )
    
    // Fetch details for matched Pokémon
    const results = await Promise.all(matches.slice(0, 20).map(p => 
      fetchPokemon(p.url.split('/').slice(-2, -1)[0])
    )
    )
    searchResults.value = results.filter(p => p !== null)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  }
}

onMounted(async () => {
  try {
    // Load featured Pokemon
    const results = await Promise.all(featuredIds.map(id => fetchPokemon(id)))
    featuredPokemon.value = results.filter(p => p !== null)
    
    // Load recently viewed
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    if (viewed.length > 0) {
      const recentResults = await Promise.all(viewed.slice(0, 5).map(id => fetchPokemon(id)))
      recentlyViewed.value = recentResults.filter(p => p !== null)
    }
  } catch (error) {
    console.error('Error loading Pokemon:', error)
  } finally {
    loading.value = false
  }
})

const handleSearch = async (query) => {
  searchQuery.value = query
  if (query.trim()) {
    await searchPokemon(query.trim())
  } else {
    searchResults.value = []
  }
}

const handlePokemonSelect = (pokemon) => {
  viewPokemon(pokemon.id)
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const viewPokemon = (id) => {
  // Add to recently viewed
  const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  if (!viewed.includes(id)) {
    viewed.unshift(id)
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed.slice(0, 10)))
  }
  navigateTo(`/pokemon/${id}`)
}

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
</script>