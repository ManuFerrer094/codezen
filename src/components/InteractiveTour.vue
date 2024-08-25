<template>
    <div v-if="currentStep" class="tour-overlay">
      <!-- Tooltip del tour -->
      <div :style="tooltipStyles" class="tour-card v-card v-sheet">
        <div class="tour-content">
          <div class="tour-header">
            <h3 class="tour-title">{{ currentStep.title }}</h3>
            <v-btn icon @click="endTour" class="close-button">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <p class="tour-text">{{ currentStep.content }}</p>
          <div class="tour-buttons">
            <v-btn v-if="currentIndex > 0" @click="prevStep" outlined> Atrás </v-btn>
            <v-btn v-if="currentIndex < steps.length - 1" @click="nextStep" outlined> Siguiente </v-btn>
            <v-btn v-if="currentIndex === steps.length - 1" @click="endTour" color="primary"> Finalizar </v-btn>
          </div>
        </div>
      </div>
      <!-- Resaltado del elemento objetivo -->
      <div :style="highlightStyles" class="tour-highlight"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      steps: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        currentIndex: -1,
      };
    },
    computed: {
      currentStep() {
        return this.steps[this.currentIndex];
      },
      tooltipStyles() {
        if (!this.currentStep) return {};
        const element = document.querySelector(this.currentStep.target);
        if (!element) return {};
  
        const rect = element.getBoundingClientRect();
        return {
          position: 'absolute',
          top: `${rect.bottom + window.scrollY + 10}px`,
          left: `${rect.left + window.scrollX}px`,
          zIndex: 1001,
          maxWidth: '300px',
        };
      },
      highlightStyles() {
        if (!this.currentStep) return {};
        const element = document.querySelector(this.currentStep.target);
        if (!element) return {};
  
        const rect = element.getBoundingClientRect();
        return {
          position: 'absolute',
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          border: '2px solid #6200ea', // Color primario de Vuetify
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        };
      },
    },
    methods: {
      startTour() {
        this.currentIndex = 0;
        this.scrollToStep();
      },
      nextStep() {
        if (this.currentIndex < this.steps.length - 1) {
          this.currentIndex++;
          this.scrollToStep();
        }
      },
      prevStep() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.scrollToStep();
        }
      },
      endTour() {
        this.currentIndex = -1;
      },
      scrollToStep() {
        const element = document.querySelector(this.currentStep.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .tour-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
  }
  
  .tour-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    pointer-events: auto;
  }
  
  .tour-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .tour-title {
    margin: 0;
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
  
  .tour-text {
    color: #666;
    margin: 0 0 20px 0;
  }
  
  .close-button {
    color: #999;
  }
  
  .tour-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .tour-highlight {
    background-color: rgba(98, 0, 234, 0.1); /* Color primario de Vuetify con transparencia */
    border: 2px solid #6200ea; /* Color primario de Vuetify */
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  </style>
  