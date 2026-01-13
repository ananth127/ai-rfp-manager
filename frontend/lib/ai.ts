import OpenAI from 'openai';
import { logger } from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

const USE_MOCK = process.env.MOCK_AI === 'true';

// Mock Data Generators
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

export const parseRFPRequest = async (text: string) => {
  logger.info("Parsing RFP Request", { inputLength: text.length, mock: USE_MOCK });

  if (USE_MOCK) {
    logger.info("Using Mock AI for RFP Parsing");
    await new Promise(r => setTimeout(r, 1000)); // Simulate delay
    return mockRfpParsing();
  }

  try {
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

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || '{}';
    logger.debug("AI Response Raw", content);

    const parsed = JSON.parse(content);
    logger.info("AI Parse Success", parsed);
    return parsed;

  } catch (error: any) {
    logger.error("AI Parse Error", error);
    // Auto-fallback to mock on quota error
    if (error?.code === 'insufficient_quota') {
      logger.info("Quota exceeded. Falling back to Mock Data.");
      return mockRfpParsing();
    }
    return { items: [], requirements: [] };
  }
};

export const parseVendorResponse = async (emailBody: string) => {
  logger.info("Parsing Vendor Response", { length: emailBody.length, mock: USE_MOCK });

  if (USE_MOCK) {
    logger.info("Using Mock AI for Vendor Parsing");
    await new Promise(r => setTimeout(r, 1000));
    return mockVendorResponse();
  }

  try {
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

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || '{}';
    logger.debug("AI Vendor Response Raw", content);

    return JSON.parse(content);
  } catch (error: any) {
    logger.error("AI Parse Response Error", error);
    if (error?.code === 'insufficient_quota') {
      return mockVendorResponse();
    }
    return null;
  }
};

export const compareProposals = async (rfpOriginal: string, proposals: any[]) => {
  logger.info("Comparing Proposals", { count: proposals.length, mock: USE_MOCK });

  if (USE_MOCK) {
    logger.info("Using Mock AI for Comparison");
    await new Promise(r => setTimeout(r, 1500));
    return mockComparison();
  }

  try {
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

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || '{}';
    logger.debug("AI Comparison Raw", content);

    return JSON.parse(content);
  } catch (error: any) {
    logger.error("AI Compare Error", error);
    if (error?.code === 'insufficient_quota') {
      return mockComparison();
    }
    return null;
  }
};
