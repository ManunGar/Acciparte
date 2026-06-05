import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { initPassport } from './config/passport.js';
import { initSequelize } from './models/sequelize.js';
import loadRoutes from './routes/index.js';

const initializeApp = async () => {
    dotenv.config();
    const app = express();
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());
    loadRoutes(app);
    initPassport();
    app.connection = await initializeDatabase();
    return app;
};

const initializeServer = async () => {
    try {
        const app = await initializeApp();
        const port = process.env.APP_PORT || 4040;
        const server = await new Promise((resolve, reject) => {
            const s = app.listen(port, () => resolve(s));
            s.on('error', reject);
        });
        console.log('Backend2 (Caso Practico 2) escuchando en http://localhost:' + server.address().port);
        return { server, app };
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

const initializeDatabase = async () => {
    try {
        const conn = await initSequelize();
        console.log('INFO - PostgreSQL/Sequelize conectado a la base de datos Acciparte.');
        return conn;
    } catch (error) {
        console.error(error);
    }
};

export { initializeServer };