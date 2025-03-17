<template>
  <div class="background text-white padding">
    <div class="container mx-auto text-center">
      <div class="fs-1 fw-bold">Welcome to Our Website</div>
      <div class="fw-normal">Discover amazing things with Camping Shop</div>
    </div>
  </div>
</template>

<script>
export default {
    name : 'Homepage'
}
</script>

<style>
.background {
    background-image: url('../images/background.jpg'); 
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
</style>
