"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_PASSWORD = exports.config = void 0;
require("dotenv/config");
exports.config = {
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'hello123@',
    mongoUri: process.env.DATABASE_URL,
    chroma: {
        host: process.env.CHROMA_HOST || 'localhost',
        port: parseInt(process.env.CHROMA_PORT || '8000'),
        url: process.env.CHROMA_HOST ?
            `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT || '8000'}` :
            'http://localhost:8000'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }
};
// For backward compatibility
exports.JWT_PASSWORD = exports.config.jwtSecret;
