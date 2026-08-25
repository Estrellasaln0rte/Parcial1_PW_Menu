import { memo, useState, useEffect } from 'react';
import ContadorPedido from './ContadorPedido';
import '../styles/Tarjeta.css';

function Tarjeta({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  alt,
  alergenos,
  detalle,
  isExpanded,
  onToggle,
}) {
  // ==========================================
  // ZONA A · estado
  // ==========================================
  // Propio de este componente: detecta si ESTA imagen puntual
  // falló al cargar (ruta rota, 404, etc.)
  const [imagenRota, setImagenRota] = useState(false);

  // ==========================================
  // ZONA B · eventos + derivado
  // ==========================================

  // Si el producto cambia (ej. cambia de categoría y se reusa el
  // componente), reseteamos el error para volver a intentar cargar.
  useEffect(() => {
    setImagenRota(false);
  }, [imagen]);

  const manejarTeclado = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  const manejarErrorImagen = () => {
    setImagenRota(true);
  };

  const tieneAlergenos = alergenos && alergenos.length > 0;
  const precioFormateado = typeof precio === 'number' ? precio.toFixed(2) : '0.00';

  // ==========================================
  // ZONA C · lo que se ve (JSX)
  // ==========================================
  return (
    <article
      className={`menu-card ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
      onKeyDown={manejarTeclado}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="card-main-row">
        <div className="pixel-frame">
          {imagenRota ? (
            <div className="pixel-frame-fallback" role="img" aria-label={alt || nombre}>
              <span className="fallback-icon" aria-hidden="true">⚙️</span>
              <span className="fallback-text">Pendiente</span>
            </div>
          ) : (
            <img
              src={imagen}
              alt={alt || nombre}
              loading="lazy"
              onError={manejarErrorImagen}
            />
          )}
        </div>

        <div className="card-info">
          <h3>{nombre}</h3>
          <p className="precio">Q{precioFormateado}</p>
          {!isExpanded && <p className="desc">{descripcion}</p>}

          {tieneAlergenos && (
            <div className="alergia-badge">
              ⚠️ {alergenos.join(', ')}
            </div>
          )}

          <span className="click-hint">
            {isExpanded ? '▲ CERRAR RECETA' : '▼ VER RECETA'}
          </span>

          {/* Contador para armar el pedido */}
          <ContadorPedido id={id} nombre={nombre} precio={precio} />
        </div>
      </div>

      {isExpanded && detalle && (
        <div className="detalles-caja">
          <div className="detalles-stats">
            <div className="stat-box">
              <span className="stat-icon">⏳</span>
              <span>{detalle.tiempoPreparacion} MIN</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🍽️</span>
              <span>{detalle.porcion}</span>
            </div>
          </div>

          <p className="ingredientes-titulo">Ingredientes Requeridos</p>

          <ul className="ingredientes-grid">
            {detalle.ingredientes.map((ing) => (
              <li key={ing} className="ingrediente-item">
                <span className="ing-bullet">🔸</span> {ing}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default memo(Tarjeta);