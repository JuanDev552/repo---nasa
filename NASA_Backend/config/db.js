const mongoose = require('mongoose');

const BD_URI = 'mongodb://localhost:27017/nasa';

module.exports =  () => {

    const connect = () => {

        mongoose.connect(
            DB_URI,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                if (err) {
                console.log('DB: ERROR!!');
                }
                console.log('Conexion correcta con la base de datos');
            }
        );

    }

    connect();

};