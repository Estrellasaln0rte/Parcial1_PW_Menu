# Comedor La Placita
Página web para **Comedor La Placita**, desarrollada como una aplicación web moderna para presentar el menú del negocio, facilitar la navegación de los clientes y proporcionar un medio de contacto directo.

El proyecto fue desarrollado utilizando **React + Vite** para el frontend y **Node.js + Express** para el backend.


## Descripción
El proyecto surge a partir de las necesidades planteadas por el cliente, entre ellas:

- Mejorar la experiencia de navegación en dispositivos móviles.
- Facilitar el acceso a la información del menú.
- Permitir filtrar los productos por categoría.
- Separar la información del menú del código de la aplicación para facilitar su mantenimiento.
- Incorporar un formulario de contacto para consultas y reservas.
- Evitar mensajes vacíos, inválidos o generados automáticamente.
- Mejorar la accesibilidad de la página.
- Proporcionar una experiencia visual moderna y consistente.
- Mantener una estructura organizada que permita realizar cambios sin afectar funcionalidades existentes.

## Funcionalidades principales

### Diseño responsive
La interfaz se adapta a diferentes tamaños de pantalla, especialmente a dispositivos móviles, para evitar problemas de distribución y mejorar la experiencia de navegación.

### Accesibilidad
Se incorporan prácticas de accesibilidad para facilitar el uso de la página mediante lectores de pantalla y otras tecnologías de asistencia.

Entre ellas:
- Estructura semántica.
- Etiquetas descriptivas en formularios.
- Nombres claros para botones.
- Texto alternativo en imágenes.
- Mensajes de error identificables.
- Manejo adecuado del foco en campos con errores.

### Menú dinámico
Los productos del menú se almacenan mediante archivos JSON en `public/data/`, separados de la estructura visual de la aplicación.

Las categorías y productos se administran de forma independiente, cada producto hace referencia a una categoría mediante un identificador. Esto permite agregar o modificar productos y categorías sin cambiar los componentes de React.

### Filtro por categorías 

Los usuarios pueden seleccionar una categoría para visualizar únicamente los productos correspondientes.

| Todos | Desayunos | Almuerzos | Bebidas | Postres | .... |
| --- | --- | --- | --- | --- | --- |

### Formulario de contacto 
La aplicación incluye un formulario para que los clientes puedan enviar consultas o solicitudes de reserva.

Los datos principales son:
- Nombre
- Correo electrónico
- Mensaje

**Validación y protección contra spam**

El formulario cuenta con validaciones en el frontend para proporcionar retroalimentación inmediata al usuario. El backend realiza validaciones mínimas adicionales antes de procesar una solicitud.

Se incluyen:
- Validación de campos.
- Validación básica de tipos de datos.
- Rechazo de campos vacíos.
- Rechazo de mensajes que contienen únicamente números o símbolos.
- Honeypot para detectar bots.
- Protección contra mensajes repetidos.
- Limitación de solicitudes mediante `express-rate-limit`: el endpoint permite un máximo de **5 solicitudes cada 15 minutos** por IP. 

### Agregar productos a pedido

Los usuarios pueden agregar productos del menú a un pedido mediante el botón **"Agregar"**. Se puede aumentar o disminuir la cantidad de productos a incluir en el pedido. 

Los productos seleccionados se almacenan temporalmente mientras el usuario navega por el menú.

El usuario puede:
- Agregar uno o varios productos al pedido.
- Continuar navegando por diferentes categorías.
- Revisar los productos seleccionados en la sección de 'Mi Pedido'.
- Enviar el pedido mediante el formulario de contacto.

Cuando el usuario decide realizar el pedido, los productos seleccionados se incorporan automáticamente al campo de mensaje del formulario de contacto. 

## Arquitectura 
Se separa Frontend y Backend. 

| Frontend | Backend |
| --- | --- |
| Interfaz | Endpoint de contacto |
| Menú | Validación |
| Filtros | Anti-spam |
| Formulario | Rate limiting |
| Validaciones | API Resend |

## Tecnologías

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express
- Resend
- CORS
- dotenv
- express-rate-limit

### Gestión del proyecto
- Git
- GitHub
  - Ramas de desarrollo
  - Pull Requests

## Requisitos
Para ejecutar localmente el proyecto se necesita: 
- Node.js
- npm
- Git

Comprobación:

```bash
node --version
npm --version
git --version
```

## Instalación 
1. Clonar el repositorio
```bash
git clone https://github.com/Estrellasaln0rte/Parcial1_PW_Menu.git
```
2. Instalar dependencias del frontend

- Desde la raíz del proyecto: 
```bash
npm install
```
3. Instalar dependencias del backend

- Entrar a la carpeta `backend/` y ejecutar:
```bash
npm install
```

Para una guía más detallada de la **configuración** y **ejecución** del servidor Express, revisar **README.md** dentro de la carpeta de `backend/`

## Ejecución 
El frontend y backend deben ejecutarse simultáneamente. 

### Backend
Desde `backend/` ejecutar: 
```bash
node server.js 
```
El servidor estará disponible en: http://localhost:3000 

### Frontend
Abrir otra terminal en la raíz del proyecto: 
```bash
npm run dev
```
Vite muestra la dirección local: http://localhost:5173 

---
### Proyecto académico desarrollado para el curso de Programación Web. 


