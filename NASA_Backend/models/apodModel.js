const mongoose = require('mongoose');

const apodSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }

});