import { useMemo } from 'react';
import '../styles/Header.css';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const HORA_APERTURA = '07:00';
const DIAS_HORARIO_EXTENDIDO = [5, 6]; // Viernes y sábado

export default function Header() {
  // ==========================================
  // ZONA A · estado
  // ==========================================
  // (No aplica: el horario no es "memoria" del componente,
  // es un valor derivado del reloj del sistema, se calcula en ZONA B)

  // ==========================================
  // ZONA B · eventos + derivado
  // ==========================================

  // useMemo evita recrear el objeto Date y recalcular el string
  // en cada render; solo se recalcula si el componente se remonta.
  const mensajeHorario = useMemo(() => {
    const fecha = new Date();
    const diaActual = fecha.getDay();
    const nombreDia = DIAS[diaActual];
    const horaCierre = DIAS_HORARIO_EXTENDIDO.includes(diaActual)
      ? '22:00'
      : '20:00';

    return `Hoy ${nombreDia} ${HORA_APERTURA} - ${horaCierre}`;
  }, []);

  const irAlMenu = () => {
    const seccion = document.getElementById('seccion-menu');
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // ZONA C · lo que se ve (JSX)
  // ==========================================
  return (
    <header className="rpg-header">
      <div className="rpg-header-container">
        <div className="header-left">
          <div className="logo-group">
            <div className="logo-badge">
              <h1>La Placita</h1>
            </div>
            <div className="est-badge">DESDE 1995</div>
          </div>

          <div className="status-badge" title="Horario de atención">
            <span className="status-dot" aria-hidden="true"></span>
            <span className="status-text">{mensajeHorario}</span>
          </div>
        </div>

        <nav className="header-right" aria-label="Navegación principal">
          <button type="button" className="nav-tab active" onClick={irAlMenu}>
            Menú
          </button>
          <button type="button" className="nav-tab">
            Nosotros
          </button>
          <button type="button" className="nav-btn-action">
            ORDENAR
          </button>
        </nav>
      </div>
    </header>
  );
}