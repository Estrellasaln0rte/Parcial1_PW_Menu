import { usePedido } from '../context/pedido-context';
import '../styles/Pedido.css';

export default function ContadorPedido({ id, nombre, precio }) {
  const { cantidadDe, agregar, quitar } = usePedido();
  const cantidad = cantidadDe(id);

  // La tarjeta entera es clickeable (abre la receta). Sin esto,
  // tocar "+" también abriría la receta.
  const sinPropagar = (accion) => (e) => {
    e.stopPropagation();
    accion();
  };

  // Todavía no ha pedido nada: un solo botón, sin ruido visual.
  if (cantidad === 0) {
    return (
      <div className="contador-zona">
        <button
          type="button"
          className="btn-agregar"
          onClick={sinPropagar(() => agregar({ id, nombre, precio }))}
          aria-label={`Agregar ${nombre} al pedido`}
        >
          + AGREGAR
        </button>
      </div>
    );
  }

  return (
    <div className="contador-zona">
      <div className="contador">
        <button
          type="button"
          className="contador-btn"
          onClick={sinPropagar(() => quitar(id))}
          aria-label={`Quitar una unidad de ${nombre}`}
        >
          −
        </button>

        {/* role="status" hace que el lector de pantalla anuncie el
            número nuevo cada vez que cambia, sin mover el foco. */}
        <span className="contador-numero" role="status" aria-label={`${cantidad} de ${nombre}`}>
          {cantidad}
        </span>

        <button
          type="button"
          className="contador-btn"
          onClick={sinPropagar(() => agregar({ id, nombre, precio }))}
          aria-label={`Agregar otro ${nombre}`}
        >
          +
        </button>
      </div>

      <span className="contador-subtotal">Q{(precio * cantidad).toFixed(2)}</span>
    </div>
  );
}