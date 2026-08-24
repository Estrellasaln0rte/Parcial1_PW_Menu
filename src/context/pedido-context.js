import { createContext, useContext } from 'react';

// El "canal" por el que viaja el pedido. Se crea aquí, aparte del
// componente, para que Vite pueda recargar en caliente sin problemas.
export const PedidoContext = createContext(null);

// Atajo para leer el pedido desde cualquier componente.
export function usePedido() {
  const contexto = useContext(PedidoContext);

  if (!contexto) {
    throw new Error('usePedido debe usarse dentro de <PedidoProvider>');
  }

  return contexto;
}