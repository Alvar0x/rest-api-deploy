import mysql from 'mysql2/promise';

const DEFAULT_CONFIG = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql.createConnection(connectionString);

export class Movie {
    static async create({ newMovie }) {
        const { title, year, director, duration, poster, genre, rate } = newMovie;

        const [[{ uuid }]] = await connection.query('select uuid() uuid;');

        try {
            await connection.query(`
                insert into movies (id, title, year, director, duration, poster, genre, rate)
                    values (uuid_to_bin(?), ?, ?, ?, ?, ?, ?, ?);
            `, [uuid, title, year, director, duration, poster, '', rate]);
        } catch (error) {
            return { code: 400, message: 'Error creating movie' };
        }

        const [movies] = await connection.query(`
            select bin_to_uuid(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.genre, m.rate
                from movies m
                where bin_to_uuid(m.id) = ?;
        `, [uuid]);

        return movies[0];
    }

    static async getAll({ genre }) {
        let finalMovies;

        if (genre) {
            const genresQuery = 'select id from genres where lower(name) = lower(?) limit 1';
            const [genreIDs] = await connection.query(genresQuery, [genre]);

            if (!genreIDs.length) return { code: '404', message: 'Genre not found' };

            const { id: genreID } = genreIDs[0];

            const finalQuery = `
                select bin_to_uuid(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.genre, m.rate
                    from movies m
                    where m.id in (select movie_id from movies_genres where genre_id = ?);
            `;

            const [movies] = await connection.query(finalQuery, [genreID]);
            finalMovies = movies;
        } else {
            const finalQuery = `
                select bin_to_uuid(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.genre, m.rate
                    from movies m;
            `;

            const [movies] = await connection.query(finalQuery);
            finalMovies = movies;
        }

        if (!finalMovies.length) return { code: '404', message: 'No movies found' };
        return finalMovies;
    }

    static async getByID({ id }) {
        const [movie] = await connection.query(`
            select bin_to_uuid(id) id, title, year, director, duration, poster, genre, rate
                from movies where id = uuid_to_bin(?);
        `, [id]);
        if (!movie.length) return { code: '404', message: 'Movie not found' };
        return movie;
    }

    static async update({ id, updatedMovie }) {
        const [movies] = await connection.query(`
            select bin_to_uuid(id) id, title, year, director, duration, poster, genre, rate
                from movies where id = uuid_to_bin(?);
        `, [id]);

        if (!movies.length) return { code: 404, message: 'Movie not found' };

        try {
            await connection.query('update movies set ? where id = uuid_to_bin(?)', [updatedMovie, id]);
        } catch (error) {
            console.log(error);
            return { code: 400, message: 'Error updating movie' };
        }

        const [newMovies] = await connection.query(`
            select bin_to_uuid(id) id, title, year, director, duration, poster, genre, rate
                from movies where id = uuid_to_bin(?);
        `, [id]);

        return newMovies[0];
    }

    static async delete({ id }) {
        const [movies] = await connection.query('select * from movies where id = uuid_to_bin(?)', [id]);

        if (!movies.length) return { code: 404, message: 'Movie not found' };

        try {
            await connection.query('delete from movies where id = uuid_to_bin(?)', [id]);
        } catch(error) {
            return { code: 400, message: 'Error deleting movie' };
        }

        return { code: 204, message: 'Movie deleted successfully' }
    }
}

export default Movie;
