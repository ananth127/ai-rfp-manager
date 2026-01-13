import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

// INIT OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// INIT Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Models to try in order of preference
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

const USE_MOCK = process.env.MOCK_AI === 'true';
const PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' | 'gemini'

// --- MOCK DATA GENERATORS (Unchanged) ---
const mockRfpParsing = () => ({
    budget: 50000,
    currency: "USD",
    deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    items: [
        { name: "High-Performance Laptop", quantity: 50, specs: "32GB RAM, 1TB SSD" },
        { name: "4k Monitor", quantity: 50, specs: "27-inch, 60Hz" }
    ],
    requirements: ["Delivery within 30 days", "Warranty required"]
});

const mockVendorResponse = () => ({
    totalPrice: 48500,
    deliveryTimeline: "2 Weeks",
    lineItems: [
        { name: "Laptop", price: 900, notes: "Bulk discount applied" },
        { name: "Monitor", price: 350, notes: "" }
    ],
    warranty: "1 Year Standard",
    score: 85,
    summary: "Vendor offers a competitive price with fast delivery.",
    analysis: "Pros: Under budget, fast delivery. Cons: Standard warranty only."
});

const mockComparison = () => ({
    recommendation: "TechCorp Solutions",
    reasoning: "This vendor offers the best balance of price ($48,500) and delivery speed (2 weeks), meeting all core requirements.",
    key_differentiators: [" Lowest Price", "Fastest Delivery"],
    rankings: [
        { vendor: "TechCorp Solutions", rank: 1, pros: "Price, Speed", cons: "Warranty" },
        { vendor: "Global Gadgets", rank: 2, pros: "Warranty", cons: "Price" }
    ]
});

// --- HELPER: Gemini Request with Fallback ---
async function geminiGenerateJSON(prompt: string) {
    let lastError;

    for (const modelName of GEMINI_MODELS) {
        try {
            logger.debug(`Attempting Gemini Model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(prompt + "\n\nReturn valid JSON only. Do not wrap in markdown code blocks.");
            const response = await result.response;
            const text = response.text();

            // Clean up markdown code blocks if Gemini returns them
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            logger.info(`Gemini Success with ${modelName}`);
            return JSON.parse(cleanText);

        } catch (error: any) {
            logger.info(`Gemini Model ${modelName} failed: ${error.message?.split('\n')[0] || error}`);
            lastError = error;
            // Continue to next model
        }
    }

    // If all models fail, throw the last error to trigger Mock Data fallback
    throw lastError;
}

// --- HELPER: OpenAI Request ---
async function openaiGenerateJSON(prompt: string) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
}

// --- MAIN FUNCTIONS ---

export const parseRFPRequest = async (text: string) => {
    logger.info("Parsing RFP Request", { inputLength: text.length, mock: USE_MOCK, provider: PROVIDER });

    if (USE_MOCK) {
        logger.info("Using Mock AI for RFP Parsing");
        await new Promise(r => setTimeout(r, 1000));
        return mockRfpParsing();
    }

    const prompt = `
      You are a procurement expert. Analyze the following procurement request and extract structured data.
      Request: "${text}"
      
      Return ONLY a valid JSON object with this structure:
      {
        "budget": number (or null),
        "currency": "string" (e.g. USD),
        "deadline": "YYYY-MM-DD" (or null, calculate from relative dates if possible assuming today is ${new Date().toISOString().split('T')[0]}),
        "items": [
          { "name": "string", "quantity": number, "specs": "string" }
        ],
        "requirements": ["string"]
      }
    `;

    try {
        if (PROVIDER === 'gemini') {
            return await geminiGenerateJSON(prompt);
        } else {
            return await openaiGenerateJSON(prompt);
        }
    } catch (error: any) {
        logger.error("AI Parse Error", error);
        // Fallback logic for Mock
        if (error?.code === 'insufficient_quota' || error?.code === 'invalid_api_key' || error?.status === 401 || error.toString().includes('GoogleGenerativeAI Error')) {
            logger.info("AI Provider Failed. Falling back to Mock Data.");
            return mockRfpParsing();
        }
        return { items: [], requirements: [] };
    }
};

export const parseVendorResponse = async (emailBody: string) => {
    logger.info("Parsing Vendor Response", { length: emailBody.length, mock: USE_MOCK, provider: PROVIDER });

    if (USE_MOCK) {
        logger.info("Using Mock AI for Vendor Parsing");
        await new Promise(r => setTimeout(r, 1000));
        return mockVendorResponse();
    }

    const prompt = `
            You are a procurement assistant. Extract proposal details from this vendor email.
            Email Body: "${emailBody}"
            
            Return ONLY a valid JSON object with this structure:
            {
                "totalPrice": number,
                "deliveryTimeline": "string",
                "lineItems": [{ "name": "string", "price": number, "notes": "string" }],
                "warranty": "string",
                "score": number (1-100 based on completeness and tone),
                "summary": "string",
                "analysis": "string (brief pros/cons)"
            }
        `;

    try {
        if (PROVIDER === 'gemini') {
            return await geminiGenerateJSON(prompt);
        } else {
            return await openaiGenerateJSON(prompt);
        }
    } catch (error: any) {
        logger.error("AI Parse Response Error", error);
        if (error?.code === 'insufficient_quota' || error?.code === 'invalid_api_key' || error?.status === 401 || error.toString().includes('GoogleGenerativeAI Error')) {
            return mockVendorResponse();
        }
        return null;
    }
};

export const compareProposals = async (rfpOriginal: string, proposals: any[]) => {
    logger.info("Comparing Proposals", { count: proposals.length, mock: USE_MOCK, provider: PROVIDER });

    if (USE_MOCK) {
        logger.info("Using Mock AI for Comparison");
        await new Promise(r => setTimeout(r, 1500));
        return mockComparison();
    }

    const prompt = `
            You are a procurement expert. Compare the following vendor proposals against the original RFP requirements and recommend the best vendor.
            
            Original Requirements: "${rfpOriginal}"
            
            Proposals:
            ${JSON.stringify(proposals.map(p => ({
        vendor: p.vendor.name,
        price: p.parsedData.totalPrice,
        timeline: p.parsedData.deliveryTimeline,
        warranty: p.parsedData.warranty,
        items: p.parsedData.lineItems,
        summary: p.parsedData.summary
    })))}
            
            Return ONLY a valid JSON object with this structure:
            {
                "recommendation": "Vendor Name",
                "reasoning": "Detailed explanation of why this vendor is the best choice...",
                "key_differentiators": ["point 1", "point 2"],
                "rankings": [
                    { "vendor": "Vendor Name", "rank": 1, "pros": "string", "cons": "string" }
                ]
            }
        `;

    try {
        if (PROVIDER === 'gemini') {
            return await geminiGenerateJSON(prompt);
        } else {
            return await openaiGenerateJSON(prompt);
        }
    } catch (error: any) {
        logger.error("AI Compare Error", error);
        if (error?.code === 'insufficient_quota' || error?.code === 'invalid_api_key' || error?.status === 401 || error.toString().includes('GoogleGenerativeAI Error')) {
            return mockComparison();
        }
        return null;
    }
};
