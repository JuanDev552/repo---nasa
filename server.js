const express = require('express');
const mongoose = require('mongoose');
const nasaRoutes = require('./NASA_Backend/routes/nasaRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexion a MongoDB
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

// Rutas
app.use('/api/nasa', nasaRoutes);

// Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
