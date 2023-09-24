import { validateMovie, validatePartialMovie } from '../movie-schema.js';

class MovieController {
    constructor({ movieModel }) {
        this.movieModel = movieModel;
    }

    create = async (request, response) => {
        const result = validateMovie(request.body);
        if (result.error) {
            return response.status(400).json({ code: 400, errors: result.error.issues });
        }
        const newMovie = await this.movieModel.create({ newMovie: result.data });
        response.status(201).json(newMovie);
    }

    getAll = async (request, response) => {
        const { genre } = request.query;
        const movies = await this.movieModel.getAll({ genre });
        response.json(movies);
    }

    getByID = async (request, response) => {
        const { id } = request.params;
        const requestedMovie = await this.movieModel.getByID({ id });
        if (requestedMovie) {
            return response.json(requestedMovie);
        }
        return response.status(404).json({ code: 404, message: 'Movie not found' });
    }

    update = async (request, response) => {
        const { id } = request.params;
        const result = validatePartialMovie(request.body);
        if (result.error) return response.status(400).json({ code: 400, errors: result.error.issues });
        const updatedMovie = await this.movieModel.update({ id, updatedMovie: result.data });
        response.status(201).json(updatedMovie);
    }

    delete = async (request, response) => {
        const { id } = request.params;
        const result = await this.movieModel.delete({ id });
        response.json(result);
    }
}

export default MovieController;
