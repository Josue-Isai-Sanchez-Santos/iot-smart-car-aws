# Checklist de pruebas

## Pruebas de publicación

- [x] El proyecto abre correctamente con Live Server.
- [x] El proyecto abre correctamente desde GitHub Pages.
- [x] La ruta principal carga `index.html`.
- [x] La ruta `/monitor.html` carga la vista de monitoreo.

## Pruebas del panel principal

- [x] El botón Adelante cambia el movimiento a Adelante.
- [x] El botón Atrás cambia el movimiento a Atrás.
- [x] El botón Izquierda cambia el movimiento a Izquierda.
- [x] El botón Derecha cambia el movimiento a Derecha.
- [x] Al soltar un botón direccional, el movimiento cambia a Detenido.
- [x] El botón STOP detiene el movimiento.
- [x] La parada de emergencia cambia el estado a Emergencia.
- [x] El slider de velocidad actualiza el porcentaje mostrado.
- [x] El historial registra los comandos ejecutados.
- [x] El botón Limpiar borra el historial.

## Pruebas de teclado

- [x] La tecla W o flecha arriba ejecuta Adelante.
- [x] La tecla S o flecha abajo ejecuta Atrás.
- [x] La tecla A o flecha izquierda ejecuta Izquierda.
- [x] La tecla D o flecha derecha ejecuta Derecha.
- [x] Al soltar la tecla, el movimiento cambia a Detenido.

## Pruebas de seguridad simulada

- [x] Si la pestaña pierde el foco, se ejecuta Detener.
- [x] Si la ventana pierde foco, se ejecuta Detener.
- [x] Si cambia la visibilidad de la pestaña, se ejecuta Detener.

## Pruebas de monitoreo

- [x] `monitor.html` muestra telemetría en modo solo lectura.
- [x] `monitor.html` muestra el historial de comandos.
- [x] `monitor.html` no contiene botones de movimiento.
- [x] `monitor.html` permite volver al panel principal.
- [x] La sincronización mediante `localStorage` funciona entre pestañas del mismo navegador.

## Pendiente con hardware real

- [ ] Validar motores.
- [ ] Validar sensor ultrasónico.
- [ ] Validar servo.
- [ ] Validar cámara.
- [ ] Validar comunicación ESP32 con Arduino UNO.
- [ ] Validar conexión MQTT con AWS IoT Core.
- [ ] Validar parada automática por pérdida de conexión.

#### Pruebas de AWS API Gateway + Lambda

- [x] Lambda ejecuta correctamente con evento de prueba.
- [x] Lambda valida acciones permitidas.
- [x] Lambda responde con `ok: true` para comandos válidos.
- [x] API Gateway fue creado correctamente.
- [x] API Gateway tiene la ruta `POST /commands`.
- [x] API Gateway invoca la función Lambda.
- [x] CORS permite llamadas desde GitHub Pages.
- [x] PowerShell recibe respuesta `StatusCode: 200`.
- [x] GitHub Pages envía peticiones reales a API Gateway.
- [x] DevTools muestra `OPTIONS /commands` con estado `204`.
- [x] DevTools muestra `POST /commands` con estado `200`.
- [x] El dashboard muestra `AWS Lambda Simulada`.