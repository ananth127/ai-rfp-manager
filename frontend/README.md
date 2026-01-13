
# AI-Powered RFP Management System (Next.js Edition)

## Project Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or URL)
- OpenAI API Key
- Email Account (Gmail/IMAP supported) for testing sending/receiving.

### Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Configuration**:
    - Create a `.env.local` file with:
      ```
      MONGO_URI=mongodb://localhost:27017/rfp_system_next
      OPENAI_API_KEY=your_key_here
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_app_password
      EMAIL_HOST=smtp.gmail.com
      ```

### Running Locally

1.  **Development Server**:
    ```bash
    npm run dev
    ```
2.  Open `http://localhost:3000` in your browser.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Headless UI
-   **Backend**: Next.js API Routes
-   **Database**: MongoDB (Mongoose)
-   **AI**: OpenAI API (GPT-3.5/4)
-   **Email**: Nodemailer & Imap-Simple

## API Routes

-   `GET /api/rfps`: List RFPs
-   `POST /api/rfps`: Create RFP
-   `POST /api/rfps/parse`: Parse NL to JSON
-   `POST /api/vendors`: Create Vendor
-   `POST /api/rfps/[id]/send`: Send emails
-   `POST /api/proposals/refresh`: Check inbox

---

*Created by Antigravity*
