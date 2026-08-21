import { useState, useEffect } from 'react';
import Tarjeta from './Tarjeta';

// Importamos los datos locales para simular la base de datos
import categoriasData from '../data/categorias.json';
import productosData from '../data/menu.json'; 

export default function Menu() {
  // ==========================================
  // ZONA A · ESTADO (Las 3 caras del Fetch)
  // ==========================================
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // CARA 1 y 2: Controladores de la API
  const [cargando, setCargando] = useState(true); // Arranca en true porque estamos esperando
  const [error, setError] = useState(false);      // Arranca en false porque aún no hay fallos

  // Estado de la interfaz (lo que ya teníamos)
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null);

  // ==========================================
  // ZONA B · EVENTOS Y EFECTOS (El Fetch)
  // ==========================================
  useEffect(() => {
    // Aquí simulamos una petición a una API
    const obtenerMenu = async () => {
      try {
        // Simulamos un retraso de 1.5 segundos para que veas la "Cara 1"
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Cuando tengas tu API real, borrarías los imports de arriba y usarías:
        // const res = await fetch('https://tu-api.com/menu');
        // const data = await res.json();
        
        // Por ahora, usamos nuestros JSON locales:
        setCategorias(categoriasData);
        setProductos(productosData);
        
        // ¡Llegaron los datos! Apagamos la pantalla de carga
        setCargando(false);
      } catch (err) {
        // Si algo explota (se cae el server), encendemos el error
        console.error("Error al traer el menú:", err);
        setError(true);
        setCargando(false); // Apagamos la carga porque ya falló
      }
    };

    obtenerMenu();
  }, []); // El array vacío asegura que esto solo pase 1 vez al abrir la página

  // Lógica de filtrado (solo se ejecuta si ya hay productos)
  const visibles = productos.filter(producto => {
    if (producto.disponible === false) return false;
    if (categoriaActiva === "todas") return true;
    return producto.categoriaId === categoriaActiva;
  });

  const manejarClickTarjeta = (id) => {
    setTarjetaExpandida(tarjetaExpandida === id ? null : id);
  };

  // ==========================================
  // ZONA C · LO QUE SE VE (JSX con los 3 finales)
  // ==========================================

  // --- CARA 1: MIENTRAS ESPERA ---
  if (cargando) {
    return (
      <section className="menu-section loading-screen">
        <div className="pixel-loader">
          <p className="click-hint">Cargando menú...</p>
          {/* Aquí podrías poner un GIF de un reloj de arena pixel art */}
        </div>
      </section>
    );
  }

  // --- CARA 2: SI ALGO FALLA ---
  if (error) {
    return (
      <section className="menu-section error-screen">
        <div className="pixel-error">
          <h3>⚠️ ERROR DE CONEXIÓN</h3>
          <p>No pudimos contactar con la cocina.</p>
          <button className="tab-btn" onClick={() => window.location.reload()}>
            REINTENTAR
          </button>
        </div>
      </section>
    );
  }

  // --- CARA 3: DATOS (El caso feliz) ---
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
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="popup-body menu-grid">
        {visibles.map(prod => (
          <Tarjeta 
            key={prod.id} 
            {...prod} 
            isExpanded={tarjetaExpandida === prod.id}
            onToggle={() => manejarClickTarjeta(prod.id)}
          />
        ))}
        {visibles.length === 0 && <p className="empty-msg">No hay platillos disponibles.</p>}
      </div>
    </section>
  );
}