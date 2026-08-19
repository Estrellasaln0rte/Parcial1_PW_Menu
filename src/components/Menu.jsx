import { useState } from 'react';
import Tarjeta from './Tarjeta';
import productos from '../data/menu.json';

export default function Menu() {
  // ZONA A · estado — arriba del return
  const [categoria, setCategoria] = useState("todas");

  // ZONA B · derivado — debajo del estado
  const visibles = categoria === "todas" 
    ? productos 
    : productos.filter(p => p.categoria === categoria);

  const categoriasMenu = ["todas", "Desayunos", "Comida", "Bebidas", "Postres"];

  // ZONA C · JSX — dentro del return
  return (
    <section className="menu-section">
      <h2 className="pixel-title">Menú de La Placita</h2>
      
      <div className="popup-tabs">
        {categoriasMenu.map(c => (
          <button 
            key={c} 
            className={`tab-btn ${categoria === c ? 'active' : ''}`}
            onClick={() => setCategoria(c)}
            // Atributo para que el lector de pantalla sepa qué pestaña está activa
            aria-pressed={categoria === c} 
          >
            {c}
          </button>
        ))}
      </div>

      <div className="popup-body menu-grid">
        {visibles.map(p => (
          <Tarjeta key={p.id} {...p} />
        ))}
        
        {/* Mensaje por si una categoría está vacía */}
        {visibles.length === 0 && (
          <p className="empty-msg">No hay platillos en esta categoría por ahora.</p>
        )}
      </div>
    </section>
  );
}