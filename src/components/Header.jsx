import { useState, useEffect } from 'react';
import '../styles/Header.css';

export default function Header() {
  const [mensajeHorario, setMensajeHorario] = useState("");

  useEffect(() => {
    // 1. Lista de días
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const fecha = new Date();
    const diaActual = fecha.getDay(); 
    const nombreDia = dias[diaActual]; // Sacamos el nombre del día de hoy
    
    // 2. Horarios
    const horaApertura = "07:00"; 
    const horaCierre = (diaActual === 5 || diaActual === 6) ? '22:00' : '20:00';
    
    // 3. El texto final fusionado: "Hoy Sáb 07:00 - 22:00"
    setMensajeHorario(`Hoy ${nombreDia} ${horaApertura} - ${horaCierre}`);
  }, []);

  // FUNCIÓN DE SCROLL SUAVE AL MENÚ
  const irAlMenu = () => {
    const seccion = document.getElementById('seccion-menu');
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <nav className="header-right">
          <button className="nav-tab active" onClick={irAlMenu}>Menú</button>
          <button className="nav-tab">Nosotros</button>
          <button className="nav-btn-action">ORDENAR</button>
        </nav>
        
      </div>
    </header>
  );
}