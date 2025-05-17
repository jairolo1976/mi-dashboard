// index.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

app.use(express.json());

// Habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/alumnos', async (req, res) => {
  console.log("👉 Ruta /alumnos fue llamada");
  try {
    console.log("🌍 Llamando al webhook:", MAKE_WEBHOOK_URL);
    const response = await fetch(MAKE_WEBHOOK_URL);
    const texto = await response.text(); // ⚠️ leer como texto en vez de JSON

    console.log("📦 Respuesta cruda de Make:", texto);

    // ⚠️ OJO: si sabes que es JSON, puedes probar con JSON.parse()
    try {
      const json = JSON.parse(texto);
      res.json(json);
    } catch (err) {
      res.send(texto); // si no es JSON, solo devuélvelo como está
    }
  } catch (err) {
    console.error("❌ Error al llamar a Make:", err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
