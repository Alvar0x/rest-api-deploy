import { z } from 'zod';

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    genre: z.array(z.enum(['horror', 'drama', 'action', 'adventure', 'sci-fi', 'crime', 'romance', 'animation', 'biography', 'fantasy']), {
        invalid_type_error: 'Movie genre is not valid',
        required_error: 'Movie genre is required'
    }),
    year: z.number({
        invalid_type_error: 'Movie year must be a number',
        required_error: 'Movie year is required'
    }).int().min(1900).max(new Date().getFullYear),
    director: z.string({
        invalid_type_error: 'Movie director must be a string',
        required_error: 'Movie director is required'
    }),
    duration: z.number({
        invalid_type_error: 'Movie duration must be a number',
        required_error: 'Movie duration is required'
    }).int().gt(0),
    poster: z.string({
        required_error: 'Movie poster is required'
    }).url({
        message: 'Movie poster must be an url'
    }),
    rate: z.number({
        invalid_type_error: 'Movie rate must be a number'
    }).min(0).max(10).optional()
});

export function validateMovie(object) {
    // Devuelve objeto result con datos si todo ha ido bien, y si no, con el error
    return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object);
}
