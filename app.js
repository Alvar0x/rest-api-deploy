import Express from 'express';
import picocolors from 'picocolors';
import { moviesRouter } from './routes/movies.js';
import corsMiddleware from './middlewares/cors.js';

// Importar JSON en ESModules recomendado por ahora
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const movies = require('./movies.json');

const PORT = process.env.PORT ?? 3000;
const app = Express();

app.disable('x-powered-by');
app.use(Express.json());

app.use(corsMiddleware());

app.get('/', (request, response) => {
    response.json({ message: 'Welcome to my REST API' });
});

app.use('/movies', moviesRouter);

app.use((_request, response) => {
    response.status(404).json({ code: 404, message: 'Not found' });
});

app.listen(PORT, () => {
    console.log(picocolors.magenta('El servidor está escuchando en ') + picocolors.yellow(`http://localhost:${PORT}`));
});
