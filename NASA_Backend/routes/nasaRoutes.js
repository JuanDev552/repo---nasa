const express = require('express');
const nasaController = require('../controllers/nasaController');

const router = express.Router();

router.get('/apod', nasaController.getApod);
router.post('/save', nasaController.saveApod);

module.exports = router;