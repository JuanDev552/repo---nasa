const axios = require('axios');
const APOD = require('../models/apodModel.js'); // Importa el modelo de la base de datos
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/nasa')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Funcion para descargar los datos historicos de la API de la NASA
const downloadHistoricalData = async (startDate, endDate) => {

    try {
        console.log(`Descargando datos desde ${startDate} hasta ${endDate}...`);

        // Hacer la solicitud a la API de la NASA para el rango de fechas
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`);
        const apods = response.data;

        // Recorre los datos y los guarda en la base de datos
        for (let apod of apods) {
            const existingAPOD = await APOD.findOne({ date: apod.date });
            if (!existingAPOD) {
                const newAPOD = new APOD(apod); // Crear una nueva instancia del modelo APOD
                await newAPOD.save();
                console.log(`Guardado: ${apod.date}`);
            } else {
                console.log(`Ya existe: ${apod.date}`);
            }
        }

        console.log('Descarga completada.');
    } catch (error) {
        console.log('Error al descargar los datos historicos:', error.message);
    } finally {
        // Cerrar la conexion a la base de datos
        mongoose.connection.close();
    }

};

// Ejecutar la funcion con un rango de fechas
const startDate = '2025-04-01';
const endDate = '2025-04-10';
downloadHistoricalData(startDate, endDate);
