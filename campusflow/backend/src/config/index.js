const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'campusflow',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || ''
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'campusflow_jwt_secret_key_2026_secure',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

module.exports = config;
