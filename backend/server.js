const express = require("express"); //Crear y administrar servidor web en Node.js
const cors = require("cors"); //Comunicación entre servidores (Frontend y Backend)
const { Resend } = require("resend"); //Librería para la conexión con API 'Resend'
const rateLimit = require("express-rate-limit");
require("dotenv").config(); //Almacenamiento de API key

// Mensaje en consola para prueba
console.log(
    "API Key cargada:",
    process.env.RESEND_API_KEY ? "SI" : "NO"
);

const app = express();

// Configuración
app.use(cors());
app.use(express.json());

// Lectura de API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting 
// Máximo de 5 solicitudes cada 15 minutos desde una misma IP

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    message: {
        error: "Demasiados intentos. Intenta nuevamente más tarde."
    },

    standardHeaders: true,
    legacyHeaders: false
});

// Guarda temporalmente el último mensaje enviado
// por cada IP para evitar envíos repetidos.
const ultimoMensajePorIP = new Map();

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

// Endpoint del formulario de contacto
app.post("/api/contacto", async (req, res) => {

    const { nombre, email, mensaje } = req.body;

    try {

        // 1. Validación mínima
        // React realiza las validaciones del formulario,
        // pero el backend comprueba que los datos recibidos
        // tengan el tipo esperado.

        if (
            typeof nombre !== "string" ||
            typeof email !== "string" ||
            typeof mensaje !== "string"
        ) {
            return res.status(400).json({
                error: "Datos del formulario no válidos."
            });
        }
        
        // 2. Limpieza de datos
        const nombreLimpio = nombre.trim();
        const emailLimpio = email.trim().toLowerCase();
        const mensajeLimpio = mensaje.trim();

        // 3. Comprobación que no estén vacíos

        if (!nombreLimpio || !emailLimpio || !mensajeLimpio) {
            return res.status(400).json({
                error: "Los campos no pueden estar vacíos."
            });
        }

        // 4. Evitar mensajes repetidos

        const ip = req.ip;

        if (
            ultimoMensajePorIP.has(ip) &&
            ultimoMensajePorIP.get(ip) === mensajeLimpio
        ) {
            return res.status(429).json({
                error: "Ya enviaste este mensaje recientemente."
            });
        }

        ultimoMensajePorIP.set(ip, mensajeLimpio);

        // 5. Enviar correo con Resend

        const { error } = await resend.emails.send({

            from: "Página Web La Placita <onboarding@resend.dev>",

            to: ["laplacita.comedor@gmail.com"],

            // Permite responder directamente al usuario.
            replyTo: emailLimpio,

            subject: `Nuevo mensaje de contacto de ${nombreLimpio}`,

            html: `
                <h2>Nuevo mensaje de contacto</h2>

                <p>
                    <strong>Nombre:</strong>
                    ${escapeHtml(nombreLimpio)}
                </p>

                <p>
                    <strong>Correo:</strong>
                    ${escapeHtml(emailLimpio)}
                </p>

                <p>
                    <strong>Mensaje:</strong>
                </p>

                <p>
                    ${escapeHtml(mensajeLimpio)}
                </p>
            `
        });

        if (error) {

            console.error("Error de Resend:", error);

            return res.status(400).json({
                error: "No fue posible enviar el correo."
            });
        }

        //Respuesta exitosa
        return res.status(200).json({
            mensaje: "Mensaje enviado correctamente."
        });

    } catch (error) {

        console.error("Error del servidor:", error);

        return res.status(500).json({
            error: "Ocurrió un error interno del servidor."
        });
    }
});

// Sanitización

// Evita que contenido introducido por el usuario
// sea interpretado como HTML dentro del correo.

function escapeHtml(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Iniciar servidor

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
