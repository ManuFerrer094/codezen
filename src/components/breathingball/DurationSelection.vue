<template>
  <div>
    <v-card-title class="headline">Selecciona la duración</v-card-title>
    <v-card-text>
      <v-radio-group v-model="internalDuration" @change="updateDuration" :mandatory="false">
        <v-radio label="1 minuto" :value="60"></v-radio>
        <v-radio label="3 minutos" :value="180"></v-radio>
        <v-radio label="5 minutos" :value="300"></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('previousStep')">Atrás</v-btn>
      <v-btn color="primary" @click="confirmDuration">Confirmar</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'DurationSelection',
  props: ['selectedDuration'],
  data() {
    return {
      internalDuration: this.selectedDuration || 60,
    };
  },
  methods: {
    updateDuration(value) {
      this.$emit('update:selectedDuration', value);
    },
    confirmDuration() {
      this.$emit('confirmDuration', this.internalDuration);
    }
  }
};
</script>

<style scoped>
.headline {
  font-size: 24px;
  margin-bottom: 16px;
}

.v-radio-group {
  margin-top: 16px;
}

.v-radio {
  margin-bottom: 8px;
}
</style>
