const {
  NODE_ENV,
  DEBUG,
  LOG_LEVEL,
  PASSWORD_SALT,
  TOKEN_SECRET,
  USE_NGINX_SOCKET,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  ROLLBAR_ENDPOINT,
  ROLLBAR_ACCESS_TOKEN,
  REDIS_URL,
  DATABASE_URL,
} = process.env;

const config = {
  NODE_ENV,
  isDevelopment: NODE_ENV === 'development' || DEBUG,
  port: USE_NGINX_SOCKET ? '/tmp/nginx.socket' : process.env.PORT || 8000,
  auth: {
    passwordSalt: PASSWORD_SALT || '$2b$10$Xl5YGCDX9U.ebiuOZgrt2e',
    tokenSecret: TOKEN_SECRET || 'jnfsdpuNF982piuf;ns:*O3n',
    expires: {
      access: 7200, // seconds, 2 hours
      refresh: 604800, // seconds, 1 week
    }
  },
  notifications: {
    sendgrid: {
      username: SENDGRID_USERNAME,
      password: SENDGRID_PASSWORD,
    },
  },
  logging: {
    DEBUG,
    LOG_LEVEL: LOG_LEVEL || 'info',
  },
  database: {
    redis: {
      url: REDIS_URL,
    },
    postgres: {
      url: DATABASE_URL,
    }
  }
};
export default config;
