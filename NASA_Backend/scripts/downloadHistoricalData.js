const axios = require('axios');
const Apod = require('../models/ApodModel'); // Importa el modelo de la base de datos
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/nasa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Funcion para descargar los datos historicos de la API de la NASA
const downloadHistoricalData = async (startDate, endDate) => {

    try {
        console.log(`Descargando datos desde ${startDate} hasta ${endDate}...`);

        // Hacer la solicitud a la API de la NASA para el rango de fechas
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`);
        const apods = response.data;

        // Recorre los datos y los guarda en la base de datos
        for (let apod of apods) {
            const existingApod = await Apod.findOne({ date: apod.date });
            if (!existingApod) {
                const newApod = new apod(apod);
                await newApod.save();
                console.log(`Guardado: ${apod.date}`);
            } else {
                console.log(`Ya existe: ${apod.date}`);
            }
        }

        console.log('Descarga completada.');
    }
    catch (error) {
        console.log('Error al descargar los datos historicos:', error.message);
    } finally {
        // Cerrar la conexion a la base de datos
        mongoose.connection.close();
    }

};

// Ejecutar la funcion con un rango de fechas
const startDate = '2025-02-10';
const endDate = '2025-02-20';
downloadHistoricalData(startDate, endDate);
