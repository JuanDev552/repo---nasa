const express = require('express');
const nasaController = require('../controllers/nasaController');

const router = express.Router();

// Ruta para obtener el APOD
router.get('/apod', nasaController.getApod);
router.post('/save', nasaController.saveApod);

module.exports = router;