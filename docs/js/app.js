/*
  app.js
  Interacción de la interfaz con el simulador/servicio remoto.
  Comentarios añadidos para facilitar la comprensión del flujo.
*/

// --- Referencias DOM ---
const movementValue = document.getElementById("movement-value");
const speedValue = document.getElementById("speed-value");
const distanceValue = document.getElementById("distance-value");
const speedLabel = document.getElementById("speed-label");
const speedRange = document.getElementById("speed-range");
const commandHistory = document.getElementById("command-history");
const stopButton = document.getElementById("stop-button");
const emergencyButton = document.getElementById("emergency-button");
const clearHistoryButton = document.getElementById("clear-history-button");
const directionButtons = document.querySelectorAll("[data-action]");

// --- Mapeo de teclado a acciones ---
const keyMap = {
  ArrowUp: "adelante",
  w: "adelante",
  W: "adelante",

  ArrowDown: "atras",
  s: "atras",
  S: "atras",

  ArrowLeft: "izquierda",
  a: "izquierda",
  A: "izquierda",

  ArrowRight: "derecha",
  d: "derecha",
  D: "derecha"
};

// --- Estado local de control ---
let currentAction = "detener"; // acción actual enviada al simulador
let activeKey = null;           // tecla física que mantiene la acción activa
let heartbeatInterval = null;   // intervalo que reenvía comandos mientras se mantiene la acción

// Historial de comandos compartido entre la UI y el almacenamiento local.
// Se carga inicialmente desde localStorage para mostrar el historial guardado.
let sharedHistory = getCommandHistory();

/**
 * Devuelve la velocidad seleccionada en el control deslizante como número.
 */
function getSpeed() {
  return Number(speedRange.value);
}

/**
 * Traduce una acción técnica a una etiqueta legible para mostrar en la UI.
 */
function translateAction(action) {
  const labels = {
    adelante: "Adelante",
    atras: "Atrás",
    izquierda: "Izquierda",
    derecha: "Derecha",
    detener: "Detenido",
    emergencia: "Emergencia"
  };

  return labels[action] ?? action;
}

/**
 * Renderiza el historial de comandos en pantalla.
 * Si no hay entradas, muestra un mensaje por defecto.
 */
function renderControlHistory() {
  if (sharedHistory.length === 0) {
    commandHistory.innerHTML = "<li>No se han enviado comandos.</li>";
    return;
  }

  commandHistory.innerHTML = "";

  sharedHistory.forEach((entry) => {
    const item = document.createElement("li");

    item.textContent =
      `${entry.time} — ${translateAction(entry.action)} — ${entry.speed} %`;

    commandHistory.appendChild(item);
  });
}

/**
 * Añade una nueva entrada al historial compartido y la guarda en localStorage.
 * Luego vuelve a renderizar la lista para mostrar el nuevo comando.
 */
function addHistory(action, speed) {
  const entry = {
    time: new Date().toLocaleTimeString(),
    action,
    speed,
    createdAt: Date.now()
  };

  sharedHistory.unshift(entry);
  sharedHistory = saveCommandHistory(sharedHistory);

  renderControlHistory();
}

/**
 * Actualiza los valores visibles del dashboard y guarda el estado actual del auto.
 */
function updateDashboard(response) {
  const state = response.state;

  movementValue.textContent = translateAction(state.movement);
  speedValue.textContent = state.speed;
  distanceValue.textContent = state.distanceCm;

  const mode = state.mode ?? "Simulación";

  document.getElementById("mode-value").textContent = mode;

  const connectionStatus = document.getElementById("connection-status");
  connectionStatus.innerHTML = '<span class="status-dot"></span> ' + mode;

  saveCarState({
    online: state.online ?? true,
    movement: state.movement,
    speed: state.speed,
    distanceCm: state.distanceCm,
    mode
  });
}

/**
 * Envía un comando al adaptador `sendCarCommand` (api.js).
 * - Calcula la velocidad (0 si la acción es detener/emergencia)
 * - Actualiza la UI con la respuesta
 * - Guarda en el historial si `saveHistory` es true
 */
async function executeCommand(action, saveHistory = true) {
  try {
    const speed = action === "detener" || action === "emergencia"
      ? 0
      : getSpeed();

    const response = await sendCarCommand(action, speed);

    currentAction = action;
    updateDashboard(response);

    if (saveHistory) {
      addHistory(action, speed);
    }
  } catch (error) {
    console.error("No fue posible enviar el comando:", error);
  }
}

/**
 * Inicia el envío repetido de comandos para mantener la acción mientras se mantiene
 * presionado el control (botón o tecla). Evita reiniciar si ya está en la misma acción.
 */
function startMovement(action) {
  if (currentAction === action) {
    return;
  }

  executeCommand(action);

  clearInterval(heartbeatInterval);

  // Reenvía el comando cada 500 ms sin guardar en historial
  heartbeatInterval = setInterval(() => {
    executeCommand(action, false);
  }, 500);
}

/**
 * Detiene el movimiento: limpia intervalos y envía comando 'detener' si es necesario.
 */
function stopMovement() {
  clearInterval(heartbeatInterval);
  heartbeatInterval = null;

  if (currentAction !== "detener") {
    executeCommand("detener");
  }
}

// --- Manejadores de eventos para los botones direccionales ---
directionButtons.forEach((button) => {
  const action = button.dataset.action;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.classList.add("active");
    startMovement(action);
  });

  // Al soltar o cancelar, quitamos la clase activa y detenemos
  button.addEventListener("pointerup", () => {
    button.classList.remove("active");
    stopMovement();
  });

  button.addEventListener("pointerleave", () => {
    button.classList.remove("active");
    stopMovement();
  });

  button.addEventListener("pointercancel", () => {
    button.classList.remove("active");
    stopMovement();
  });
});

// Botón STOP: detiene inmediatamente
stopButton.addEventListener("click", stopMovement);

// Botón de emergencia: limpia intervalos y envía la acción de emergencia
emergencyButton.addEventListener("click", () => {
  clearInterval(heartbeatInterval);
  heartbeatInterval = null;

  executeCommand("emergencia");
});

// Al cambiar la velocidad, actualizamos la etiqueta y reenviamos el comando si está en movimiento
speedRange.addEventListener("input", () => {
  speedLabel.textContent = speedRange.value;

  if (currentAction !== "detener" && currentAction !== "emergencia") {
    executeCommand(currentAction, false);
  }
});

clearHistoryButton.addEventListener("click", () => {
  // Borra el historial en memoria, en localStorage y actualiza la vista.
  sharedHistory = [];
  clearSharedHistory();
  renderControlHistory();
});

// --- Manejo de teclado: iniciar movimiento con keydown y detener con keyup ---
document.addEventListener("keydown", (event) => {
  const action = keyMap[event.key];

  if (!action || activeKey) {
    return;
  }

  event.preventDefault();

  activeKey = event.key;
  startMovement(action);
});

document.addEventListener("keyup", (event) => {
  if (event.key !== activeKey) {
    return;
  }

  activeKey = null;
  stopMovement();
});

// Si la ventana pierde foco o la pestaña no está visible, detener por seguridad
window.addEventListener("blur", stopMovement);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopMovement();
  }
});
