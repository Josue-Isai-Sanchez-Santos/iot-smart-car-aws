# IoT Smart Car AWS

Proyecto de carrito IoT controlado desde una interfaz web adaptable a celular y computadora.

La solución utiliza una página web publicada mediante GitHub Pages. La arquitectura planeada incorpora Amazon API Gateway, AWS Lambda y AWS IoT Core para enviar comandos al módulo ESP32 del vehículo.

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

Primera etapa completada:

- Panel web funcional.
- Controles táctiles.
- Control mediante teclado con WASD y flechas.
- Ajuste de velocidad.
- Historial de comandos.
- Botón de parada de emergencia.
- Modo simulación.
- Diseño adaptable para celular y computadora.
- Publicación mediante GitHub Pages.
- Vista secundaria de monitoreo de solo lectura.
- Sincronización local entre pestañas mediante localStorage.

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

## Próximas etapas

- Validar físicamente el kit cuando llegue.
- Identificar el controlador integrado de motores.
- Probar el firmware oficial.
- Configurar AWS IoT Core.
- Crear una función AWS Lambda.
- Crear un endpoint en API Gateway.
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