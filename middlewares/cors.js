import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5500'
];

const corsMiddleware = (acceptedOrigins = ACCEPTED_ORIGINS) => cors({
    origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
            return callback(null, origin);
        }

        return callback(new Error('Not allowed by CORS'));
    }
});

export default corsMiddleware;
