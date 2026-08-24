import { useState, useEffect } from 'react';
import ResumenPedido from './ResumenPedido';
import { usePedido } from '../context/pedido-context';
import '../styles/Header.css';


function calcularHorario() {
   // 1. Lista de días
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const diaActual = new Date().getDay();

      // 2. Horarios
  const horaApertura = '07:00';
  // Viernes y sábado se cierra más tarde
  const horaCierre = diaActual === 5 || diaActual === 6 ? '22:00' : '20:00';
  return `Hoy ${dias[diaActual]} ${horaApertura} - ${horaCierre}`;
}

const SECCIONES = [
  { id: 'menu', texto: 'Menú' },
  { id: 'nosotros', texto: 'Nosotros' },
  { id: 'contacto', texto: 'Contacto' },
];

export default function Header() {
  const [seccionActiva, setSeccionActiva] = useState('');
  const [resumenAbierto, setResumenAbierto] = useState(false);
  const { totalUnidades } = usePedido();

  // 3. El texto final fusionado: "Hoy Sáb 07:00 - 22:00"
  const mensajeHorario = calcularHorario();

  // Marca la pestaña de la sección que el usuario está viendo.
  // IntersectionObserver avisa cuando una sección entra en pantalla, así
  // el indicador también se actualiza si baja con la rueda del mouse.
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setSeccionActiva(entrada.target.id);
        });
      },
      // Solo cuenta lo que está en la franja media de la pantalla,
      // para que no se marquen dos secciones a la vez.
      { rootMargin: '-40% 0px -55% 0px' }
    );

    SECCIONES.forEach(({ id }) => {
      const seccion = document.getElementById(id);
      if (seccion) observador.observe(seccion);
    });

    // Limpieza: si el componente se desmonta, dejamos de observar.
    return () => observador.disconnect();
  }, []);

  return (
    <header className="rpg-header">
      <div className="rpg-header-container">

        {/* Lado Izquierdo: Letrero y Status */}
        <div className="header-left">

          {/* AGRUPAMOS EL LOGO Y LA FECHA DE 1995 */}
          <div className="logo-group">
            <div className="logo-badge">
              <h1>La Placita</h1>
            </div>
            <div className="est-badge">Desde 1995</div>
          </div>

          {/* Aquí se mostrará: "Hoy Sáb 07:00 - 22:00" */}
          <div className="status-badge" title="Horario de atención">
            <span className="status-dot"></span>
            <span className="status-text">{mensajeHorario}</span>
          </div>

        </div>

        {/* Lado Derecho: Navegación */}
        <nav className="header-right" aria-label="Navegación principal">
          {SECCIONES.map(({ id, texto }) => (
            <a
              key={id}
              className={`nav-tab ${seccionActiva === id ? 'active' : ''}`}
              href={`#${id}`}
              // Le dice al lector de pantalla en qué sección va el usuario
              aria-current={seccionActiva === id ? 'true' : undefined}
            >
              {texto}
            </a>
          ))}

          {/* Abre el resumen del pedido. El número avisa cuánto lleva. */}
          <button
            type="button"
            className="nav-btn-action"
            onClick={() => setResumenAbierto(true)}
            aria-label={
              totalUnidades > 0
                ? `Ver mi pedido, ${totalUnidades} platillos`
                : 'Ver mi pedido, está vacío'
            }
          >
            MI PEDIDO
            {totalUnidades > 0 && <span className="pedido-globo">{totalUnidades}</span>}
          </button>
        </nav>

      </div>

      <ResumenPedido abierto={resumenAbierto} alCerrar={() => setResumenAbierto(false)} />
    </header>
  );
}