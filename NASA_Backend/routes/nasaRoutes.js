const express = require('express');
const nasaController = require('../controllers/nasaController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configura Multer para guardar archivos en la carpeta "uploads"

const router = express.Router();

// Ruta para obtener todos los APODs
router.get('/apods', nasaController.getAllAPODs);

// Ruta para guardar un nuevo APOD
router.post('/save', nasaController.saveAPOD);

// Ruta para obtener un APOD por fecha
router.get('/apod', nasaController.getAPOD);

// Ruta para actualizar un APOD por fecha
router.put('/apod', nasaController.updateAPOD);

// Ruta para eliminar un APOD por fecha
router.delete('/apod', nasaController.deleteAPOD);

// Ruta para subir una imagen
router.post('/upload', upload.single('image'), (req, res) => {
    // Devuelve la URL de la imagen subida
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

module.exports = router;