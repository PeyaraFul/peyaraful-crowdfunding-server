declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}
