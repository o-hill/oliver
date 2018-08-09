<template>
  <div id="app">
    <transition name='fade'>
      <router-view/>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'App',

    data() {
      return {

      }
    },

  }

</script>

<style>

  .fade-enter-active, .fade-leave-active {
    transition: opacity 3s ease;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  html {
    background-color: #000000;
  }

</style>
