<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
    <AppDrawer />
    <FloatingHomeButton />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Search Pokémon</h1>
      
      <!-- Search Bar -->
      <div class="mb-8">
        <SearchBar 
          @search="handleSearch" 
          @select="handlePokemonSelect"
          class="max-w-2xl mx-auto"
        />
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
      </div>
      
      <!-- Search Results -->
      <div v-else>
        <!-- When searching -->
        <div v-if="searchQuery">
          <h2 class="text-2xl font-semibold mb-4">Results for "{{ searchQuery }}"</h2>
          <div v-if="filteredPokemon.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PokemonCard 
              v-for="pokemon in filteredPokemon" 
              :key="pokemon.id"
              :pokemon="pokemon"
              @view="viewPokemon"
              class="hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div v-else class="text-center py-12 text-gray-500">
            No Pokémon found matching "{{ searchQuery }}"
          </div>
        </div>
        
        <!-- Default view - paginated Pokémon -->
        <div v-else>
          <h2 class="text-2xl font-semibold mb-4">Pokémon Collection</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PokemonCard 
              v-for="pokemon in displayedPokemon" 
              :key="pokemon.id"
              :pokemon="pokemon"
              @view="viewPokemon"
              class="hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          <!-- Enhanced Pagination -->
          <div class="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button 
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-md bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-md bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <!-- Page Numbers -->
            <div class="flex">
              <button
                v-for="page in displayedPageNumbers"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 mx-1 rounded-md',
                  currentPage === page 
                    ? 'bg-red-600 text-white font-bold' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-md bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button 
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-md bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Last
            </button>
            
            <span class="px-3 py-1 ml-2 bg-gray-100 rounded-md">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Search state
const searchQuery = ref('')
const displayedPokemon = ref([])
const searchResults = ref([])
const loading = ref(true)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 100 // Shows 20 Pokémon per page
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

// For pagination display
const maxVisiblePageButtons = 6
const displayedPageNumbers = computed(() => {
  const pages = []
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePageButtons / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePageButtons - 1)
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePageButtons) {
    startPage = Math.max(1, endPage - maxVisiblePageButtons + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Fetch Pokémon count
const fetchPokemonCount = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1')
    const data = await response.json()
    totalItems.value = data.count
  } catch (error) {
    console.error('Error fetching Pokémon count:', error)
    totalItems.value = 1000 // Fallback value
  }
}

// Fetch Pokémon for the current page
const fetchPokemonPage = async (page) => {
  try {
    loading.value = true
    const offset = (page - 1) * itemsPerPage
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage}`)
    const data = await response.json()
    
    // Fetch details for each Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(p => fetchPokemonDetails(p.url))
    )
    
    displayedPokemon.value = pokemonDetails.filter(p => p !== null)
  } catch (error) {
    console.error(`Error fetching Pokémon page ${page}:`, error)
  } finally {
    loading.value = false
  }
}

// Fetch details for a single Pokémon
const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Pokemon not found')
    const data = await response.json()
    
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat
      }
    }
  } catch (error) {
    console.error(`Error fetching Pokémon details:`, error)
    return null
  }
}

// Search functionality
const handleSearch = async (query) => {
  if (!query.trim()) {
    searchQuery.value = ''
    return
  }
  
  searchQuery.value = query
  loading.value = true
  
  try {
    // We'll search by type first
    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${query.toLowerCase()}`)
    
    if (typeResponse.ok) {
      const typeData = await typeResponse.json()
      const pokemonInType = typeData.pokemon.slice(0, 50) // Limit to 50 results
      
      const pokemonDetails = await Promise.all(
        pokemonInType.map(p => fetchPokemonDetails(p.pokemon.url))
      )
      
      searchResults.value = pokemonDetails.filter(p => p !== null)
    } else {
      // If not a type, use name search (implemented client-side)
      // We'll fetch a larger set and filter
      const nameResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=200`)
      const nameData = await nameResponse.json()
      
      const matchingPokemon = nameData.results.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 50) // Limit to 50 results
      
      const pokemonDetails = await Promise.all(
        matchingPokemon.map(p => fetchPokemonDetails(p.url))
      )
      
      searchResults.value = pokemonDetails.filter(p => p !== null)
    }
  } catch (error) {
    console.error('Error searching Pokémon:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Filter Pokémon based on search query
const filteredPokemon = computed(() => {
  return searchResults.value
})

// Pagination navigation
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handlePokemonSelect = (pokemon) => {
  viewPokemon(pokemon.id)
}

const viewPokemon = (id) => {
  navigateTo(`/pokemon/${id}`)
}

// Watch for page changes to load new data
watch(currentPage, (newPage) => {
  if (!searchQuery.value) {
    fetchPokemonPage(newPage)
  }
})

// Initial data load
onMounted(async () => {
  await fetchPokemonCount()
  await fetchPokemonPage(currentPage.value)
})
</script>