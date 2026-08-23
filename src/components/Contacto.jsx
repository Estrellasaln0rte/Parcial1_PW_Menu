import { useState, useRef } from 'react';
import '../styles/Contacto.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const LIMITES = {
  nombreMin: 2,
  nombreMax: 60,
  mensajeMin: 10,
  mensajeMax: 500,
};

const FORMULARIO_VACIO = { nombre: '', email: '', mensaje: '', telefono: '' };

export default function Contacto() {
  // ==========================================
  // ZONA A · estado (Memoria del componente)
  // ==========================================
  const [valores, setValores] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  // 'idle' | 'enviando' | 'exito' | 'error'
  const [estado, setEstado] = useState('idle');
  const [errorServidor, setErrorServidor] = useState('');

  // Referencias para mover el foco al primer campo con error.
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const mensajeRef = useRef(null);

  // ==========================================
  // ZONA B · eventos + derivado (Lógica)
  // ==========================================

  // Valida UN campo y devuelve el mensaje de error, o '' si está bien.
  const validarCampo = (campo, valor) => {
    const texto = valor.trim();

    if (campo === 'nombre') {
      if (!texto) return 'Escriba su nombre.';
      if (texto.length < LIMITES.nombreMin) return 'El nombre es muy corto.';
      if (texto.length > LIMITES.nombreMax) return `Máximo ${LIMITES.nombreMax} caracteres.`;
    }

    if (campo === 'email') {
      if (!texto) return 'Escriba su correo.';
      // Pide: algo + @ + algo + . + al menos 2 letras. Sin espacios.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) {
        return 'Ese correo no parece válido. Ejemplo: nombre@correo.com';
      }
    }

    if (campo === 'mensaje') {
      if (!texto) return 'Escriba su mensaje.';
      if (texto.length < LIMITES.mensajeMin) {
        return `Cuéntenos un poco más (mínimo ${LIMITES.mensajeMin} caracteres).`;
      }
      if (texto.length > LIMITES.mensajeMax) {
        return `Máximo ${LIMITES.mensajeMax} caracteres.`;
      }
    }

    return '';
  };

  // Valida todo el formulario de una vez.
  const validarTodo = () => {
    const nuevos = {};
    ['nombre', 'email', 'mensaje'].forEach((campo) => {
      const error = validarCampo(campo, valores[campo]);
      if (error) nuevos[campo] = error;
    });
    return nuevos;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setValores((actual) => ({ ...actual, [name]: value }));

    // Si el campo ya tenía error, lo limpiamos apenas empiece a corregir.
    if (errores[name]) {
      setErrores((actual) => ({ ...actual, [name]: '' }));
    }
  };

  // Al salir del campo se valida: así el usuario recibe el aviso
  // mientras llena, no hasta el final.
  const manejarBlur = (e) => {
    const { name, value } = e.target;
    const error = validarCampo(name, value);
    setErrores((actual) => ({ ...actual, [name]: error }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrorServidor('');

    const nuevosErrores = validarTodo();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      // Accesibilidad: llevamos el foco al primer campo malo.
      if (nuevosErrores.nombre) nombreRef.current?.focus();
      else if (nuevosErrores.email) emailRef.current?.focus();
      else mensajeRef.current?.focus();
      return;
    }

    // Trampa anti-spam: este campo está escondido para las personas.
    // Si viene lleno, lo llenó un bot. Fingimos éxito y no mandamos nada.
    if (valores.telefono) {
      setEstado('exito');
      setValores(FORMULARIO_VACIO);
      return;
    }

    setEstado('enviando');

    try {
      const respuesta = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: valores.nombre.trim(),
          email: valores.email.trim(),
          mensaje: valores.mensaje.trim(),
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo enviar el mensaje.');
      }

      setEstado('exito');
      setValores(FORMULARIO_VACIO);
      setErrores({});
    } catch (error) {
      setEstado('error');
      // TypeError = el fetch ni siquiera salió (servidor apagado, sin internet).
      setErrorServidor(
        error instanceof TypeError
          ? 'No pudimos conectar con el servidor. Intente de nuevo en un momento.'
          : error.message
      );
    }
  };

  const enviando = estado === 'enviando';
  const restantes = LIMITES.mensajeMax - valores.mensaje.length;

  // Pequeña ayuda para no repetir las mismas props en cada campo.
  const propsCampo = (campo) => ({
    id: campo,
    name: campo,
    value: valores[campo],
    onChange: manejarCambio,
    onBlur: manejarBlur,
    disabled: enviando,
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': errores[campo] ? `${campo}-error` : undefined,
  });

  // ==========================================
  // ZONA C · lo que se ve (JSX)
  // ==========================================
  return (
    <section className="contacto-section" aria-labelledby="contacto-titulo">
      <h2 className="contacto-titulo" id="contacto-titulo">
        Escríbanos
      </h2>
      <p className="contacto-intro">
        ¿Quiere reservar mesa o preguntar algo? Déjenos su mensaje y le respondemos
        al correo que nos indique.
      </p>

      <form className="contacto-form" onSubmit={manejarEnvio} noValidate>
        {/* --- Nombre --- */}
        <div className="campo">
          <label htmlFor="nombre">Su nombre</label>
          <input
            type="text"
            autoComplete="name"
            maxLength={LIMITES.nombreMax}
            placeholder="Ej. María López"
            ref={nombreRef}
            {...propsCampo('nombre')}
          />
          {errores.nombre && (
            <p className="campo-error" id="nombre-error" role="alert">
              {errores.nombre}
            </p>
          )}
        </div>

        {/* --- Correo --- */}
        <div className="campo">
          <label htmlFor="email">Su correo</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            ref={emailRef}
            {...propsCampo('email')}
          />
          {errores.email && (
            <p className="campo-error" id="email-error" role="alert">
              {errores.email}
            </p>
          )}
        </div>

        {/* --- Mensaje --- */}
        <div className="campo">
          <label htmlFor="mensaje">Su mensaje</label>
          <textarea
            rows={5}
            maxLength={LIMITES.mensajeMax}
            placeholder="Cuéntenos qué necesita..."
            ref={mensajeRef}
            {...propsCampo('mensaje')}
          />
          <p className="contador" aria-live="polite">
            {restantes} caracteres disponibles
          </p>
          {errores.mensaje && (
            <p className="campo-error" id="mensaje-error" role="alert">
              {errores.mensaje}
            </p>
          )}
        </div>

        {/* --- Trampa anti-spam (invisible para personas) --- */}
        <div className="trampa-spam" aria-hidden="true">
          <label htmlFor="telefono">No llene este campo</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={valores.telefono}
            onChange={manejarCambio}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button type="submit" className="boton-enviar" disabled={enviando}>
          {enviando ? 'ENVIANDO...' : 'ENVIAR MENSAJE ▶'}
        </button>

        {/* --- Aviso del resultado --- */}
        <div className="aviso-zona" aria-live="polite">
          {estado === 'exito' && (
            <p className="aviso aviso-exito">
              ¡Mensaje enviado! Le responderemos pronto. Gracias.
            </p>
          )}
          {estado === 'error' && (
            <p className="aviso aviso-error" role="alert">
              {errorServidor}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
