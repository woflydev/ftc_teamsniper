<template>
  <div>
    <AppHeader />

    <div class="container mt-4">
      <Search :host="host" ref="searchComponent" />
    </div>

    <div class="container mt-4">
      <Explainer />
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import Search from './components/Search.vue';
import Explainer from './components/Explainer.vue';

console.info("Current environment is", import.meta.env.MODE);

const isProduction = import.meta.env.MODE === 'production';
const host = isProduction
  ? 'https://ftc-teamsniper.vercel.app'
  : `${window.location.protocol}//${window.location.host}`;

</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
