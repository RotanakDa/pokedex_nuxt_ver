import { ref } from 'vue'

export const usePokemonApi = () => {
  const baseUrl = 'https://pokeapi.co/api/v2'
  
  const searchPokemon = async (query) => {
    try {
      const response = await fetch(`${baseUrl}/pokemon/${query.toLowerCase()}`)
      if (!response.ok) throw new Error('Pokemon not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
      return null
    }
  }

  const getPokemonList = async (limit = 20) => {
    const response = await fetch(`${baseUrl}/pokemon?limit=${limit}`)
    const data = await response.json()
    return Promise.all(data.results.map(p => getPokemonDetails(p.name)))
  }

  const getPokemonDetails = async (nameOrId) => {
    const response = await fetch(`${baseUrl}/pokemon/${nameOrId}`)
    return await response.json()
  }

  const getPokemonSpecies = async (nameOrId) => {
    const response = await fetch(`${baseUrl}/pokemon-species/${nameOrId}`)
    return await response.json()
  }

  const getPokemonByType = async (type) => {
    const response = await fetch(`${baseUrl}/type/${type}`)
    const data = await response.json()
    return Promise.all(data.pokemon.slice(0, 20).map(p => getPokemonDetails(p.pokemon.name)))
  }

  return {
    searchPokemon,
    getPokemonList,
    getPokemonDetails,
    getPokemonSpecies,
    getPokemonByType
  }
}