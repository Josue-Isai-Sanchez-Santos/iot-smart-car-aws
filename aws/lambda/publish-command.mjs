/*
  publish-command.mjs
  Lambda de ejemplo que recibe un comando de movimiento y devuelve
  un estado simulado del carrito.

  Esta función está diseñada para recibir un POST con JSON en el cuerpo
  y validar tanto la acción como la velocidad. Si los datos son válidos,
  responde con el nuevo estado del vehículo en modo simulado.
*/

// Lista de acciones permitidas para el carrito.
const allowedActions = [
  "adelante",
  "atras",
  "izquierda",
  "derecha",
  "detener",
  "emergencia"
];

/**
 * Handler principal exportado por AWS Lambda.
 * Recibe el evento HTTP y procesa el comando enviado en el cuerpo.
 */
export const handler = async (event) => {
  try {
    // Parseamos el cuerpo JSON; si no existe, usamos un objeto vacío.
    const body = JSON.parse(event.body ?? "{}");

    const action = body.action;
    const speed = Number(body.speed ?? 0);

    // Verifica que la acción recibida esté dentro de la lista permitida.
    if (!allowedActions.includes(action)) {
      return response(400, {
        ok: false,
        error: "Acción no permitida"
      });
    }

    // Verifica que la velocidad sea un número entre 0 y 100.
    if (speed < 0 || speed > 100) {
      return response(400, {
        ok: false,
        error: "Velocidad fuera de rango"
      });
    }

    // Si todo es válido, devolvemos un estado simulado del vehículo.
    return response(200, {
      ok: true,
      state: {
        online: true,
        movement: action,
        speed,
        distanceCm: 100,
        mode: "AWS Lambda Simulada",
        updatedAt: Date.now()
      }
    });
  } catch (error) {
    return response(500, {
      ok: false,
      error: "Error interno"
    });
  }
};

/**
 * Crea una respuesta HTTP estándar para Lambda.
 * Incluye cabeceras CORS para permitir llamadas desde el navegador.
 */
function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    body: JSON.stringify(body)
  };
}