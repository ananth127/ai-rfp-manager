# Google Gemini Integration

This project supports swapping the AI provider between **OpenAI** (default) and **Google Gemini**.

## How to Enable Gemini

1.  **Get an API Key**
    *   Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to generate a free API key.

2.  **Configure Environment (`backend/.env`)**
    Update your `.env` file with the following settings:
    ```bash
    GEMINI_API_KEY=your_actual_key_here
    AI_PROVIDER=gemini
    MOCK_AI=false
    ```

    *   `GEMINI_API_KEY`: Your Google API Key.
    *   `AI_PROVIDER`: Set to `gemini` (case-sensitive) to tell the backend to use the Gemini adapter.
    *   `MOCK_AI`: Set to `false` to actually call the external API.

3.  **Restart Backend**
    *   If `nodemon` is running, it should restart automatically.
    *   Otherwise: `npx nodemon --exec ts-node src/server.ts`

## Verification
Watch the backend console logs when you perform an action (like parsing an RFP). You should see:
```text
[INFO] ... - Parsing RFP Request { "mock": false, "provider": "gemini" }
```
