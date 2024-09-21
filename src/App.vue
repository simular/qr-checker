<script setup lang="ts">
import QRCodeChecker from '@/components/QRCodeChecker.vue';
import Header from '@/layout/Header.vue';
</script>

<template>
  <main>
    <Header />

    <div class="container">
      <QRCodeChecker />
    </div>
  </main>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
