import "dotenv/config";

export const config = {
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "hello123@",
  mongoUri: process.env.DATABASE_URL,
  chroma: {
    host: process.env.CHROMA_HOST || "localhost",
    port: parseInt(process.env.CHROMA_PORT || "8000"),
    url: process.env.CHROMA_HOST
      ? `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT || "8000"}`
      : "http://localhost:8000",
  },
  cors: {
    // origin: process.env.CORS_ORIGIN || "*",
    origin: "https://stash-it-frontend.vercel.app",
    credentials: true,
  },
};

// For backward compatibility
export const JWT_PASSWORD = config.jwtSecret;
