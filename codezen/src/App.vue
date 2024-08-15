<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>CodeZen</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Inicio</v-btn>
      <v-btn text to="/my-reflections">Mis Reflexiones</v-btn>
      <v-btn text to="/end-of-day">Final</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'App'
};
</script>

<style>
/* Añade estilos globales si es necesario */
</style>
