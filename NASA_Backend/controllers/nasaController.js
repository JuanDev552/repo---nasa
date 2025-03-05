const axios = require('axios');
const APOD = require('../models/apodModel');

// Función para validar el formato de la fecha (YYYY-MM-DD)
const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

// Obtener un APOD por fecha
const getAPOD = async (req, res) => {
    const { date } = req.query;

    // Validar el formato de la fecha
    if (!date || !isValidDate(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        // Verifica si ya tienes los datos en MongoDB
        const existingAPOD = await APOD.findOne({ date });

        if (existingAPOD) {
            // Si ya existe, devuelve los datos desde MongoDB
            res.json(existingAPOD);
        } else {
            // Si no existe, haz la solicitud a la API de la NASA
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);

            // Guarda los datos en MongoDB
            const newAPOD = new APOD(response.data);
            await newAPOD.save();

            // Devuelve los datos al frontend
            res.json(newAPOD);
        }
    } catch (error) {
        console.error('Error en getAPOD:', error);
        res.status(500).json({ message: 'Error al obtener el APOD' });
    }
};

// Obtener todos los APODs
const getAllAPODs = async (req, res) => {
    try {
        const apods = await APOD.find({});
        res.json(apods);
    } catch (error) {
        console.error('Error en getAllAPODs:', error);
        res.status(500).json({ message: 'Error al obtener los APODs' });
    }
};

// Guardar un nuevo APOD
const saveAPOD = async (req, res) => {
    const { title, explanation, date, url, media_type, copyright } = req.body;

    // Validar el formato de la fecha
    if (!date || !isValidDate(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        // Verifica si ya existe un APOD con la misma fecha
        const existingAPOD = await APOD.findOne({ date });
        if (existingAPOD) {
            return res.status(400).json({ message: 'Ya existe un APOD con esa fecha' });
        }

        // Crea un nuevo APOD y lo guarda en la base de datos
        const newAPOD = new APOD({ title, explanation, date, url, media_type, copyright });
        await newAPOD.save();
        res.status(201).json(newAPOD);
    } catch (error) {
        res.status(400).json({ message: 'Error al guardar el APOD en la base de datos' });
    }
};

// Actualizar un APOD
const updateAPOD = async (req, res) => {
    const { date } = req.query;

    // Validar el formato de la fecha
    if (!date || !isValidDate(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    const { title, explanation, url, media_type, copyright } = req.body;
    try {
        // Busca y actualiza el APOD
        const updatedAPOD = await APOD.findOneAndUpdate(
            { date }, // Filtro para encontrar el registro
            { title, explanation, url, media_type, copyright }, // Datos a actualizar
            { new: true } // Devuelve el registro actualizado
        );

        if (!updatedAPOD) {
            return res.status(404).json({ message: 'No se encontró el APOD para la fecha especificada' });
        }

        res.json(updatedAPOD);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el APOD' });
    }
};

// Eliminar un APOD
const deleteAPOD = async (req, res) => {
    const { date } = req.query;

    // Validar el formato de la fecha
    if (!date || !isValidDate(date)) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
    }

    try {
        // Verifica si el APOD existe
        const existingAPOD = await APOD.findOne({ date });
        if (!existingAPOD) {
            return res.status(404).json({ message: 'No se encontró el APOD para la fecha especificada' });
        }

        // Elimina el APOD de la base de datos
        await APOD.deleteOne({ date });
        res.json({ message: 'APOD eliminado correctamente', deletedAPOD: existingAPOD });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar el APOD' });
    }
};

module.exports = {
    getAPOD,
    getAllAPODs,
    saveAPOD,
    updateAPOD,
    deleteAPOD
};