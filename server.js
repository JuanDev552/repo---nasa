const express = require('express');
const mongoose = require('mongoose');
const nasaRoutes = require('./NASA_Backend/routes/nasaRoutes');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

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

// Middleware
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json());

// Servir archivos estáticos desde la carpeta "Frontend"
app.use(express.static(path.join(__dirname, 'Frontend')));

// Rutas
app.use('/api/nasa', nasaRoutes);

// Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
