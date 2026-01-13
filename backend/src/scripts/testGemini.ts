
import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'PLACEHOLDER' || key === 'dummy_key') {
        console.error("Error: GEMINI_API_KEY is not set in .env");
        return;
    }

    console.log("Checking available Gemini models for key: " + key.substring(0, 5) + "...");
    const genAI = new GoogleGenerativeAI(key);

    // There isn't a direct "listModels" on the client instance in some versions, 
    // it's often on the class or via a separate manager.
    // However, for the specific @google/generative-ai package:
    // It usually doesn't expose a listModels helper easily on the client instance itself in v0.1.
    // But let's verify if we can just try a standard 'gemini-pro' generation to see if it works 
    // or provides a better error.

    // Actually, checking docs (or common knowledge): listModels is not directly on generic client.
    // Let's try to hit the REST API directly to list models if the SDK helper isn't obvious.
    // But wait, the SDK *should* suffice if we just pick the right name.

    // Let's try to generate with a fallback list of models.
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

    for (const modelName of modelsToTry) {
        console.log(`\n--- Testing Model: ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test. Respond with 'OK'.");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} works! Response: ${response.text()}`);
            process.exit(0); // Found one that works
        } catch (error: any) {
            console.log(`FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
        }
    }
}

listModels();
