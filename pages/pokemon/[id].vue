<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
      <AppDrawer />
      <FloatingHomeButton />
      <!-- <FloatingSearchButton /> -->
      <div class="container mx-auto px-4 py-8">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        </div>
  
        <div v-else-if="pokemon" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <!-- Pokemon Header -->
              <div class="text-center mb-6">
                <h1 class="text-3xl font-bold capitalize">{{ pokemon.name }}</h1>
                <div class="flex justify-center gap-2 mt-2">
                  <TypeBadge 
                    v-for="type in pokemon.types" 
                    :key="type.type.name"
                    :type="type.type.name"
                    size="md"
                  />
                </div>
              </div>
  
              <!-- Pokemon Image -->
              <div class="relative bg-gray-100 rounded-lg p-6 mb-6">
                <img 
                  :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                  :alt="pokemon.name"
                  class="w-full h-64 object-contain mx-auto"
                >
                <div class="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="10"/>
                  </svg>
                </div>
              </div>
  
              <!-- Pokemon Stats -->
              <PokemonStatsChart :stats="pokemon.stats" />
  
              <!-- Additional Info -->
              <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 class="font-semibold text-gray-600">Height</h3>
                  <p>{{ pokemon.height / 10 }} m</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-600">Weight</h3>
                  <p>{{ pokemon.weight / 10 }} kg</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-600">Base Exp</h3>
                  <p>{{ pokemon.base_experience }}</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-600">Capture Rate</h3>
                  <p>{{ species.capture_rate || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- About Section -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </h2>
              
              <!-- Abilities -->
              <div class="mb-4">
                <h3 class="font-semibold text-gray-600 mb-2">Abilities</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="ability in pokemon.abilities" 
                    :key="ability.ability.name"
                    class="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                  >
                    {{ ability.ability.name.replace('-', ' ') }}
                    <span v-if="ability.is_hidden" class="text-xs text-gray-500 ml-1">(hidden)</span>
                  </span>
                </div>
              </div>
  
              <!-- Habitat and Egg Groups -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 class="font-semibold text-gray-600">Habitat</h3>
                  <p class="capitalize">{{ species.habitat?.name || 'Unknown' }}</p>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-600">Egg Groups</h3>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="group in species.egg_groups" 
                      :key="group.name"
                      class="px-2 py-0.5 bg-gray-100 rounded-full text-xs capitalize"
                    >
                      {{ group.name.replace('-', ' ') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Weaknesses -->
            <PokemonWeakness :types="pokemon.types.map(t => t.type.name)" />
  
            <!-- Moves -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Moves
              </h2>
              
              <div class="flex items-center mb-4">
                <label class="mr-2 text-sm font-medium text-gray-700">Filter by:</label>
                <select 
                  v-model="moveFilter" 
                  class="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="all">All Moves</option>
                  <option value="level">Level Up</option>
                  <option value="machine">TM/HM</option>
                  <option value="egg">Egg Moves</option>
                  <option value="tutor">Tutor Moves</option>
                </select>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
                <div 
                  v-for="move in filteredMoves" 
                  :key="move.move.name"
                  class="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                >
                  <h3 class="font-medium capitalize text-gray-800">
                    {{ move.move.name.replace('-', ' ') }}
                  </h3>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span class="capitalize">{{ move.version_group_details[0].move_learn_method.name }}</span>
                    <span v-if="move.version_group_details[0].level_learned_at > 0">
                      Lv. {{ move.version_group_details[0].level_learned_at }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Evolutions -->
            <div v-if="evolutionChain.length > 1" class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Evolution Chain
              </h2>
              
              <div class="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <div 
                  v-for="(evo, index) in evolutionChain" 
                  :key="evo.name"
                  class="flex flex-col items-center"
                >
                  <NuxtLink :to="`/pokemon/${evo.name}`" class="group">
                    <div class="relative p-4 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                      <img 
                        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`" 
                        :alt="evo.name"
                        class="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
                      >
                    </div>
                    <p class="mt-2 text-center font-medium capitalize text-gray-800 group-hover:text-red-600 transition-colors">
                      {{ evo.name }}
                    </p>
                  </NuxtLink>
                  
                  <div v-if="index < evolutionChain.length - 1" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <span class="text-xs text-gray-500 ml-1" v-if="evolutionDetails[index]">
                      Lv. {{ evolutionDetails[index].min_level || '?' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { usePokemonApi } from '~/composables/usePokemonApi'
  
  const route = useRoute()
  const { getPokemonDetails, getPokemonSpecies } = usePokemonApi()
  
  const pokemon = ref(null)
  const species = ref(null)
  const evolutionChain = ref([])
  const evolutionDetails = ref([])
  const loading = ref(true)
  const moveFilter = ref('all')
  
  onMounted(async () => {
    try {
      pokemon.value = await getPokemonDetails(route.params.id)
      species.value = await getPokemonSpecies(route.params.id)
      
      // Fetch evolution chain if available
      if (species.value.evolution_chain?.url) {
        const response = await fetch(species.value.evolution_chain.url)
        const data = await response.json()
        const { chain, details } = parseEvolutionChain(data.chain)
        evolutionChain.value = chain
        evolutionDetails.value = details
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error)
    } finally {
      loading.value = false
    }
  })
  
  const parseEvolutionChain = (chain) => {
    const evolutions = []
    const details = []
    
    const addEvolution = (evolution, detail = {}) => {
      const id = evolution.species.url.split('/').slice(-2, -1)[0]
      evolutions.push({
        name: evolution.species.name,
        id: parseInt(id)
      })
      
      if (evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach(e => {
          const newDetail = {
            min_level: e.evolution_details[0].min_level,
            trigger: e.evolution_details[0].trigger?.name,
            item: e.evolution_details[0].item?.name
          }
          details.push(newDetail)
          addEvolution(e, newDetail)
        })
      }
    }
    
    addEvolution(chain)
    return { chain: evolutions, details }
  }
  
  const filteredMoves = computed(() => {
    if (moveFilter.value === 'all') return pokemon.value?.moves || []
    
    return pokemon.value?.moves.filter(move => {
      return move.version_group_details.some(detail => {
        if (moveFilter.value === 'level') {
          return detail.move_learn_method.name === 'level-up'
        } else if (moveFilter.value === 'machine') {
          return detail.move_learn_method.name === 'machine'
        } else if (moveFilter.value === 'egg') {
          return detail.move_learn_method.name === 'egg'
        } else if (moveFilter.value === 'tutor') {
          return detail.move_learn_method.name === 'tutor'
        }
        return true
      })
    }) || []
  })
  </script>