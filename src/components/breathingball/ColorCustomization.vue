<template>
  <div>
    <v-card-title class="headline">Personalización de Colores</v-card-title>
    <v-card-text>
      <div class="color-configuration">
        <div class="color-selectors">
          <label>Color de fondo:</label>
          <div class="color-input-container">
            <input type="color" :value="backgroundColor" @input="$emit('update:backgroundColor', $event.target.value)" class="color-input"/>
          </div>
          <label>Color de la esfera:</label>
          <div class="color-input-container">
            <input type="color" :value="sphereColor" @input="$emit('update:sphereColor', $event.target.value)" class="color-input"/>
          </div>
          <label>Color de la sombra:</label>
          <div class="color-input-container">
            <input type="color" :value="shadowColor" @input="$emit('update:shadowColor', $event.target.value)" class="color-input"/>
          </div>
        </div>
        <div class="preview-container" :style="{ backgroundColor: backgroundColor }">
          <div class="preview-sphere" :style="previewStyle"></div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('previousStep')">Atrás</v-btn>
      <v-btn color="primary" @click="$emit('nextStep')">Siguiente</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'ColorCustomization',
  props: ['backgroundColor', 'sphereColor', 'shadowColor'],
  computed: {
    previewStyle() {
      return {
        width: '100px',
        height: '100px',
        backgroundColor: this.sphereColor,
        boxShadow: `0px 10px 30px ${this.shadowColor}`,
        borderRadius: '50%',
        transition: 'all 0.3s ease-in-out',
      };
    }
  }
};
</script>

<style scoped>
.color-configuration {
  display: flex;
  justify-content: space-between;
}

.color-selectors {
  margin-right: 20px;
}

.color-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.color-input {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45vh;
  height: 30vh;
  transition: all 0.3s ease-in-out;
}

.preview-sphere {
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}
</style>
