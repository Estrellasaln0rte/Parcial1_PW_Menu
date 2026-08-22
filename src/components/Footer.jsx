import Contacto from './Contacto';
import '../styles/Footer.css';

const DATOS = {
  direccion: 'Vista Hermosa III, Zona 16, Ciudad de Guatemala, Guatemala',
  telefono: '5555-5555',
  horario: [
    { dias: 'Lunes a Viernes', horas: '7:00 AM – 8:00 PM' },
    { dias: 'Sábado', horas: '7:00 AM – 6:00 PM' },
    { dias: 'Domingo', horas: '8:00 AM – 3:00 PM' },
  ],
};

export default function Footer() {
  return (
    <footer className="sitio-footer" id="contacto">
      <div className="footer-grid">
        {/* --- Columna 1: dónde y cuándo encontrarnos --- */}
        <section className="footer-datos" aria-labelledby="datos-titulo">
          <h2 className="footer-titulo" id="datos-titulo">
            Comedor La Placita
          </h2>

          <div className="dato">
            <h3 className="dato-etiqueta">Dónde estamos</h3>
            <p className="dato-texto">{DATOS.direccion}</p>
          </div>

          <div className="dato">
            <h3 className="dato-etiqueta">Teléfono</h3>
            <p className="dato-texto">
              {/* tel: permite marcar con un toque desde el celular */}
              <a className="dato-enlace" href={`tel:${DATOS.telefono.replace(/-/g, '')}`}>
                {DATOS.telefono}
              </a>
            </p>
          </div>

          <div className="dato">
            <h3 className="dato-etiqueta">Horario</h3>
            <ul className="horario-lista">
              {DATOS.horario.map((franja) => (
                <li key={franja.dias}>
                  <span className="horario-dias">{franja.dias}</span>
                  <span className="horario-horas">{franja.horas}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Columna 2: el formulario --- */}
        <Contacto />
      </div>

      <p className="footer-legal">
        © 2026 Comedor La Placita · Hecho por Grupo 3 de PW ·{' '}
      </p>
    </footer>
  );
}
