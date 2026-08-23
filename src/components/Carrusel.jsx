import { useEffect, useState } from "react";
import "../styles/Carrusel.css";

const slides = [
    {
        titulo: "Bienvenidos al restaurante La Placita",
        descripcion: "¡Un lugar para disfrutar, compartir y comer delicioso!",
        imagen: "/imagenes_Carrusel/placita.jpg"
    },
    {
        titulo: "¿Quienes somos?",
        descripcion: "¡Más que un restaurante, somos un espacio donde el buen sabor y los momentos compartidos especiales se convierten en experiencias inolvidables!",
        imagen: "/imagenes_Carrusel/quienessomos.jpg"
    },
    {
        titulo: "Desayunos",
        descripcion: "¡Empieza tu día con el mejor sabor!",
        imagen: "/imagenes_Carrusel/desayuno.jpg"
    },
    {
        titulo: "Almuerzos",
        descripcion: "¡Disfruta nuestros platillos, donde el hambre se convierte en felicidad!",
        imagen: "/imagenes_Carrusel/almuerzo.jpg"
    },
    {
        titulo: "Cenas",
        descripcion: "¡Cerrá el día como se debe, con el sabor de La Placita!",
        imagen: "/imagenes_Carrusel/cena.jpg"
    }
];

function Carrusel() {

    const [slideActual, setSlideActual] = useState(0);

    // Cambio automático cada 4 segundos
    useEffect(() => {
        const intervalo = setInterval(() => {
            setSlideActual((actual) => (actual + 1) % slides.length);
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

return (
    <section className="carrusel">

        <div
            className="slides-container"
            style={{
                transform: `translateX(-${slideActual * 100}%)`
            }}
        >

            {slides.map((slide, index) => (

                <div className="slide" key={index}>

                    <img
                        src={slide.imagen}
                        alt={slide.titulo}
                    />

                    <div className="slide-overlay"></div>

                    <div className="slide-contenido">

                        <h1>{slide.titulo}</h1>

                        <p>{slide.descripcion}</p>

                    </div>

                </div>

            ))}

        </div>

    </section>
    );
}

export default Carrusel;