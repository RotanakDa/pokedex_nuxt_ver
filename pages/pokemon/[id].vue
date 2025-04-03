<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50">
    <AppDrawer />
    <FloatingHomeButton />
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12 mx-auto justify-center items-center">
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
            <div class="relative bg-gray-100 rounded-lg p-6 mb-6 overflow-hidden">
              <img 
                :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                :alt="pokemon.name"
                class="w-full h-64 object-contain mx-auto relative z-10"
              >
              <!-- Pokéball background -->
              <div class="absolute inset-0 flex items-center justify-center opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <!-- Outer circle -->
                  <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="10"/>
                  
                  <!-- Horizontal divider line -->
                  <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" stroke-width="10"/>
                  
                  <!-- Center button -->
                  <circle cx="60" cy="60" r="15" fill="currentColor"/>
                  <circle cx="60" cy="60" r="10" fill="white"/>
                  
                  <!-- Top half fill (optional) -->
                  <path d="M60,10 A50,50 0 0,1 110,60 L10,60 A50,50 0 0,0 60,10 Z" fill="currentColor" fill-opacity="0.2"/>
                </svg>
              </div>
            </div>

            <!-- Stats & Info -->
            <PokemonStatsChart :stats="pokemon.stats" />

            <br>
              <!-- About Section -->
            <div>
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
                class="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                :class="getMoveBorderClass(move)"
              >
                <div class="flex justify-between items-start">
                  <h3 class="font-medium capitalize text-gray-800">
                    {{ move.move.name.replace('-', ' ') }}
                  </h3>
                  <span class="text-xs px-2 py-1 rounded-full bg-white shadow">
                    {{ move.version_group_details[0].move_learn_method.name }}
                  </span>
                </div>
                <div class="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-2">
                  <span v-if="move.version_group_details[0].level_learned_at > 0">
                    Lv. {{ move.version_group_details[0].level_learned_at }}
                  </span>
                  
                  <!-- Damage Class -->
                  <span v-if="moveDetails[move.move.name]?.damage_class === 'physical'" class="flex items-center">
                    <span class="text-red-500 mr-1">💪</span>
                    Physical
                  </span>
                  <span v-else-if="moveDetails[move.move.name]?.damage_class === 'special'" class="flex items-center">
                    <span class="text-blue-500 mr-1">✨</span>
                    Special
                  </span>
                  <span v-else-if="moveDetails[move.move.name]?.damage_class === 'status'" class="flex items-center">
                    <span class="text-green-500 mr-1">⚙️</span>
                    Status
                  </span>
                  <span v-else class="text-gray-400">Loading...</span>
                  
                  <!-- Move Type Badge -->
                  <TypeBadge class="justify-self-end"
                    v-if="moveDetails[move.move.name]?.type" 
                    :type="moveDetails[move.move.name].type"
                    size="xs"
                  />
                  <span v-else class="text-gray-400">Loading type...</span>
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
const moveDetails = ref({}) // Store fetched move details

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

    // Fetch move details for each move
    fetchMovesDetails()
  } catch (error) {
    console.error('Error fetching Pokemon details:', error)
  } finally {
    loading.value = false
  }
})

// Fetch details for all moves
const fetchMovesDetails = async () => {
  if (!pokemon.value?.moves) return

  for (const moveEntry of pokemon.value.moves) {
    try {
      const response = await fetch(moveEntry.move.url)
      const data = await response.json()
      moveDetails.value[moveEntry.move.name] = {
        type: data.type.name,
        damage_class: data.damage_class.name, // 'physical', 'special', or 'status'
        power: data.power,
        accuracy: data.accuracy
      }
    } catch (error) {
      console.error(`Error fetching details for move ${moveEntry.move.name}:`, error)
    }
  }
}

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

// Instead of using dynamic class names, use a function that returns the appropriate pre-defined class
const getMoveBorderClass = (move) => {
  const moveType = moveDetails.value[move.move.name]?.type || 'normal'
  
  // Map of type to specific border classes
  const typeBorderClasses = {
    normal: 'border-l-4 border-gray-500',
    fire: 'border-l-4 border-red-500',
    water: 'border-l-4 border-blue-500',
    electric: 'border-l-4 border-yellow-500',
    grass: 'border-l-4 border-green-500',
    ice: 'border-l-4 border-cyan-500',
    fighting: 'border-l-4 border-orange-500',
    poison: 'border-l-4 border-purple-500',
    ground: 'border-l-4 border-amber-500',
    flying: 'border-l-4 border-indigo-500',
    psychic: 'border-l-4 border-pink-500',
    bug: 'border-l-4 border-lime-500',
    rock: 'border-l-4 border-stone-500',
    ghost: 'border-l-4 border-violet-500',
    dragon: 'border-l-4 border-fuchsia-500',
    dark: 'border-l-4 border-zinc-500',
    steel: 'border-l-4 border-slate-500',
    fairy: 'border-l-4 border-rose-500',
  }
  
  return typeBorderClasses[moveType] || 'border-l-4 border-gray-500'
}

const playPokemonCry = () => {
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.value.name}.mp3`
  const audio = new Audio(cryUrl)
  audio.play().catch(e => console.error("Error playing cry:", e))
}
</script>