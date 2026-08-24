import { useState, useEffect, useMemo, useCallback } from 'react';
import Tarjeta from './Tarjeta';
import '../styles/Menu.css';

import '../styles/Menu.css';

const CATEGORIA_TODAS = 'todas';

// Los datos viven en public/, no en src/. Así NO se compilan dentro del
// JavaScript: siguen siendo archivos que Don Chente puede editar y que el
// navegador vuelve a pedir en cada visita.
const RUTA_PRODUCTOS = '/data/menu.json';
const RUTA_CATEGORIAS = '/data/categorias.json';

export default function Menu() {
  // ==========================================
  // ZONA A · estado (Memoria del componente)
  // ==========================================
  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIA_TODAS);
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null);

  // Datos traídos del servidor
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // 'cargando' | 'listo' | 'error'
  const [estado, setEstado] = useState('cargando');
  const [mensajeError, setMensajeError] = useState('');

  // Se aumenta al tocar "Reintentar": cambia la dependencia del efecto
  // y eso vuelve a disparar la carga.
  const [intento, setIntento] = useState(0);

  // ==========================================
  // ZONA B · carga de datos + eventos
  // ==========================================
  useEffect(() => {
    // Permite cancelar la petición si el componente se desmonta antes
    // de que termine (evita avisos de React y peticiones colgadas).
    const control = new AbortController();

    async function cargarMenu() {
      setEstado('cargando');
      setMensajeError('');

      try {
        // Los dos archivos se piden en paralelo, no uno tras otro.
        const [resProductos, resCategorias] = await Promise.all([
          fetch(RUTA_PRODUCTOS, { signal: control.signal }),
          fetch(RUTA_CATEGORIAS, { signal: control.signal }),
        ]);

        if (!resProductos.ok || !resCategorias.ok) {
          throw new Error('No encontramos el archivo del menú.');
        }

        const [datosProductos, datosCategorias] = await Promise.all([
          resProductos.json(),
          resCategorias.json(),
        ]);

        // Si el archivo viene mal editado, avisamos en vez de reventar.
        if (!Array.isArray(datosProductos) || !Array.isArray(datosCategorias)) {
          throw new Error('El archivo del menú no tiene el formato esperado.');
        }

        setProductos(datosProductos);
        setCategorias(datosCategorias);
        setEstado('listo');
      } catch (error) {
        // Cancelar no es un error real: no mostramos nada.
        if (error.name === 'AbortError') return;

        setMensajeError(
          error instanceof TypeError
            ? 'No pudimos cargar el menú. Revise su conexión.'
            : error.message
        );
        setEstado('error');
      }
    }

    cargarMenu();

    return () => control.abort();
  }, [intento]);

  const visibles = useMemo(() => {
    return productos.filter((producto) => {
      if (producto.disponible === false) return false;
      if (categoriaActiva === CATEGORIA_TODAS) return true;
      return producto.categoriaId === categoriaActiva;
    });
  }, [productos, categoriaActiva]);

  const manejarClickTarjeta = useCallback((id) => {
    setTarjetaExpandida((actual) => (actual === id ? null : id));
  }, []);

  const cambiarCategoria = useCallback((idCategoria) => {
    setCategoriaActiva(idCategoria);
    setTarjetaExpandida(null);
  }, []);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  // ==========================================
  // ZONA C · lo que se ve (JSX)
  // ==========================================
  return (
    <section className="menu-section" id="menu" aria-label="Menú principal">
      {/* Las pestañas solo aparecen cuando ya hay categorías que mostrar */}
      {estado === 'listo' && (
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
      )}

      <div className="popup-body menu-grid" aria-live="polite" aria-busy={estado === 'cargando'}>

        {/* --- Cargando: siluetas en lugar de pantalla en blanco --- */}
        {estado === 'cargando' && (
          <>
            <p className="menu-aviso-carga" role="status">
              Cargando el menú...
            </p>
            {/* Marcadores de posición: mantienen la forma de la página */}
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div className="esqueleto-tarjeta" key={n} aria-hidden="true">
                <div className="esqueleto-foto"></div>
                <div className="esqueleto-linea larga"></div>
                <div className="esqueleto-linea corta"></div>
              </div>
            ))}
          </>
        )}

        {/* --- Error: se explica y se ofrece salida --- */}
        {estado === 'error' && (
          <div className="menu-error" role="alert">
            <p className="menu-error-texto">{mensajeError}</p>
            <button type="button" className="boton-reintentar" onClick={reintentar}>
              REINTENTAR
            </button>
          </div>
        )}

        {/* --- Listo: el menú de siempre --- */}
        {estado === 'listo' &&
          (visibles.length > 0 ? (
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
          ))}
      </div>
    </section>
  );
}