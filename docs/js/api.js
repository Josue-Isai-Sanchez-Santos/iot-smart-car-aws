/*
  api.js
  Archivo adaptador para enviar comandos al vehículo.
  - `API_MODE` controla si usamos el simulador local o la conexión real a AWS.
  - `sendCarCommand(action, speed)` prepara el objeto comando y lo envía
    al destino correspondiente.
*/

// Modo actual: 'simulator' usa el objeto `simulator` definido en simulator.js
const API_MODE = "simulator";

/**
 * Envía un comando al vehículo (simulado o real).
 * @param {string} action - acción como 'adelante', 'atras', 'izquierda', etc.
 * @param {number} speed - velocidad en porcentaje (0-100)
 * @returns respuesta del backend / simulador con el estado actualizado
 */
async function sendCarCommand(action, speed) {
  const command = {
    action,
    speed,
    timestamp: Date.now()
  };

  // Si estamos en modo simulador, delegamos en el objeto `simulator`.
  if (API_MODE === "simulator") {
    return simulator.sendCommand(command);
  }

  // Si se añadiera integración con AWS, aquí iría la lógica de red.
  throw new Error("La conexión con AWS todavía no está configurada.");
}