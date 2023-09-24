import createApp from './app.js';
import Movie from './models/mysql/movie.js';

createApp({ movieModel: Movie });