import 'dotenv/config';

export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'hello123@',
  mongoUri: process.env.DATABASE_URL,
  chroma: {
    host: process.env.CHROMA_HOST || 'localhost',
    port: process.env.CHROMA_PORT || 8000
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
};

// For backward compatibility
export const JWT_PASSWORD = config.jwtSecret;
