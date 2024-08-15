<template>
    <div class="game-container">
      <div class="line"></div>
      <div class="ball" :style="{ bottom: ballPosition + '%', transition: transitionDuration }"></div>
    </div>
    <p class="countdown">{{ countdown }}</p> <!-- Temporizador visible en pantalla -->
  </template>
  
  <script>
  export default {
    data() {
      return {
        ballPosition: 0, // Posición inicial de la bola (abajo)
        transitionDuration: '0s', // Duración de la transición de la bola, controlada dinámicamente
        phase: 0, // 0: Inhalar, 1: Retener, 2: Exhalar, 3: Esperar
        countdown: 3, // Cuenta regresiva visible en pantalla
        phaseDurations: [3000, 4000, 6000, 2000], // Duraciones de cada fase en milisegundos
        currentCountdown: null, // Intervalo para manejar la cuenta regresiva
      };
    },
    mounted() {
      this.startGame(); // Comienza el ejercicio al montar el componente
    },
    methods: {
      startGame() {
        this.moveBall(); // Inicia el movimiento de la bola
      },
      moveBall() {
        // Configura la transición de la bola para la duración de la fase actual
        this.transitionDuration = `${this.phaseDurations[this.phase] / 1000}s`;
  
        switch (this.phase) {
          case 0: // Inhalar
            this.ballPosition = 100; // La bola sube
            this.startCountdown(3);
            break;
          case 1: // Retener
            this.startCountdown(4);
            break;
          case 2: // Exhalar
            this.ballPosition = 0; // La bola baja lentamente
            this.startCountdown(6);
            break;
          case 3: // Esperar
            this.startCountdown(2);
            break;
        }
  
        // Cambia a la siguiente fase después de la duración correspondiente
        setTimeout(() => {
          this.phase = (this.phase + 1) % 4; // Cambia a la siguiente fase
          this.moveBall(); // Mueve la bola de acuerdo a la nueva fase
        }, this.phaseDurations[this.phase]);
      },
      startCountdown(seconds) {
        clearInterval(this.currentCountdown); // Limpia cualquier intervalo anterior
        this.countdown = seconds;
        this.currentCountdown = setInterval(() => {
          this.countdown--;
          if (this.countdown === 0) {
            clearInterval(this.currentCountdown); // Detén la cuenta regresiva cuando llegue a 0
          }
        }, 1000);
      }
    },
    beforeUnmount() {
      clearInterval(this.currentCountdown); // Limpia cualquier intervalo cuando el componente se desmonte
    }
  };
  </script>
  
  <style scoped>
  .game-container {
    position: relative;
    height: 300px;
    width: 100px;
    margin: 20px auto;
  }
  
  .line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 100%;
    background-color: #42b983;
  }
  
  .ball {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background-color: #ffdd57;
    border-radius: 50%;
  }
  
  .countdown {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
  }
  </style>
  