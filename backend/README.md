# Backend
Backend de la aplicación desarrollado con **Node.js + Express**. Su función principal es recibir las solicitudes del frontend y gestionar el envío de correos mediante **Resend**.

## Tecnologías

- Node.js
- Express
- Resend
- CORS
- dotenv
- express-rate-limit

## Estructura

```text
backend/
├── .env                 # Variables de entorno 
├── server.js            # Servidor y endpoints
├── package.json         # Configuración y dependencias
├── package-lock.json
└── node_modules/        # Dependencias ya instaladas
```

## Requisitos
- Tener instalado Node.js y npm. 

Para verificar su instalación: 
```
node --version
npm --version
```

## Instalación
Desde la carpeta backend, correr el comando:
```
npm install
```
Esto instalará las dependencias definidas en `package.json`

### Dependencias
|Dependencia |Uso|
|---|---|
Express | Creación del servidor y endpoints
|Resend|Envío de correos|
|CORS| Comunicación entre frontend y backend |
|dotenv | Manejo de variables de entorno
| express-rate-limit | Limitación de solicitudes para protección contra spam

## Configuración de variables de entorno
Para el manejo de API Resend, se debe crear un archivo local `.env` dentro de la carpeta `backend/` 

Se puede utilizar `.env.example` como plantilla.

Dentro del archivo, agregar:
```
RESEND_API_KEY=XXXXXXXX
```
La API Key debe solicitarse al **responsable** del proyecto, y sustituir en lugar de 'XXXXXXXX'

El archivo `.env` está incluido en `.gitignore`, por lo que cada desarrollador debe mantener su archivo localmente. **El archivo no se comparte mediante Git.**

## Ejecución

Desde `backend/`

```
node server.js
```
El servidor estará disponible en: 
```
http://localhost:3000
```

Al mismo tiempo, se debe ejecutar `React` desde otra terminal en la carpeta raíz del proyecto:
```
npm run dev
```
Por defecto, React está disponible en: 
```
http://localhost:5173
```
## Endpoint

**`POST /api/contacto`** : Recibe los datos del formulario de contacto desde React y solicita a Resend el envío del correo, recibiendolo en la URL local: 
```
http://localhost:3000/api/contacto
```
En formato JSON: 
```
{
  "nombre": "Nombre del usuario",
  "email": "usuario@email.com",
  "mensaje": "Mensaje de contacto"
}
```
El backend procesa los datos recibidos y utiliza Resend para enviar el mensaje al correo configurado en `server.js`.

## Protección contra spam
El endpoint de contacto utiliza `express-rate-limit` para limitar la cantidad de solicitudes que puede realizar una misma dirección IP durante un período determinado.

Actualmente se permiten: 
- 5 solicitudes
- Cada 15 minutos

Además, el backend cuenta con validaciones básicas y mecanismos para rechazar mensajes inválidos o solicitudes repetidas.
