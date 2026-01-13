# AI-Powered RFP Management System - Implementation Plan

## 1. Project Overview
This project aims to streamline the procurement process by automating RFP creation, vendor management, and proposal comparison using AI. The system will be a single-user web application.

## 2. Architecture & Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (for modern, premium aesthetics) + Headless UI / Radix UI for accessible components.
- **State Management**: React Context / Hooks (sufficient for single-user).
- **HTTP Client**: Axios.

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose). *Chosen for flexibility with unstructured RFP data and varying vendor response formats.*
- **Email**: 
  - Sending: Nodemailer (SMTP)
  - Receiving: `imap-simple` (IMAP)
- **AI**: OpenAI API (GPT-4o or similar) for parsing and generation.

### Structure
```
/root
  /backend
    /src
      /config       # DB, Email, AI config
      /controllers  # Route logic
      /models       # Mongoose schemas
      /routes       # Express routes
      /services     # Business logic (AI, Email services)
      /utils        # Helpers
  /frontend
    /src
      /components   # Reusable UI components
      /pages        # Page views
      /services     # API calls
      /context      # Global state
```

## 3. Data Models

### RFP (Request for Proposal)
```javascript
{
  title: String,
  description: String, // Original natural language
  structuredData: {
    budget: Number,
    currency: String,
    deadline: Date,
    items: [{ name: String, quantity: Number, specs: String }],
    requirements: [String]
  },
  status: 'draft' | 'sent' | 'closed',
  createdAt: Date
}
```

### Vendor
```javascript
{
  name: String,
  email: String,
  contactPerson: String,
  tags: [String] // e.g., "Electronics", "Furniture"
}
```

### Proposal
```javascript
{
  rfpId: ObjectId,
  vendorId: ObjectId,
  originalEmailBody: String,
  receivedAt: Date,
  parsedData: {
    totalPrice: Number,
    deliveryDate: Date,
    lineItems: [{ name: String, price: Number, notes: String }],
    terms: String,
    score: Number, // AI generated score
    summary: String
  }
}
```

## 4. API Endpoints

### RFP Management
- `POST /api/rfps/parse`: Takes NL string, returns structured JSON (AI).
- `POST /api/rfps`: Create new RFP.
- `GET /api/rfps`: List RFPs.
- `GET /api/rfps/:id`: Get details.
- `POST /api/rfps/:id/send`: Send to selected vendors.

### Vendor Management
- `GET /api/vendors`: List vendors.
- `POST /api/vendors`: Add vendor.

### Proposal Processing
- `GET /api/rfps/:id/proposals`: Get all proposals for an RFP.
- `POST /api/proposals/refresh`: Trigger IMAP check for new emails.
- `GET /api/rfps/:id/comparison`: Get AI-generated comparison summary.

## 5. Implementation Steps

### Phase 1: Setup & Infrastructure
1.  Initialize `backend` (Express, Mongoose, Dotenv).
2.  Initialize `frontend` (Vite, Tailwind).
3.  Setup MongoDB connection.
4.  Configure `openai` client.

### Phase 2: RFP Core (Creation)
1.  Create `RFP` model.
2.  Implement `POST /api/rfps/parse` using OpenAI.
    *   *Prompt Engineering*: "Extract budget, items, deadline from this text..."
3.  Implement Frontend "Create RFP" page with Chat/Input interface.
4.  Display the structured output for user confirmation before saving.

### Phase 3: Vendor & Email Sending
1.  Create `Vendor` model and seed some data.
2.  Implement `POST /api/vendors`.
3.  Implement Email Service (Nodemailer).
4.  In `POST /api/rfps/:id/send`, generate a standardized email template and send to vendors.

### Phase 4: Receiving & Parsing Responses
1.  Implement IMAP listener/poller (`imap-simple`).
2.  Filter emails by Subject Line (containing RFP ID standard format like `[RFP-123]`).
3.  When email found -> Send body to AI for parsing.
4.  Save as `Proposal`.

### Phase 5: Comparison & UI Polish
1.  Implement "Compare" view in Frontend.
2.  Visualize data (Table view of vendors vs requirements).
3.  AI "Recommendation" endpoint: Send all parsed proposals + original RFP to AI, ask for ranking and reasoning.

## 6. Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rfp_system
OPENAI_API_KEY=sk-...
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_HOST=...
```
