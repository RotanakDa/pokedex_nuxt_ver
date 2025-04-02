<template>
    <div>
      <!-- Hamburger Button -->
      <button 
        @click="isOpen = !isOpen"
        class="fixed top-4 left-4 z-50 p-2 rounded-md bg-red-800 text-white shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
  
      <!-- Drawer Overlay -->
      <div 
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>
  
      <!-- Drawer Content -->
      <aside 
        :class="{'translate-x-0': isOpen, '-translate-x-full': !isOpen}"
        class="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-yellow-50 to-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out"
      >
      <br>
      <br>
      <br>
        <div class="p-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">Pokédex By Rotanak</h2>
        </div>
        
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/" 
                class="block px-4 py-2 rounded hover:bg-red-100 text-gray-800 hover:text-red-600"
                @click="isOpen = false"
              >
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/search" 
                class="block px-4 py-2 rounded hover:bg-red-100 text-gray-800 hover:text-red-600"
                @click="isOpen = false"
              >
                Search Pokémon
              </NuxtLink>
            </li>
            <li class="pt-4">
              <p class="px-4 py-2 font-semibold text-gray-500">Browse by Type</p>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <NuxtLink 
                  v-for="type in pokemonTypes" 
                  :key="type.name"
                  :to="`/types/${type.name}`"
                  class="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize text-center"
                  :class="`bg-${getTypeColor(type.name)}-500 hover:bg-${getTypeColor(type.name)}-600`"
                  @click="isOpen = false"
                >
                  {{ type.name }}
                </NuxtLink>
              </div>
            </li>
            <br>
            <div class="">
              <h2 class="text-md font-bold text-gray-800">version 1.0.4.2</h2>
            </div>

          </ul>
        </nav>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isOpen = ref(false)
  
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