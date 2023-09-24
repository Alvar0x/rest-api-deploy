import express from 'express';
import picocolors from 'picocolors';
import createMovieRouter from './routes/movies.js';
import corsMiddleware from './middlewares/cors.js';
import 'dotenv/config';

function createApp({ movieModel }) {
    const PORT = process.env.PORT ?? 3000;
    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());

    app.use(corsMiddleware());

    app.get('/', (request, response) => {
        response.json({ message: 'Welcome to my REST API' });
    });

    app.use('/movies', createMovieRouter({ movieModel }));

    app.use((_request, response) => {
        response.status(404).json({ code: 404, message: 'Not found' });
    });

    app.listen(PORT, () => {
        console.log(picocolors.magenta('El servidor está escuchando en ') + picocolors.yellow(`http://localhost:${PORT}`));
    });
}

export default createApp;
