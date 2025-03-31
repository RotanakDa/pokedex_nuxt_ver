// utils/pokemon.js
export const fetchPokemon = async (id) => {
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
  
  export const formatPokemonData = (pokemon) => {
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