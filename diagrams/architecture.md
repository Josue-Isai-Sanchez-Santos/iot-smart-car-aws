# Arquitectura del carrito IoT

## 1. Objetivo

El sistema permitirá controlar un carrito IoT desde una página web adaptable a celular y computadora.

La página se publica mediante GitHub Pages. Actualmente AWS se utiliza como intermediario mediante API Gateway y Lambda en modo simulado. Posteriormente se integrará AWS IoT Core para comunicar la nube con el módulo ESP32 instalado en el vehículo.

## 2. Arquitectura actual implementada

La etapa actualmente implementada valida la comunicación entre la página web y AWS mediante API Gateway y Lambda.

```mermaid
flowchart TD
    A[GitHub Pages<br>Panel web] --> B[Amazon API Gateway<br>POST /commands]
    B --> C[AWS Lambda<br>iot-smart-car-command]
    C --> D[Respuesta JSON simulada]
    D --> A
```

Esta arquitectura permite comprobar:

```text
Publicación web
Peticiones HTTP POST
Configuración CORS
Invocación de Lambda desde API Gateway
Validación de comandos
Respuesta JSON simulada
Actualización del dashboard
```

Esta etapa todavía no controla hardware físico.

## 3. Flujo actual de un comando

Ejemplo: el usuario mantiene presionado el botón **Adelante**.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as GitHub Pages
    participant A as API Gateway
    participant L as AWS Lambda

    U->>W: Mantiene presionado Adelante
    W->>A: POST /commands
    A->>L: Invoca función Lambda
    L->>L: Valida acción y velocidad
    L->>A: Devuelve estado simulado
    A->>W: Respuesta JSON
    W->>W: Actualiza dashboard
```

## 4. Ruta HTTP implementada

```text
POST /commands
```

Ejemplo de solicitud:

```json
{
  "action": "adelante",
  "speed": 60,
  "timestamp": 1780459200000
}
```

Ejemplo de respuesta:

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

## 5. Validaciones actuales en Lambda

La función Lambda valida:

```text
Que la acción enviada esté permitida
Que la velocidad esté entre 0 y 100
Que el cuerpo JSON sea válido
```

Acciones permitidas:

```text
adelante
atras
izquierda
derecha
detener
emergencia
```

## 6. Arquitectura temporal de simulación local

Antes de utilizar AWS, el sistema también puede funcionar de manera local mediante `simulator.js`.

```mermaid
flowchart TD
    A[index.html<br>Panel de control] --> B[simulator.js]
    B --> C[Estado simulado]
    C --> D[localStorage]
    D --> E[monitor.html<br>Vista de solo lectura]
```

Esta etapa permite comprobar:

```text
Diseño del dashboard
Controles táctiles
Control por teclado
Historial
Parada de emergencia
Visualización de telemetría
Vista secundaria
```

## 7. Arquitectura general planeada

La siguiente fase agregará AWS IoT Core y comunicación MQTT hacia el ESP32.

```mermaid
flowchart TD
    A[Celular o computadora] --> B[GitHub Pages<br>HTML CSS JavaScript]
    B --> C[Amazon API Gateway]
    C --> D[AWS Lambda]
    D --> E[AWS IoT Core]
    E --> F[ESP32 con WiFi]
    F --> G[Arduino UNO R3]
    G --> H[Shield controlador de motores]
    H --> I[Motores]
    G --> J[Sensor ultrasónico]
    G --> K[Servo]
    F --> L[Cámara]
```

## 8. Flujo planeado con AWS IoT Core

```mermaid
sequenceDiagram
    participant U as Usuario
    participant W as GitHub Pages
    participant A as API Gateway
    participant L as Lambda
    participant I as AWS IoT Core
    participant E as ESP32
    participant R as Arduino UNO

    U->>W: Mantiene presionado Adelante
    W->>A: POST /commands
    A->>L: Invoca función
    L->>I: Publica mensaje MQTT
    I->>E: Entrega comando
    E->>R: Envía instrucción interna
    R->>R: Activa motores
```

## 9. Tópicos MQTT propuestos

```text
carrito/01/comandos
carrito/01/estado
carrito/01/telemetria
carrito/01/conexion
```

## 10. Telemetría propuesta

```json
{
  "online": true,
  "movimiento": "adelante",
  "velocidad": 60,
  "distancia_cm": 72,
  "timestamp": 1780459200500
}
```

## 11. Seguridad física

La seguridad del vehículo tendrá prioridad sobre la continuidad del movimiento.

El carrito deberá detenerse automáticamente cuando ocurra cualquiera de estas condiciones:

```text
El usuario suelta el botón
La pestaña pierde el foco
La conexión WiFi se interrumpe
AWS deja de responder
La ESP32 deja de recibir heartbeat
El usuario pulsa parada de emergencia
```

Mientras el usuario mantenga presionado un control, la página enviará periódicamente una señal de continuidad.

Si la ESP32 deja de recibir esa señal durante aproximadamente 750 milisegundos, detendrá los motores.

## 12. Seguridad lógica

La ESP32 utilizará:

```text
WiFi
MQTT
TLS
Certificados X.509
```

Los certificados, claves privadas y contraseñas no se almacenarán en GitHub.

La página web no tendrá acceso directo a los certificados privados del dispositivo.

La URL pública de API Gateway no se considera un mecanismo de seguridad. En una etapa posterior se agregará autenticación y control de permisos.

## 13. Hardware pendiente de validación

Cuando llegue el kit será necesario comprobar:

```text
Modelo exacto del módulo ESP32
Controlador de motores integrado en el shield
Asignación de pines
Comunicación entre ESP32 y Arduino UNO
Sensor ultrasónico
Servo
Cámara
Alimentación eléctrica
```