<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/tasks">Tasks</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// No se necesita lógica aquí para este ejemplo
</script>

<style>
nav {
  padding: 10px;
  background-color: #f0f0f0;
}
a {
  margin-right: 10px;
}
</style>
