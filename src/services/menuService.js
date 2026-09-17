import { supabase } from '../lib/supabaseClient';

// Trae, en una sola consulta, cada producto con sus ingredientes
// (ordenados) y los nombres de sus alérgenos y etiquetas, gracias
// a las relaciones definidas en el modelo de la base de datos.
const SELECT_PRODUCTOS = `
  id,
  nombre,
  descripcion,
  precio,
  categoria_id,
  imagen,
  alt,
  preparacion,
  porcion,
  tiempo_preparacion,
  disponible,
  ingredientes ( nombre, orden ),
  producto_alergenos ( alergenos ( nombre ) ),
  producto_etiquetas ( etiquetas ( nombre ) )
`;

function mapProducto(fila) {
  const ingredientesOrdenados = [...(fila.ingredientes ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((ingrediente) => ingrediente.nombre);

  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: Number(fila.precio),
    categoriaId: fila.categoria_id,
    imagen: fila.imagen,
    alt: fila.alt,
    disponible: fila.disponible,
    detalle: {
      ingredientes: ingredientesOrdenados,
      preparacion: fila.preparacion,
      porcion: fila.porcion,
      tiempoPreparacion: fila.tiempo_preparacion,
    },
    alergenos: (fila.producto_alergenos ?? [])
      .map((relacion) => relacion.alergenos?.nombre)
      .filter(Boolean),
    etiquetas: (fila.producto_etiquetas ?? [])
      .map((relacion) => relacion.etiquetas?.nombre)
      .filter(Boolean),
  };
}

export async function obtenerProductos(signal) {
  const { data, error } = await supabase
    .from('productos')
    .select(SELECT_PRODUCTOS)
    .abortSignal(signal);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapProducto);
}

export async function obtenerCategorias(signal) {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, descripcion')
    .abortSignal(signal);

  if (error) throw new Error(error.message);

  return data ?? [];
}
