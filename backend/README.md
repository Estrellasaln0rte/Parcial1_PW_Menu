# Backend
Backend de la aplicación desarrollado con **Node.js + Express**. Su función principal es recibir las solicitudes del frontend y gestionar el envío de correos mediante **Resend**.

## Tecnologías

- Node.js
- Express
- Resend
- CORS
- dotenv

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

## Configuración de variables de entorno
Para el manejo de API Resend, se debe crear un archivo local `.env` dentro de la carpeta `backend/` ***(usar como base el archivo `.env.example`)***

Dentro del archivo, se debe agregar la API Key a utilizar
```
RESEND_API_KEY=XXXXXXXX
```
La API Key debe solicitarse al **responsable** del proyecto, y sustituir en lugar de 'XXXXXXXX'

El archivo `.env` está incluido en `.gitignore`, por lo que cada desarrollador debe mantener su archivo localmente. El archivo no se comparte mediante Git. 

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
Este formato es procesado por Resend y reenviado al correo asignado del negocio, descrito en `server.js`


