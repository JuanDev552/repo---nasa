const mongoose = require('mongoose');

// Esquemas para los datos de la API de la NASA
const apodSchema = new mongoose.Schema({
    title: { type: String},
    explanation: { type: String},
    date: { type: String }, // Fecha única para evitar duplicados
    url: { type: String},
    media_type: { type: String},
    copyright: { type: String }
});

module.exports = mongoose.model('APOD', apodSchema);