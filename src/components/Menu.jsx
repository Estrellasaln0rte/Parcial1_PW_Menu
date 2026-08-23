import { useState, useMemo, useCallback } from 'react';
import Tarjeta from './Tarjeta';

import categorias from '../data/categorias.json';
import productos from '../data/menu.json';

import '../styles/Menu.css';

const CATEGORIA_TODAS = 'todas';

export default function Menu() {
  // ==========================================
  // ZONA A · estado (Memoria del componente)
  // ==========================================
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIA_TODAS);
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null);

  // ==========================================
  // ZONA B · eventos + derivado (Lógica)
  // ==========================================
  const visibles = useMemo(() => {
    return productos.filter((producto) => {
      if (producto.disponible === false) return false;
      if (categoriaActiva === CATEGORIA_TODAS) return true;
      return producto.categoriaId === categoriaActiva;
    });
  }, [categoriaActiva]);

  const manejarClickTarjeta = useCallback((id) => {
    setTarjetaExpandida((actual) => (actual === id ? null : id));
  }, []);

  const cambiarCategoria = useCallback((idCategoria) => {
    setCategoriaActiva(idCategoria);
    setTarjetaExpandida(null);
  }, []);

  // ==========================================
  // ZONA C · lo que se ve (JSX)
  // ==========================================
  return (
    <section className="menu-section" aria-label="Menú principal">
      <div className="popup-tabs" role="tablist" aria-label="Categorías del menú">
        <button
          type="button"
          role="tab"
          aria-selected={categoriaActiva === CATEGORIA_TODAS}
          className={`tab-btn ${categoriaActiva === CATEGORIA_TODAS ? 'active' : ''}`}
          onClick={() => cambiarCategoria(CATEGORIA_TODAS)}
        >
          Todas
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={categoriaActiva === cat.id}
            className={`tab-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
            onClick={() => cambiarCategoria(cat.id)}
            title={cat.nombre}
          >
            <span className="tab-text">{cat.nombre}</span>
          </button>
        ))}
      </div>

      <div className="popup-body menu-grid" aria-live="polite">
        {visibles.length > 0 ? (
          visibles.map((prod) => (
            <Tarjeta
              key={prod.id}
              {...prod}
              isExpanded={tarjetaExpandida === prod.id}
              onToggle={() => manejarClickTarjeta(prod.id)}
            />
          ))
        ) : (
          <p className="empty-msg">No hay platillos disponibles.</p>
        )}
      </div>
    </section>
  );
}