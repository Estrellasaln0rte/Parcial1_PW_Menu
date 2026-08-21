const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);


// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Backend funcionando");
});


// Endpoint del formulario
app.post("/api/contacto", async (req, res) => {

    const { nombre, email, mensaje } = req.body;

    try {

        const { data, error } = await resend.emails.send({

            from: "Mi página <onboarding@resend.dev>",

            to: ["laplacita.comedor@gmail.com"],

            subject: `Nuevo mensaje de ${nombre}`,

            html: `
                <h2>Nuevo mensaje de contacto</h2>

                <p>
                    <strong>Nombre:</strong> ${nombre}
                </p>

                <p>
                    <strong>Correo:</strong> ${email}
                </p>

                <p>
                    <strong>Mensaje:</strong>
                </p>

                <p>${mensaje}</p>
            `
        });

        if (error) {

            return res.status(400).json({
                error: error.message
            });

        }

        res.json({
            mensaje: "Correo enviado correctamente",
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al enviar el correo"
        });
    }
});


app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
