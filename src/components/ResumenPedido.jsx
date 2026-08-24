import { useEffect, useRef } from 'react';
import { usePedido } from '../context/pedido-context';
import '../styles/Pedido.css';

export default function ResumenPedido({ abierto, alCerrar }) {
  const { lista, total, totalUnidades, agregar, quitar, vaciar, enviarAlFormulario } = usePedido();
  const refCerrar = useRef(null);

  // Al abrir el panel, el foco entra en él; con Escape se cierra.
  useEffect(() => {
    if (!abierto) return;

    refCerrar.current?.focus();

    const alTeclear = (e) => {
      if (e.key === 'Escape') alCerrar();
    };

    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  const mandarAlFormulario = () => {
    enviarAlFormulario();
    alCerrar();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Capa oscura: al tocarla se cierra */}
      <div className="resumen-fondo" onClick={alCerrar} aria-hidden="true"></div>

      <div
        className="resumen-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resumen-titulo"
      >
        <div className="resumen-encabezado">
          <h2 id="resumen-titulo">Su pedido</h2>
          <button
            type="button"
            className="resumen-cerrar"
            onClick={alCerrar}
            ref={refCerrar}
            aria-label="Cerrar el resumen del pedido"
          >
            ✕
          </button>
        </div>

        {lista.length === 0 ? (
          <p className="resumen-vacio">
            Todavía no ha agregado nada. Toque <strong>+ AGREGAR</strong> en los platillos
            que quiera pedir.
          </p>
        ) : (
          <>
            <ul className="resumen-lista">
              {lista.map((linea) => (
                <li className="resumen-linea" key={linea.id}>
                  <div className="resumen-nombre">
                    <span>{linea.nombre}</span>
                    <span className="resumen-unitario">Q{linea.precio.toFixed(2)} c/u</span>
                  </div>

                  <div className="contador contador-chico">
                    <button
                      type="button"
                      className="contador-btn"
                      onClick={() => quitar(linea.id)}
                      aria-label={`Quitar una unidad de ${linea.nombre}`}
                    >
                      −
                    </button>
                    <span className="contador-numero">{linea.cantidad}</span>
                    <button
                      type="button"
                      className="contador-btn"
                      onClick={() => agregar(linea)}
                      aria-label={`Agregar otro ${linea.nombre}`}
                    >
                      +
                    </button>
                  </div>

                  <span className="resumen-subtotal">
                    Q{(linea.precio * linea.cantidad).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="resumen-total">
              <span>
                Total ({totalUnidades} {totalUnidades === 1 ? 'platillo' : 'platillos'})
              </span>
              <strong>Q{total.toFixed(2)}</strong>
            </div>

            <p className="resumen-nota">
              El pedido se envía como mensaje al comedor. El pago se hace en el local.
            </p>

            <div className="resumen-acciones">
              <button type="button" className="btn-enviar-pedido" onClick={mandarAlFormulario}>
                ENVIAR MI PEDIDO ▶
              </button>
              <button type="button" className="btn-vaciar" onClick={vaciar}>
                Vaciar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}