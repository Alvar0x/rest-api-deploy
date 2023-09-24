import { Router } from 'express';
import MovieController from '../controllers/movies.js';

const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router();

    const movieController = new MovieController({ movieModel });

    moviesRouter.post('/', movieController.create);
    moviesRouter.get('/', movieController.getAll);
    moviesRouter.get('/:id', movieController.getByID);
    moviesRouter.patch('/:id', movieController.update);
    moviesRouter.delete('/:id', movieController.delete);

    return moviesRouter;
}

export default createMovieRouter;
