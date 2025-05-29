import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Database
  database: {
    url: process.env.DATABASE_URL ,
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL,
  },
  
  // Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  },
  
  // Agora
  agora: {
    appId: process.env.AGORA_APP_ID,
    appCertificate: process.env.AGORA_APP_CERTIFICATE,
  },
  
  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  
  // Client
  client: {
    url: process.env.CLIENT_URL,
  }
};