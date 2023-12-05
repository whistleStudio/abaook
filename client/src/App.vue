<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="main flex-col">
    <header>
      <nav class="flex-row">
        <RouterLink to="/">Cover</RouterLink>
        <RouterLink to="/home">Home</RouterLink>
      </nav>
    </header>
    <RouterView class="rv"/>    
  </div>

</template>

<style scoped lang="scss">
.main {
  height: 100vh;
  width: 100vw;
  header {
    width: 20%;
    nav {
      justify-content: space-around;
    }
  }
  .rv {
    width: 80%;
    // background-color: orange;
  }
}
</style>
