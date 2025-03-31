<template>
    <div class="min-h-screen bg-gray-50">
      <AppDrawer />
      <FloatingHomeButton />
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-2 capitalize">{{ type }} Pokémon</h1>
        <p class="text-gray-600 mb-8">Showing Pokémon of type {{ type }}</p>
        
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <PokemonCard 
            v-for="pokemon in pokemonList" 
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
      </div>
    </div>
  </template>
  
  <script setup>
  import { usePokemonApi } from '~/composables/usePokemonApi'
  
  const route = useRoute()
  const type = route.params.type
  const { getPokemonByType } = usePokemonApi()
  
  const pokemonList = ref([])
  const loading = ref(true)
  
  onMounted(async () => {
    try {
      pokemonList.value = await getPokemonByType(type)
    } catch (error) {
      console.error('Error fetching Pokémon by type:', error)
    } finally {
      loading.value = false
    }
  })
  
  const viewPokemon = (id) => {
    navigateTo(`/pokemon/${id}`)
  }
  </script>