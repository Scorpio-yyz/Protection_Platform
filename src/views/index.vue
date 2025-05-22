<template>
  <div class="app-container home">
    <img src="../assets/home/home2.png" class="home-img" alt="" v-show='true'>
  </div>
</template>

<script setup name="Index">
const version = ref('3.8.6')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  height: calc(100vh - 84px);
  padding: 80px 20px;
  // overflow-x: auto;
  // overflow-y: hidden;

  .home-img {
    height: 100%;
    width: 100%;
  }
}
</style>

