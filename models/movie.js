import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';

const require = createRequire(import.meta.url);
const movies = require('../movies.json');

class Movie {
    static async create({ newMovie }) {
        newMovie.id = randomUUID();
        movies.push(newMovie);
        return newMovie;
    }

    static async getAll({ genre }) {
        if (genre) {
            return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        }
        return movies;
    }

    static async getByID({ id }) {
        const requestedMovie = movies.find(m => m.id === id);
        return requestedMovie;
    }

    static async update({ id, updatedMovie }) {
        let result;
        const movieIndex = movies.findIndex(m => m.id === id);
        if (movieIndex < 0) result = { code: 404, message: 'Movie not found' };
        else {
            movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
            result = movies[movieIndex];
        }
        return result;
    }

    static async delete({ id }) {
        let result = { code: 200, message: 'Movie deleted successfully' };
        const movieIndex = movies.findIndex(m => m.id === id);
        if (movieIndex < 0) result = { code: 404, message: 'Movie not found' };
        else movies.splice(movieIndex, 1);
        return result;
    }
}

export default Movie;
