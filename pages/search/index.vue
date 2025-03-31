<template>
    <div class="min-h-screen bg-gray-50">
      <AppDrawer />
      
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Search Pokémon</h1>
        
        <SearchBar @search="handleSearch" />
        
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
        
        <div v-else>
          <div v-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            <PokemonCard 
              v-for="pokemon in searchResults" 
              :key="pokemon.id"
              :pokemon="{
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
                types: pokemon.types.map(t => t.type.name),
                stats: {
                  hp: pokemon.stats[0].base_stat,
                  attack: pokemon.stats[1].base_stat,
                  defense: pokemon.stats[2].base_stat,
                  speed: pokemon.stats[5].base_stat
                }
              }"
              @view="viewPokemon"
              class="hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          <div v-else-if="searchQuery" class="text-center py-12 text-gray-500">
            No Pokémon found for "{{ searchQuery }}"
          </div>
          
          <div v-else class="text-center py-12 text-gray-500">
            Search for Pokémon by name or ID
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { usePokemonApi } from '~/composables/usePokemonApi'
  
  const { searchPokemon, getPokemonList } = usePokemonApi()
  const searchQuery = ref('')
  const searchResults = ref([])
  const loading = ref(false)
  
  const handleSearch = async (query) => {
    searchQuery.value = query
    loading.value = true
    searchResults.value = []
    
    try {
      // Try exact match first
      const exactMatch = await searchPokemon(query)
      if (exactMatch) {
        searchResults.value = [exactMatch]
      } else {
        // Fallback to partial matches
        const allPokemon = await getPokemonList(150) // Limit for demo
        searchResults.value = allPokemon.filter(p => 
          p.name.includes(query.toLowerCase()) || 
          p.id.toString().includes(query)
        )
      }
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }
  
  const viewPokemon = (id) => {
    navigateTo(`/pokemon/${id}`)
  }
  </script>