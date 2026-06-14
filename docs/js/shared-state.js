/*
  shared-state.js
  Estado compartido entre el panel de control y la vista de monitoreo.

  Durante la etapa de simulación se utiliza localStorage.
  Más adelante este archivo se adaptará para consumir telemetría real desde AWS.
*/

const STORAGE_KEYS = {
  state: "smart-car-state",
  history: "smart-car-history"
};

const DEFAULT_CAR_STATE = {
  online: true,
  movement: "detener",
  speed: 0,
  distanceCm: 100,
  mode: "Simulación",
  updatedAt: Date.now()
};

function readJson(key, fallbackValue) {
  // Lee un valor JSON desde localStorage y lo convierte a objeto.
  // Si la clave no existe o hay un error, devuelve el valor por defecto.
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`No fue posible leer ${key}:`, error);
    return fallbackValue;
  }
}

/**
 * Guarda el estado actual del auto en localStorage.
 * Combina el estado recibido con los valores por defecto y actualiza la marca de tiempo.
 *
 * @param {object} state - Estado parcial del auto que puede incluir movement, speed, distanceCm, mode, etc.
 * @returns {object} El estado normalizado y guardado en localStorage.
 */
function saveCarState(state) {
  const normalizedState = {
    ...DEFAULT_CAR_STATE,
    ...state,
    updatedAt: Date.now()
  };

  localStorage.setItem(
    STORAGE_KEYS.state,
    JSON.stringify(normalizedState)
  );

  return normalizedState;
}

/**
 * Recupera el estado del auto almacenado en localStorage.
 * Si no existe valor guardado, devuelve el estado por defecto.
 *
 * @returns {object} Estado del auto.
 */
function getCarState() {
  return readJson(STORAGE_KEYS.state, DEFAULT_CAR_STATE);
}

/**
 * Guarda el historial de comandos en localStorage.
 * Limita el tamaño del historial a 50 entradas para evitar almacenamiento excesivo.
 *
 * @param {Array<object>} history - Lista de comandos enviados.
 * @returns {Array<object>} Historial normalizado guardado.
 */
function saveCommandHistory(history) {
  const normalizedHistory = Array.isArray(history)
    ? history.slice(0, 50)
    : [];

  localStorage.setItem(
    STORAGE_KEYS.history,
    JSON.stringify(normalizedHistory)
  );

  return normalizedHistory;
}

/**
 * Recupera el historial de comandos desde localStorage.
 * Devuelve un arreglo vacío si no hay historial guardado.
 *
 * @returns {Array<object>} Historial de comandos.
 */
function getCommandHistory() {
  return readJson(STORAGE_KEYS.history, []);
}

/**
 * Elimina el historial compartido de localStorage.
 */
function clearSharedHistory() {
  localStorage.removeItem(STORAGE_KEYS.history);
}

/**
 * Permite sincronizar cambios de estado e historial entre pestañas o ventanas.
 * Cuando otra pestaña cambia una clave relevante en localStorage, llama al callback.
 *
 * @param {function} callback - Función a ejecutar con { state, history } actualizado.
 */
function subscribeToSharedState(callback) {
  window.addEventListener("storage", (event) => {
    const relevantKeys = [
      STORAGE_KEYS.state,
      STORAGE_KEYS.history
    ];

    if (relevantKeys.includes(event.key)) {
      callback({
        state: getCarState(),
        history: getCommandHistory()
      });
    }
  });
}