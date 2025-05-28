const express = require('express');
const mongoose = require('mongoose');
const nasaRoutes = require('./NASA_Backend/routes/nasaRoutes');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const prometheus = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/nasa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos');
}).catch((err) => {
    console.log('Error al conectarse a la base de datos', err);
});

// Middlewareñ
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json());

// Servir archivos estáticos desde la carpeta "Frontend"
app.use(express.static(path.join(__dirname, 'Frontend')));

// Rutas
app.use('/api/nasa', nasaRoutes);

// Ruta para guardar un nuevo APOD
app.post('/api/nasa/apod', (req, res) => {
    const { title, explanation, date, url, media_type, copyright } = req.body;

    // Validar que todos los campos estén presentes
    if (!title || !explanation || !date || !url || !media_type) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Lógica para guardar el APOD (aquí puedes guardarlo en una base de datos)
    console.log('Nuevo APOD recibido:', { title, explanation, date, url, media_type, copyright });

    // Respuesta exitosa
    res.status(201).json({ message: 'APOD guardado correctamente' });
});

// Crear métricas de Prometheus
const httpRequestDurationMicroseconds = new prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duración de las solicitudes HTTP en ms',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 5, 15, 50, 100, 500],
});

// Middleware para medir el tiempo de respuesta
// Middleware para medir el tiempo de respuesta (después de las rutas)
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.url, status: res.statusCode });
    });
    next();
});

//
// Ruta para exponer métricas de Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
});

// Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
