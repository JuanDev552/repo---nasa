const axios = require('axios');
const APOD = require('../models/apodModel.js'); // Importa el modelo de la base de datos

const getAPOD = async (req, res) => {

    try {
        // Verifica si ya tienes los datos en MongoDB
        const existingAPOD = await APOD.findOne({date});

        if (existingAPOD) {
            // Si ya existe, devuelve los datos desde MongoDB
            return res.json(existingAPOD);
        } else {
            // Si no existe, haz la solicitud a la API de la NASA
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);

            // Guarda los datos en MongoDB
            const newAPOD = new APOD(response.data);
            await newAPOD.save();

            // Devuelve los datos al Frontend
            res.json(response.data);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el APOD' });
    }
};

const saveAPOD = async (req, res) => {
    const { title, explanation, date, url, medi_type, copyright } = req.body;
    try {
        // Verifica si ya existe un APOD con la misma fecha
        const existingAPOD = await APOD.findOne({date});
        if (existingAPOD) {
            return res.status(400).json({ message: 'Ya existe un APOD con esa fecha' });
        }
        // Crea un nuevo APOD y lo guarda en la base de datos
        const newAPOD = new APOD({ title, explanation, date, url, media_type, copyright });
        await newAPOD.save();
        res.status(201).json(newAPOD); // Corregido: newAPOD en lugar de newApod

    } catch (error) {
        res.status(400).json({ message: 'Error al guardar el APOD en la base de datos' });
    }
};

module.exports = {
    getAPOD,
    saveAPOD
};