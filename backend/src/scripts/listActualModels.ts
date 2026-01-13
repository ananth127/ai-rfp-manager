// src/scripts/listActualModels.ts
import dotenv from 'dotenv';
dotenv.config();

async function getActiveModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("Error: GEMINI_API_KEY is not set in .env");
        return;
    }

    console.log("Querying Google API for active models...");
    
    // We use the REST API directly to avoid SDK version mismatches
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log("\n--- AVAILABLE MODELS (Update your code with one of these) ---");
        const availableModels = (data.models || [])
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent")) // Only keep text-generation models
            .map((m: any) => m.name.replace("models/", "")); // Remove the 'models/' prefix for cleaner output

        if (availableModels.length === 0) {
            console.log("No generateContent models found. Check your API key permissions.");
        } else {
            // Sort to put the newest/best looking ones first (e.g. 2.0 or 2.5)
            availableModels.sort().reverse();
            availableModels.forEach((name: string) => console.log(`- ${name}`));
        }

    } catch (error: any) {
        console.error("Failed to fetch models:", error.message);
    }
}

getActiveModels();