<script setup lang="ts">
import logo from '@/assets/logo-w-h.svg';
</script>

<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <h1 class="h4 d-flex align-items-center gap-2 m-0">
            <img :src="logo" alt="LOGO" style="height: 35px">
            <span class="">QR Code 掃描與檢查</span>
          </h1>
        </a>

<!--        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">-->
<!--          <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>-->
<!--          <li><a href="#" class="nav-link px-2 text-white">Features</a></li>-->
<!--          <li><a href="#" class="nav-link px-2 text-white">Pricing</a></li>-->
<!--          <li><a href="#" class="nav-link px-2 text-white">FAQs</a></li>-->
<!--          <li><a href="#" class="nav-link px-2 text-white">About</a></li>-->
<!--        </ul>-->

        <div class="text-end ms-auto">
          <a href="https://simular.co" target="_blank"
            class="btn btn-outline-light me-2">
            前往夏木樂
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>
