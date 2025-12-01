
/**
 * Application Configuration
 * Aggregates environment variables and global settings.
 */

const getSafeEnv = (key: string, defaultValue: string = '') => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
    } catch (e) {
        // ignore
    }
    return defaultValue;
}

export const config = {
  // Gemini API Key
  apiKey: getSafeEnv('API_KEY'),
  
  // Database Configuration
  database: {
    url: getSafeEnv('DATABASE_URL', 'postgres://localhost:5432/mr_daebak'),
    poolSize: 10,
  },

  // API Configuration
  api: {
    endpoint: getSafeEnv('API_ENDPOINT', 'http://localhost:3000/api'),
    timeout: 5000,
  },

  // Feature Flags
  features: {
    enableVoice: true,
    enableGeminiChat: true,
  },

  // App Constants
  app: {
    name: 'Mr. Daebak',
    version: '1.0.0',
    locale: 'ko-KR',
  }
};
