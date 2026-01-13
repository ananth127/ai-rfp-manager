const config = {
    // Database
    MONGO_URI: process.env.MONGO_URI,

    // API Keys
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // Email (SMTP)
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_HOST: process.env.EMAIL_HOST,

    // IMAP
    IMAP_HOST: process.env.IMAP_HOST || 'imap.gmail.com',
    IMAP_PORT: 993,
};

export default config;
