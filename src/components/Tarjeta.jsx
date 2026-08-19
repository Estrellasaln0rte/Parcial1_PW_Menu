export default function Tarjeta({ nombre, descripcion, precio, imagen }) {
  return (
    <article className="menu-card">
      <div className="pixel-frame">
        {/* El atributo alt es vital para el lector de pantalla de Wendy */}
        <img src={imagen} alt={`Foto de ${nombre}`} />
      </div>
      <div className="card-info">
        <h3>{nombre}</h3>
        <p className="desc">{descripcion}</p>
        <p className="precio">Q{precio.toFixed(2)}</p>
      </div>
    </article>
  );
}