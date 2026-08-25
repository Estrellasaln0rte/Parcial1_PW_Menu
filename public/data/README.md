# Cómo actualizar el menú de La Placita

Esta guía explica, en palabras sencillas, cómo agregar, cambiar o quitar platillos y secciones del menú. No necesita saber de programación para seguirla, solo hay que tener cuidado con el orden.

# La idea general

El menú vive en dos archivos:

- **Categorías**: son las secciones del menú, como si fueran las pestañas de una carta física (Desayunos, Almuerzos, Bebidas, Postres, etc.).
- **Productos**: son los platillos individuales. Cada uno "sabe" a qué sección pertenece gracias a un código que lo conecta con su categoría.

Ese código de conexión se llama `categoriaId`. Por ejemplo, el "Pepián de Pollo" tiene `"categoriaId": "cat-02"`, y si buscas `cat-02` en el archivo de categorías, verás que corresponde a "Almuerzos". Así es como el sistema sabe en qué sección mostrar cada platillo — no por el nombre, sino por ese código.

# Las partes de una categoría

Cada categoría tiene solo tres datos:

| Campo | Qué es |
| --- | --- |
| `id` | El código único de la sección (nunca lo cambies si ya hay platillos usándolo) |
| `nombre` | Lo que ve el cliente (ej. "Postres") |
| `descripcion` | Una frase corta que explica esa sección |

# Las partes de un producto

Cada platillo tiene más información:

| Campo | Qué es |

| `id` | Código único del producto |
| `nombre` / `descripcion` | Lo que se muestra al cliente |
| `precio` | El número, sin comillas |
| `categoriaId` | A qué sección pertenece (debe coincidir con un id de categoría que exista) |
| `imagen` | El enlace a la foto |
| `alt` | Descripción de la imagen (para accesibilidad) |
| `detalle` | Ingredientes, preparación, porción y tiempo de preparación |
| `disponible` | Si se puede pedir ahora (`true`) o no (`false`) |
| `etiquetas` | Listas de palabras cortas |


# Pasos para hacer los cambios más comunes

# Agregar una categoría nueva
Copia un bloque completo de categoría (desde la `{` hasta la `}`), pégalo antes del corchete final `]` del archivo de categorías, y sepáralo del anterior con una coma. Cambia el `id` a uno que no exista todavía (ej. `"cat-09"`), y escribe el nombre y descripción nuevos.

# Editar una categoría existente
Busca el bloque que tiene el `id` de la categoría que quieres cambiar (ej. `"cat-06"` para Bebidas) y reescribe el texto entre comillas de `"nombre"` o `"descripcion"`. No toques el `id`.

# Eliminar una categoría
Antes de borrarla, revisa que ningún producto tenga ese `categoriaId`, o ese platillo quedará "huérfano" y podría no mostrarse bien. Si nadie la usa, borra el bloque completo y la coma que lo separaba del siguiente.

# Agregar un producto nuevo
Copia un bloque completo de producto, pégalo antes del corchete final del archivo de productos y sepáralo con una coma. Ponle un `id` único (ej. `"prod-013"`), completa nombre, descripción, precio y —muy importante— el `categoriaId` correcto para que aparezca en la sección deseada.

# Editar un producto (precio, nombre, disponibilidad, etc.)
Ubica el producto por su `id` o nombre. Para cambiar el precio, reemplaza solo el número después de `"precio":`. Para que un platillo deje de mostrarse temporalmente sin borrarlo, cambia `"disponible": true` a `"disponible": false`.

# Mover un producto a otra sección
Solo cambia el valor de `"categoriaId"` por el `id` de la categoría a la que quieres moverlo. No hace falta tocar nada más de ese producto.
