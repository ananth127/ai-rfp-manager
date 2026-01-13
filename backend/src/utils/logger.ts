
const ENABLE_LOGGING = process.env.ENABLE_LOGGING === 'true';

export const logger = {
    info: (message: string, data?: any) => {
        if (ENABLE_LOGGING) {
            console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    },
    error: (message: string, error?: any) => {
        // Always log errors, but respect format
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    debug: (message: string, data?: any) => {
        if (ENABLE_LOGGING) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    }
};
