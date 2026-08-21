import { useState } from 'react';
import Tarjeta from './Tarjeta';
import categorias from '../data/categorias.json';
import productos from '../data/menu.json'; 

export default function Menu() {
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  // NUEVO ESTADO: Guarda el ID de la tarjeta abierta. Si es null, todas están cerradas.
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null);

  const visibles = productos.filter(producto => {
    if (producto.disponible === false) return false;
    if (categoriaActiva === "todas") return true;
    return producto.categoriaId === categoriaActiva;
  });

  // FUNCIÓN PARA EL ACORDEÓN
  const manejarClickTarjeta = (id) => {
    // Si tocas la que ya está abierta, se cierra (null). Si tocas otra, se abre esa.
    setTarjetaExpandida(tarjetaExpandida === id ? null : id);
  };

  return (
    <section className="menu-section" aria-label="Menú principal">
      <div className="popup-tabs">
        <button 
          className={`tab-btn ${categoriaActiva === "todas" ? 'active' : ''}`}
          onClick={() => { setCategoriaActiva("todas"); setTarjetaExpandida(null); }}
        >
          Todas
        </button>
        {categorias.map(cat => (
          <button 
            key={cat.id} 
            className={`tab-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
            onClick={() => { setCategoriaActiva(cat.id); setTarjetaExpandida(null); }}
            title={cat.nombre}
          >
            <span className="tab-text">{cat.nombre}</span>
          </button>
        ))}
      </div>

      <div className="popup-body menu-grid">
        {visibles.map(prod => (
          <Tarjeta 
            key={prod.id} 
            {...prod} 
            /* Le pasamos a la tarjeta la orden de si debe estar abierta o no */
            isExpanded={tarjetaExpandida === prod.id}
            onToggle={() => manejarClickTarjeta(prod.id)}
          />
        ))}
        {visibles.length === 0 && <p className="empty-msg">No hay platillos disponibles.</p>}
      </div>
    </section>
  );
}