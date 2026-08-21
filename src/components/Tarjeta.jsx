import { memo } from 'react';
import '../styles/Tarjeta.css';

function Tarjeta({
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
  // (No aplica: este componente no tiene memoria propia,
  // isExpanded y onToggle vienen controlados desde Menu.jsx)

  // ==========================================
  // ZONA B · eventos + derivado
  // ==========================================
  const manejarTeclado = (e) => {
    // Permite abrir/cerrar con Enter o Espacio, no solo con click
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
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
          <img src={imagen} alt={alt || nombre} loading="lazy" />
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

// React.memo evita re-renderizar esta tarjeta si sus props no cambiaron.
// Funciona bien porque Menu.jsx ya usa useCallback en manejarClickTarjeta.
export default memo(Tarjeta);