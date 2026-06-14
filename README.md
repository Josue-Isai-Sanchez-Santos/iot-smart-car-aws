# IoT Smart Car AWS

Proyecto de carrito IoT controlado desde una interfaz web adaptable a celular y computadora.

La solución utiliza una página web publicada mediante GitHub Pages. La arquitectura actual ya integra Amazon API Gateway y AWS Lambda en modo simulado. La arquitectura planeada incorporará AWS IoT Core para enviar comandos al módulo ESP32 del vehículo.

## Demostración web

Panel principal:

```text
https://josue-isai-sanchez-santos.github.io/iot-smart-car-aws/
```

Vista de monitoreo:

```text
https://josue-isai-sanchez-santos.github.io/iot-smart-car-aws/monitor.html
```

## Estado actual

Etapa web y backend simulado completada:

- Panel web funcional.
- Controles táctiles.
- Control mediante teclado con WASD y flechas.
- Ajuste de velocidad.
- Historial de comandos.
- Botón de parada de emergencia.
- Modo simulación local.
- Diseño adaptable para celular y computadora.
- Publicación mediante GitHub Pages.
- Vista secundaria de monitoreo de solo lectura.
- Sincronización local entre pestañas mediante localStorage.
- Integración con Amazon API Gateway.
- Integración con AWS Lambda en modo simulado.
- Envío real de comandos desde GitHub Pages hacia AWS.

## Arquitectura actual implementada

```text
GitHub Pages
      │
      ▼
Amazon API Gateway
      │
      ▼
AWS Lambda
      │
      ▼
Respuesta simulada del carrito
```

Actualmente esta etapa permite validar:

- Publicación web mediante GitHub Pages.
- Peticiones HTTP POST desde el navegador.
- Configuración CORS.
- Invocación de Lambda desde API Gateway.
- Validación de comandos en Lambda.
- Respuesta JSON simulada.
- Actualización del dashboard con la respuesta de AWS.

Esta etapa todavía no controla hardware físico.

## Arquitectura planeada

```text
GitHub Pages
      │
      ▼
Amazon API Gateway
      │
      ▼
AWS Lambda
      │
      ▼
AWS IoT Core
      │
      ▼
Módulo ESP32 con WiFi
      │
      ▼
Arduino UNO R3 + shield de motores
      │
      ▼
Motores, servo y sensores
```

## Estado de integración con AWS

La ruta configurada en API Gateway es:

```text
POST /commands
```

El cuerpo enviado desde el panel web tiene este formato:

```json
{
  "action": "adelante",
  "speed": 60,
  "timestamp": 1780459200000
}
```

La respuesta simulada de Lambda tiene este formato:

```json
{
  "ok": true,
  "state": {
    "online": true,
    "movement": "adelante",
    "speed": 60,
    "distanceCm": 100,
    "mode": "AWS Lambda Simulada",
    "updatedAt": 1780459200500
  }
}
```

La función Lambda se encuentra documentada en:

```text
aws/lambda/publish-command.mjs
```

## Funciones del panel principal

El dashboard permite:

- Avanzar.
- Retroceder.
- Girar a la izquierda.
- Girar a la derecha.
- Detener el carrito.
- Activar una parada de emergencia.
- Ajustar la velocidad.
- Consultar el último movimiento.
- Consultar distancia frontal simulada.
- Revisar el historial de comandos.

## Controles mediante teclado

| Acción | Teclas |
|---|---|
| Avanzar | `W` o flecha arriba |
| Retroceder | `S` o flecha abajo |
| Girar a la izquierda | `A` o flecha izquierda |
| Girar a la derecha | `D` o flecha derecha |

## Estructura del repositorio

```text
iot-smart-car-aws/
├── aws/
│   ├── lambda/
│   │   └── publish-command.mjs
│   └── policies/
│
├── diagrams/
│   └── architecture.md
│
├── docs/
│   ├── index.html
│   ├── monitor.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── monitor.js
│   │   ├── shared-state.js
│   │   └── simulator.js
│   └── assets/
│       └── img/
│
├── firmware/
│   ├── arduino-uno/
│   └── esp32-camera/
│
├── tests/
│   └── checklist.md
│
├── .gitignore
└── README.md
```

## Ejecutar localmente

1. Clonar el repositorio.

```powershell
git clone https://github.com/Josue-Isai-Sanchez-Santos/iot-smart-car-aws.git
```

2. Abrir la carpeta en VS Code.

```powershell
cd iot-smart-car-aws
code .
```

3. Abrir:

```text
docs/index.html
```

4. Utilizar la extensión Live Server:

```text
Open with Live Server
```

## Cambiar entre simulador local y AWS

El archivo encargado de seleccionar el modo de operación es:

```text
docs/js/api.js
```

Para usar la API real:

```javascript
const API_MODE = "aws";
```

Para regresar al simulador local:

```javascript
const API_MODE = "simulator";
```

## Seguridad

Los siguientes archivos nunca deben subirse al repositorio:

```text
secrets.h
*.pem
*.key
*.crt
.env
.env.*
```

Estos archivos contendrán posteriormente:

- Contraseña WiFi.
- Certificados X.509.
- Claves privadas.
- Configuración sensible de AWS.

La URL pública de API Gateway no debe considerarse un mecanismo de seguridad. Más adelante se agregará autenticación y permisos más restrictivos.

## Próximas etapas

- Documentar configuración de API Gateway y Lambda.
- Configurar AWS IoT Core.
- Crear Thing para el carrito.
- Crear certificados X.509 para ESP32.
- Definir política IoT con permisos mínimos.
- Publicar comandos desde Lambda hacia AWS IoT Core.
- Validar físicamente el kit cuando llegue.
- Identificar el controlador integrado de motores.
- Probar el firmware oficial.
- Integrar el módulo ESP32 con MQTT.
- Sustituir telemetría simulada por datos reales.
- Integrar la cámara.
- Agregar autenticación.

## Repositorios históricos

Este proyecto corresponde a una segunda versión mejorada de un ejercicio académico anterior:

```text
https://github.com/Josue-Isai-Sanchez-Santos/Iot-car-control
```

```text
https://github.com/Josue-Isai-Sanchez-Santos/Iot-car-monitor
```

Los repositorios anteriores se conservan como evidencia de la evolución del proyecto.