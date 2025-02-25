const axios = require('axios');
const Apod = require('../models/ApodModel');

const getApod = async (req, res) => {

    const { date } = req.query;
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el APOD' });
    }
};

const saveApod = async (req, res) => {
    const { title, explanation, date, url, media_type, copyright  } = req.body;
    try {
        const newApod = new APOD ({ title, explanation, date, url, media_type, copyrigth });
        await newApod.save();
        res.status(201).json(newApod);
    } catch (error) {
        res.status(400).json({ message: 'Error al guardar el APOD en la base de datos' });
    }
};

module.exports = {
    getApod,
    saveApod
};