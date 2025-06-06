<template>
  <v-app>
    <v-app-bar 
      app 
      color="primary" 
      dark
      elevation="2"
    >
      <v-app-bar-title class="d-flex align-center">
        <v-icon left>mdi-check-circle</v-icon>
        Todo App
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn
        icon="mdi-theme-light-dark"
        @click="toggleTheme"
      ></v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          title="Inicio"
          to="/"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Tareas"
          to="/tasks"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const drawer = ref(false);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
