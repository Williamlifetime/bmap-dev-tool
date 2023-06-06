<template>
  <div id="app">
    <MapBox msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import MapBox from './components/MapBox.vue'

export default {
  name: 'App',
  components: {
    MapBox
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
