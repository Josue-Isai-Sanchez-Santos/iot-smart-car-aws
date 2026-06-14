/*
  monitor.js
  Vista de solo lectura para mostrar el estado compartido del carrito.
  Este archivo muestra los datos guardados en localStorage y se
  actualiza automáticamente cuando otro panel hace cambios.
*/

// --- Referencias a elementos del DOM del monitor ---
const monitorMovement = document.getElementById("monitor-movement");
const monitorSpeed = document.getElementById("monitor-speed");
const monitorDistance = document.getElementById("monitor-distance");
const monitorMode = document.getElementById("monitor-mode");
const monitorUpdatedAt = document.getElementById("monitor-updated-at");
const monitorHistory = document.getElementById("monitor-history");
const monitorStatus = document.getElementById("monitor-status");

/**
 * Traduce una acción técnica del carrito a una etiqueta legible.
 *
 * @param {string} action - Acción como 'adelante', 'atras', 'izquierda', etc.
 * @returns {string} Etiqueta de visualización.
 */
function translateMonitorAction(action) {
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
 * Lee el estado del carrito compartido y actualiza los elementos del monitor.
 * Muestra movimiento, velocidad, distancia, modo, hora de actualización y estado.
 */
function renderMonitorState() {
  const state = getCarState();

  monitorMovement.textContent = translateMonitorAction(state.movement);
  monitorSpeed.textContent = state.speed;
  monitorDistance.textContent = state.distanceCm;
  monitorMode.textContent = state.mode;
  monitorUpdatedAt.textContent =
    new Date(state.updatedAt).toLocaleTimeString();

  monitorStatus.innerHTML = state.online
    ? '<span class="status-dot"></span> Simulación activa'
    : '<span class="status-dot"></span> Sin conexión';
}

/**
 * Renderiza el historial de comandos guardado en localStorage.
 * Si no hay entradas, muestra un mensaje por defecto.
 */
function renderMonitorHistory() {
  const history = getCommandHistory();

  if (history.length === 0) {
    monitorHistory.innerHTML = "<li>No se han enviado comandos.</li>";
    return;
  }

  monitorHistory.innerHTML = "";

  history.forEach((entry) => {
    const item = document.createElement("li");

    item.textContent =
      `${entry.time} — ${translateMonitorAction(entry.action)} — ${entry.speed} %`;

    monitorHistory.appendChild(item);
  });
}

/**
 * Observa cambios en el estado compartido y actualiza la vista del monitor.
 * Esto permite que el monitor se mantenga sincronizado cuando otro panel
 * modifica el estado o el historial.
 */
subscribeToSharedState(() => {
  renderMonitorState();
  renderMonitorHistory();
});

// Render inicial al cargar la página.
renderMonitorState();
renderMonitorHistory();