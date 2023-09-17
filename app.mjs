import Express from 'express';
import picocolors from 'picocolors';
import movies from './movies.mjs';
import crypto from 'node:crypto';
import cors from 'cors';
import { validateMovie, validatePartialMovie } from './schemas.mjs';

const PORT = process.env.PORT ?? 3000;
const app = Express();

app.disable('x-powered-by');
app.use(Express.json());

// Permitir métodos y acceso de orígenes diferentes al de esta API con middleware (npm i cors -E)
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:5500',
            'http://localhost:3000',
            'http://127.0.0.1:5500'
        ];

        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            return callback(null, origin);
        }

        return callback(new Error('Not allowed by CORS'));
    }
}));

app.get('/', (request, response) => {
    response.json({ message: 'API REST Homepage' });
});

app.get('/movies', (request, response) => {
    // Permitir acceso de orígenes diferentes al de esta API manualmente
    // const origin = request.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //     response.header('Access-Control-Allow-Origin', origin);
    // }

    const { genre } = request.query;

    if (genre) {
        const requestedMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        response.json(requestedMovies);
    } else response.json(movies);
});

app.get('/movies/:id', (request, response) => {
    const { id } = request.params;
    const requestedMovie = movies.find(movie => movie.id === id);

    if (requestedMovie) response.json(requestedMovie);
    else response.status(404).json({ code: 404, message: 'Movie not found' });
});

app.post('/movies', (request, response) => {
    const result = validateMovie(request.body);

    if (result.error) {
        return response.status(400).json({ code: 400, errors: result.error.issues });
    }

    const newMovie = { id: crypto.randomUUID(), ...result.data };
    movies.push(newMovie);

    response.status(201).json(newMovie);
});

app.patch('/movies/:id', (request, response) => {
    const { id } = request.params;
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex < 0) return response.status(404).json({ code: 404, message: 'Movie not found' });

    const result = validatePartialMovie(request.body);
    if (result.error) return response.status(400).json({ code: 400, errors: result.error.issues });

    movies[movieIndex] = { ...movies[movieIndex], ...result.data };

    response.status(201).json(movies[movieIndex]);
});

app.delete('/movies/:id', (request, response) => {
    // Permitir acceso de orígenes diferentes al de esta API manualmente
    // const origin = request.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //     response.header('Access-Control-Allow-Origin', origin);
    // }

    const { id } = request.params;
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex < 0) return response.status(404).json({ code: 404, message: 'Movie not found' });

    movies.slice(movieIndex, 1);

    response.json({ code: 200, message: 'Movie deleted successfully' });
});

// Permitir métodos de orígenes diferentes al de esta API manualmente
// app.options('/movies/:id', (request, response) => {
//     const origin = request.header('origin');
//     if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//         response.header('Access-Control-Allow-Origin', origin);
//         response.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE');
//     }
//     response.sendStatus(200);
// });

app.use((request, response) => {
    response.status(404).json({ code: 404, message: 'Not found' });
});

app.listen(PORT, () => {
    console.log(picocolors.magenta('El servidor está escuchando en ') + picocolors.yellow(`http://localhost:${PORT}`));
});
