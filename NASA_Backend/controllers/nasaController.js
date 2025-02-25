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
    const { date, title, explanation, url } = req.body;
    const newApod = new Apod({ date, title, explanation, url });
    try {
        const newApod = new APOD ({ date, title, explanation, url });
        await newApod.save();
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el APOD en la base de datos' });
    }
};

module.exports = {
    getApod,
    saveApod
};