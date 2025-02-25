const mongoose = require('mongoose');

const apodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    media_type: {
        type: String,
        required: true
    },
    copyrigth: {
        type: String,
        required: true
    }

});

const Apod = mongoose.model('Apod', apodSchema);