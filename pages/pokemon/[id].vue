<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
    <AppDrawer />
    
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
      </div>

      <div v-else-if="pokemon" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <!-- Pokémon Header with Cry Button -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h1 class="text-3xl font-bold capitalize">{{ pokemon.name }}</h1>
                <div class="flex gap-2 mt-2">
                  <TypeBadge 
                    v-for="type in pokemon.types" 
                    :key="type.type.name"
                    :type="type.type.name"
                    size="md"
                  />
                </div>
              </div>
              <button 
                @click="playPokemonCry"
                class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Play Pokémon cry"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </div>

            <!-- Pokémon Image -->
            <div class="relative bg-gray-100 rounded-lg p-6 mb-6">
              <img 
                :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                :alt="pokemon.name"
                class="w-full h-64 object-contain mx-auto"
              >
            </div>

            <!-- Stats & Info -->
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
              
            <!-- About Section -->
          <div class="bg-white rounded-xl shadow-lg p-2">
            <h2 class="text-2xl font-bold mb-4 flex items-center">
              <span class="text-blue-500 mr-2">ℹ️</span>
              About
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="font-semibold text-gray-600">Height</h3>
                <p>{{ pokemon.height / 10 }} m</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-600">Weight</h3>
                <p>{{ pokemon.weight / 10 }} kg</p>
              </div>
              <div>
                <h3 class="font-semibold text-gray-600">Abilities</h3>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="ability in pokemon.abilities" 
                    :key="ability.ability.name"
                    class="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize"
                  >
                    {{ ability.ability.name.replace('-', ' ') }}
                    <span v-if="ability.is_hidden" class="text-xs text-gray-500 ml-1">(hidden)</span>
                  </span>
                </div>
              </div>
              <div>
                <h3 class="font-semibold text-gray-600">Base Experience</h3>
                <p>{{ pokemon.base_experience }}</p>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-2 space-y-6">
          
          <PokemonWeakness :types="pokemon.types.map(t => t.type.name)" />

          <!-- Moves Section -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-4 flex items-center">
              <span class="text-yellow-500 mr-2">⚡</span>
              Moves
            </h2>
            
            <div class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="filter in moveFilters"
                :key="filter.value"
                @click="moveFilter = filter.value"
                class="px-3 py-1 rounded-full text-sm"
                :class="{
                  'bg-red-500 text-white': moveFilter === filter.value,
                  'bg-gray-100 hover:bg-gray-200': moveFilter !== filter.value
                }"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-2">
              <div 
                v-for="move in filteredMoves" 
                :key="move.move.name"
                class="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors border-l-4"
                :class="getMoveTypeClass(move)"
              >
                <div class="flex justify-between items-start">
                  <h3 class="font-medium capitalize text-gray-800">
                    {{ move.move.name.replace('-', ' ') }}
                  </h3>
                  <span class="text-xs px-2 py-1 rounded-full bg-white shadow">
                    {{ move.version_group_details[0].move_learn_method.name }}
                  </span>
                </div>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                  <span v-if="move.version_group_details[0].level_learned_at > 0" class="mr-2">
                    Lv. {{ move.version_group_details[0].level_learned_at }}
                  </span>
                  <span class="flex items-center">
                    <span v-if="isPhysicalMove(move)" class="flex items-center mr-2">
                      <span class="text-red-500 mr-1">💪</span>
                      Physical
                    </span>
                    <span v-if="isSpecialMove(move)" class="flex items-center">
                      <span class="text-blue-500 mr-1">✨</span>
                      Special
                    </span>
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
const route = useRoute()
const { getPokemonDetails, getPokemonSpecies } = usePokemonApi()

const pokemon = ref(null)
const species = ref(null)
const evolutionChain = ref([])
const evolutionDetails = ref([])
const loading = ref(true)
const moveFilter = ref('all')

const moveFilters = [
  { value: 'all', label: 'All Moves' },
  { value: 'level', label: 'Level Up' },
  { value: 'machine', label: 'TM/HM' },
  { value: 'egg', label: 'Egg Moves' },
  { value: 'tutor', label: 'Tutor' }
]

onMounted(async () => {
  try {
    pokemon.value = await getPokemonDetails(route.params.id)
    species.value = await getPokemonSpecies(route.params.id)
    
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
          item: e.evolution_details[0].item?.name,
          needs_trade: e.evolution_details[0].trade_species !== null,
          time_of_day: e.evolution_details[0].time_of_day,
          needs_friendship: e.evolution_details[0].min_happiness !== null
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
  if (!pokemon.value?.moves) return []
  
  return pokemon.value.moves.filter(move => {
    if (moveFilter.value === 'all') return true
    
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
      return false
    })
  })
})

const getMoveTypeClass = (move) => {
  const type = move.move.name.split('-')[0]
  return `border-${getTypeColor(type)}-500`
}

const isPhysicalMove = (move) => {
  const physicalMoves = ['pound', 'scratch', 'tackle', 'cut']
  return physicalMoves.includes(move.move.name)
}

const isSpecialMove = (move) => {
  const specialMoves = ['ember', 'water-gun', 'thunder-shock', 'confusion']
  return specialMoves.includes(move.move.name)
}

const formatItemName = (item) => {
  return item.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const playPokemonCry = () => {
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.value.name}.mp3`
  const audio = new Audio(cryUrl)
  audio.play().catch(e => console.error("Error playing cry:", e))
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