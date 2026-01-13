# Setup Instructions for Next.js Version

### 1. Environment Setup
Create a `.env.local` file in this directory (`rfp-next/`) with the following keys:

```bash
MONGO_URI=mongodb://localhost:27017/rfp_system_next
OPENAI_API_KEY=sk-xxxx
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)
