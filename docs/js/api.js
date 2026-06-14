/*
  api.js
  Adaptador para enviar comandos al vehículo.

  Modos disponibles:
  - simulator: usa simulación local
  - aws: envía comandos a API Gateway + Lambda
*/

const API_MODE = "aws";

const API_URL = "https://izuptepuj7.execute-api.us-east-2.amazonaws.com/commands";

async function sendCarCommand(action, speed) {
  const command = {
    action,
    speed,
    timestamp: Date.now()
  };

  if (API_MODE === "simulator") {
    return simulator.sendCommand(command);
  }

  if (API_MODE === "aws") {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error ?? "Error al enviar comando a AWS");
    }

    return data;
  }

  throw new Error("API_MODE no válido.");
}