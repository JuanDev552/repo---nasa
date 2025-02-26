const express = require('express');
const nasaController = require('../controllers/nasaController');

const router = express.Router();

// Ruta para obtener el APOD
router.get('/apod', nasaController.getAPOD);
router.post('/save', nasaController.saveAPOD);

module.exports = router;