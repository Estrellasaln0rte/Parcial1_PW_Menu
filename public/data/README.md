# Cómo actualizar el menú de La Placita

El menú ya no vive en archivos JSON dentro de este proyecto: ahora vive en la base de datos de Supabase. Para agregar, cambiar o quitar platillos y secciones hay que entrar al proyecto en [supabase.com](https://supabase.com), sección **Table Editor**, y editar las filas de las tablas correspondientes.

# La idea general

- **`categorias`**: son las secciones del menú, como si fueran las pestañas de una carta física (Desayunos, Almuerzos, Bebidas, Postres, etc.).
- **`productos`**: son los platillos individuales. Cada uno "sabe" a qué sección pertenece gracias a la columna `categoria_id`, que lo conecta con el `id` de su categoría.
- **`ingredientes`**: cada fila es un ingrediente de un producto (columna `producto_id`), con un número de `orden` para que aparezcan siempre en el mismo orden.
- **`alergenos`** / **`etiquetas`**: catálogos de palabras cortas, conectados a cada producto mediante las tablas `producto_alergenos` y `producto_etiquetas`.

# Las partes de una categoría (tabla `categorias`)

| Campo | Qué es |
| --- | --- |
| `id` | El código único de la sección (nunca lo cambies si ya hay productos usándolo) |
| `nombre` | Lo que ve el cliente (ej. "Postres") |
| `descripcion` | Una frase corta que explica esa sección |

# Las partes de un producto (tabla `productos`)

| Campo | Qué es |
| --- | --- |
| `id` | Código único del producto |
| `nombre` / `descripcion` | Lo que se muestra al cliente |
| `precio` | El número, sin comillas ni signo de moneda |
| `categoria_id` | A qué sección pertenece (debe coincidir con un `id` de `categorias` que exista) |
| `imagen` | La ruta a la foto (ej. `/platos/PlatoDelDia.jpg`) |
| `alt` | Descripción de la imagen (para accesibilidad) |
| `preparacion` / `porcion` / `tiempo_preparacion` | Detalle de la receta |
| `disponible` | Si se puede pedir ahora (`true`) o no (`false`) |

# Pasos para hacer los cambios más comunes

# Agregar una categoría nueva
En la tabla `categorias`, inserta una fila nueva con un `id` que no exista todavía (ej. `cat-09`) y su `nombre` y `descripcion`.

# Editar una categoría existente
Busca la fila por su `id` (ej. `cat-06` para Bebidas) y edita `nombre` o `descripcion`. No toques el `id`.

# Eliminar una categoría
Antes de borrarla, revisa que ningún producto tenga ese `categoria_id`, o la base de datos rechazará el borrado (o el producto quedará sin sección). Si nadie la usa, borra la fila.

# Agregar un producto nuevo
Inserta una fila en `productos` con un `id` único (ej. `prod-013`) y el `categoria_id` correcto. Luego agrega sus ingredientes como filas en `ingredientes` (con el mismo `producto_id` y un `orden` para cada uno), y si aplica, conecta alérgenos/etiquetas insertando filas en `producto_alergenos` / `producto_etiquetas`.

# Editar un producto (precio, nombre, disponibilidad, etc.)
Ubica el producto por su `id` o nombre en la tabla `productos` y edita el campo directamente. Para que un platillo deje de mostrarse temporalmente sin borrarlo, cambia `disponible` a `false`.

# Mover un producto a otra sección
Solo cambia el valor de `categoria_id` por el `id` de la categoría a la que quieres moverlo. No hace falta tocar nada más de ese producto.
