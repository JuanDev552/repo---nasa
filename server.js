const express = require('express');
const mongoose = require('mongoose');
const nasaRoutes = require('./NASA_Backend/routes/nasaRoutes');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

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

// Configuración de Multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Guardar las imágenes en la carpeta "uploads"
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({ storage });

// Middleware
app.use(cors()); // Permite solicitudes desde el frontend
app.use(express.json());

// Ruta para manejar la subida de imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` }); // Devuelve la URL de la imagen
});

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/nasa', nasaRoutes);

// Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
