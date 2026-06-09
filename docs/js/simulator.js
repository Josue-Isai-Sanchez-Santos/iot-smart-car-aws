/*
  simulator.js
  Implementación simple de un simulador local para el coche.
  - Mantiene el `state` actual del vehículo.
  - `sendCommand(command)` actualiza el estado y devuelve una respuesta similar a la de un backend.
  - `updateDistance(action)` simula cambios en la distancia frontal según la acción.
*/

const simulator = {
  // Estado interno del simulador (puede ampliarse con más propiedades)
  state: {
    online: true,
    movement: "detener",
    speed: 60,
    distanceCm: 100
  },

  /**
   * Recibe un objeto comando y aplica los cambios al estado.
   * @param {{action: string, speed: number, timestamp: number}} command
   * @returns {object} respuesta con el estado actualizado
   */
  sendCommand(command) {
    // Actualizamos movimiento y velocidad según el comando
    this.state.movement = command.action;
    this.state.speed = command.speed;

    // Simulamos el efecto sobre la distancia frontal
    this.updateDistance(command.action);

    return {
      ok: true,
      mode: "simulator",
      state: { ...this.state }
    };
  },

  /**
   * Simula la variación de la distancia frontal en función de la acción.
   * - 'adelante' reduce la distancia (pero no menos de 5 cm)
   * - 'atras' aumenta la distancia (tope en 300 cm)
   */
  updateDistance(action) {
    if (action === "adelante") {
      this.state.distanceCm = Math.max(
        5,
        this.state.distanceCm - Math.floor(Math.random() * 5 + 1)
      );
    }

    if (action === "atras") {
      this.state.distanceCm = Math.min(
        300,
        this.state.distanceCm + Math.floor(Math.random() * 5 + 1)
      );
    }
  }
};