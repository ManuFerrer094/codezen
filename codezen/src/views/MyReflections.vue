<template>
    <v-container class="my-reflections" fluid>
      <v-card class="pa-4">
        <v-card-title class="text-h5">Mis Reflexiones</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="reflections"
            class="elevation-1"
          >
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.date="{ item }">
              {{ item.date }}
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template #item.text="{ item }">
              {{ item.text }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </template>  
  <script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Fecha', value: 'date' },
          { text: 'Reflexión', value: 'text' }
        ],
        reflections: []
      };
    },
    mounted() {
      this.loadReflections();
    },
    methods: {
      loadReflections() {
        this.reflections = JSON.parse(localStorage.getItem('reflections')) || [];
      }
    }
  };
  </script>
  
  <style scoped>
  .my-reflections {
    margin-top: 40px;
  }
  </style>
  