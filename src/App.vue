<script setup lang="ts">
import QRCodeChecker from '@/components/QRCodeChecker.vue';
import Header from '@/layout/Header.vue';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
  <main>
    <Header />

    <div class="container">
      <QRCodeChecker />
    </div>

    <hr />
    <div class="container py-3 text-center">
      QR Code 掃描與檢查 - Made with
      <FontAwesomeIcon :icon="faHeart" style="color: var(--bs-pink)" />
      by
      <a href="https://simular.co" target="_blank">
        夏木樂
      </a>
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
