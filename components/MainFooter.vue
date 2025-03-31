<template>
    <footer class="mt-12 bg-gradient-to-r from-red-500 to-red-600 text-white py-8 px-4 relative overflow-hidden">
      <!-- Decorative Pokéballs -->
      
      
      <div class="container mx-auto">
        <div class="grid grid-cols-1 gap-8">
          <!-- About Section -->
          <div>
            <h3 class="text-xl font-bold mb-4">Pokédex By Rotanak Da</h3>
            <p class="mb-4">Your comprehensive Pokémon database powered by the PokéAPI. Search, explore, and learn about your favorite Pokémon.</p>
            <div class="flex space-x-4">
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="hover:text-yellow-300 transition-colors">
                <span class="sr-only">YouTube</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
                </svg>
              </a>
              <a href="https://github.com/RotanakDa" class="hover:text-yellow-300 transition-colors">
                <span class="sr-only">GitHub</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-8 pt-6 border-t border-red-400 flex flex-col md:flex-row justify-between items-center">
          <p>© {{ currentYear }} PokéSearch. All rights reserved.</p>
          <p class="mt-2 md:mt-0">
            Pokémon data provided by 
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" class="underline hover:text-yellow-300 transition-colors">PokéAPI</a>
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const email = ref('')
  const currentYear = computed(() => new Date().getFullYear())
  
  const subscribeNewsletter = () => {
    // In a real application, you would send this to your backend
    alert(`Thanks for subscribing with ${email.value}!`)
    email.value = ''
  }
  </script>