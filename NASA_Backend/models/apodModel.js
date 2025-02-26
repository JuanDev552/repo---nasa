const mongoose = require('mongoose');

// Esquemas para los datos de la API de la NASA
const apodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    date: { type: Date, required: true, unique: true }, // Fecha única para evitar duplicados
    url: { type: String, required: true },
    media_type: { type: String, required: true },
    copyright: { type: String }
});

module.exports = mongoose.model('APOD', apodSchema);