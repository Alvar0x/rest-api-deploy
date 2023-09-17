import Movie from '../models/movie.js';
import { validateMovie, validatePartialMovie } from '../movie-schema.js';

class MovieController {
    static async create(request, response) {
        const result = validateMovie(request.body);
        if (result.error) {
            return response.status(400).json({ code: 400, errors: result.error.issues });
        }
        const newMovie = await Movie.create({ newMovie: result.data });
        response.status(201).json(newMovie);
    }

    static async getAll(request, response) {
        const { genre } = request.query;
        const movies = await Movie.getAll({ genre });
        response.json(movies);
    }

    static async getByID(request, response) {
        const { id } = request.params;
        const requestedMovie = await Movie.getByID({ id });
        if (requestedMovie) {
            return response.json(requestedMovie);
        }
        return response.status(404).json({ code: 404, message: 'Movie not found' });
    }

    static async update(request, response) {
        const { id } = request.params;
        const result = validatePartialMovie(request.body);
        if (result.error) return response.status(400).json({ code: 400, errors: result.error.issues });
        const updatedMovie = await Movie.update({ id, updatedMovie: result.data });
        response.status(201).json(updatedMovie);
    }

    static async delete(request, response) {
        const { id } = request.params;
        const result = await Movie.delete({ id });
        response.json(result);
    }
}

export default MovieController;
