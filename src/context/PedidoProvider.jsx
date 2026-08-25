import { useState, useMemo, useCallback } from 'react';
import { PedidoContext } from './pedido-context';

export default function PedidoProvider({ children }) {
  // El pedido se guarda como objeto { idProducto: linea }.
  // Buscar por id es directo, sin recorrer una lista.
  const [lineas, setLineas] = useState({});

  // Texto que el resumen manda al formulario de contacto.
  const [mensajeSugerido, setMensajeSugerido] = useState('');

  const agregar = useCallback((producto) => {
    setLineas((actual) => {
      const previa = actual[producto.id];

      return {
        ...actual,
        [producto.id]: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: previa ? previa.cantidad + 1 : 1,
        },
      };
    });
  }, []);

  const quitar = useCallback((id) => {
    setLineas((actual) => {
      const previa = actual[id];
      if (!previa) return actual;

      // Si baja a cero, la línea desaparece del pedido.
      if (previa.cantidad <= 1) {
        const copia = { ...actual };
        delete copia[id];
        return copia;
      }

      return { ...actual, [id]: { ...previa, cantidad: previa.cantidad - 1 } };
    });
  }, []);

  const vaciar = useCallback(() => setLineas({}), []);

  const valor = useMemo(() => {
    const lista = Object.values(lineas);

    const totalUnidades = lista.reduce((suma, l) => suma + l.cantidad, 0);
    const total = lista.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

    // El pedido escrito en palabras, listo para mandarse por correo.
    const textoPedido = lista.length
      ? [
          'Buenas, quisiera hacer este pedido:',
          '',
          ...lista.map(
            (l) =>
              `- ${l.cantidad} x ${l.nombre} (Q${l.precio.toFixed(2)} c/u) = Q${(
                l.precio * l.cantidad
              ).toFixed(2)}`
          ),
          '',
          `Total: Q${total.toFixed(2)}`,
        ].join('\n')
      : '';

    return {
      lista,
      totalUnidades,
      total,
      textoPedido,
      mensajeSugerido,
      cantidadDe: (id) => lineas[id]?.cantidad ?? 0,
      agregar,
      quitar,
      vaciar,
      // Manda el pedido al formulario y lo marca como "ya usado"
      enviarAlFormulario: () => setMensajeSugerido(textoPedido),
      limpiarSugerencia: () => setMensajeSugerido(''),
    };
  }, [lineas, mensajeSugerido, agregar, quitar, vaciar]);

  return <PedidoContext.Provider value={valor}>{children}</PedidoContext.Provider>;
}