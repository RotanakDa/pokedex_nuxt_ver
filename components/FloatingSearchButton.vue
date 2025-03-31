<template>
    <button 
      @click="goHome"
      class="fixed top-4 right-2 z-50 p-2 rounded-md bg-white shadow-lg hover:scale-110 transition-transform"
      aria-label="Return thomepage"
    >
      <img 
        src="/assets/images/Search.png" 
        alt="Home"
        class="h-8 w-auto"
      >
    </button>
  </template>
  
  <script setup>
  const goHome = () => {
    navigateTo('/search')
  }
  </script>