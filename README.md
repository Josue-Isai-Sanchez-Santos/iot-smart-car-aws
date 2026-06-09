# IoT Smart Car AWS

Proyecto de carrito IoT controlado desde una interfaz web adaptable a celular y computadora.

## Estado actual

Primera etapa completada:

- Panel web funcional.
- Controles táctiles.
- Control mediante teclado.
- Ajuste de velocidad.
- Historial de comandos.
- Parada de emergencia.
- Modo simulación.
- Diseño adaptable para dispositivos móviles.

## Arquitectura planeada

```text
GitHub Pages
      │
      ▼
API Gateway
      │
      ▼
AWS Lambda
      │
      ▼
AWS IoT Core
      │
      ▼
ESP32
      │
      ▼
Arduino UNO + shield de motores