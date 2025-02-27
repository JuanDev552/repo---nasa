//const axios = require('axios');
const APOD = require('../models/apodModel.js'); // Importa el modelo de la base de datos

const getAPOD = async (req, res) => {
    const {id} = req.query;
    try {
        
        // Verifica si ya tienes los datos en MongoDB
        const existingAPOD = await APOD.findOne({date});

        if (existingAPOD) {
            // Si ya existe, devuelve los datos desde MongoDB
            res.json(existingAPOD);
        } else {
            /*
            // Si no existe, haz la solicitud a la API de la NASA
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);
            
            // Guarda los datos en MongoDB
            const newAPOD = new APOD(response.data);
            await newAPOD.save();

            // Devuelve los datos al frontend
            res.json(newAPOD);
            */
            res.status(404).json({ message: 'No se encontró el APOD para la fecha especificada' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el APOD' });
    }
};

const getAllAPODs = async (req, res) => {
    try {
        const apods = await APOD.find();
        res.json(apods);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los APODs' });
    }
};

/*
const saveAPOD = async (req, res) => {
    const { title, explanation, date, url, media_type, copyright } = req.body;
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
*/

const updateAPOD = async (req, res) => {
    const { id } = req.query;
    const { title, explanation, url, media_type, copyright } = req.body;
    try {
        // Verifica si el APOD existe
        const existingAPOD = await APOD.findOne({ date });
        if (!existingAPOD) {
            return res.status(404).json({ message: 'No se encontró el APOD para la fecha especificada' });
        }

        // Actualiza los campos del APOD
        existingAPOD.title = title || existingAPOD.title;
        existingAPOD.explanation = explanation || existingAPOD.explanation;
        existingAPOD.url = url || existingAPOD.url;
        existingAPOD.media_type = media_type || existingAPOD.media_type;
        existingAPOD.copyright = copyright || existingAPOD.copyright;

        // Guarda los cambios en la base de datos
        await existingAPOD.save();
        res.json(existingAPOD);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el APOD' });
    }
};

const deleteAPOD = async (req, res) => {
    const { id } = req.query;
    try {
        // Verifica si el APOD existe
        const existingAPOD = await APOD.findOne({ date });
        if (!existingAPOD) {
            return res.status(404).json({ message: 'No se encontró el APOD para la fecha especificada' });
        }

        // Elimina el APOD de la base de datos
        await APOD.deleteOne({ date });
        res.json({ message: 'APOD eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar el APOD' });
    }
};

module.exports = {
    getAPOD,
    getAllAPODs,
    //saveAPOD,
    updateAPOD,
    deleteAPOD
};