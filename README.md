# 🤖 AI-Powered RFP Management System

A modern, intelligent procurement platform that uses AI to streamline the RFP (Request for Proposal) process from creation to vendor proposal analysis.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered RFP Parsing**: Automatically converts natural language descriptions into structured RFPs
- **Smart Vendor Management**: Organize and manage vendor information with tags
- **Automated Email Distribution**: Send RFPs to multiple vendors with one click
- **Intelligent Proposal Analysis**: AI extracts key information from vendor email responses
- **Comparative Analysis**: AI compares proposals and provides recommendations

### 🎨 Modern UI/UX
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Tab-Based Navigation**: Intuitive organization of RFP details, vendors, and proposals
- **Interactive Components**: Editable tag pills, dynamic forms, and smooth animations
- **Glassmorphism Effects**: Modern design with backdrop blur and gradients
- **Real-time Status Updates**: Visual indicators for RFP status and vendor responses

### 🔐 Security & Best Practices
- Environment-based configuration
- Secure API key management
- Input validation and sanitization
- CORS protection

## 🏗️ Architecture

### Frontend (Next.js 14)
```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard
│   ├── create/            # RFP creation
│   ├── vendors/           # Vendor management
│   └── rfp/[id]/          # RFP details
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Modal.tsx
│   └── TagInput.tsx
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── ai.ts             # AI integration
└── models/               # TypeScript interfaces
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── scripts/         # Utility scripts
└── server.ts            # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Google AI (Gemini) API key
- Gmail account for email automation (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ananth127/ai-rfp-manager.git
cd ai-rfp-manager
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials:
# - MONGODB_URI
# - GEMINI_API_KEY
# - EMAIL credentials (optional)
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.local.example .env.local
# Edit .env.local with:
# - NEXT_PUBLIC_API_URL=http://localhost:5000
# - GEMINI_API_KEY (for client-side AI)
```

4. **Run Development Servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_gemini_api_key

# Email (optional for proposal checking)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
IMAP_HOST=imap.gmail.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GEMINI_API_KEY=your_gemini_api_key
```

## 📱 Usage

### 1. Create an RFP
- Go to "Create RFP" page
- Describe your needs in plain language
- AI automatically structures it into items, budget, deadline, etc.

### 2. Manage Vendors
- Add vendor details (name, email, contact person, tags)
- Edit or delete vendors as needed
- Tag vendors for easy categorization

### 3. Send RFP to Vendors
- Open an RFP
- Navigate to "Vendors" tab
- Select vendors to receive the RFP
- Click "Send"

### 4. Review Proposals
- Vendors respond via email
- Click "Refresh Inbox" to check for responses
- AI extracts: price, delivery timeline, warranty, line items
- Use "AI Compare & Recommend" for intelligent analysis

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **Email**: Nodemailer + IMAP

### AI Capabilities
- Natural language RFP parsing
- Vendor proposal extraction
- Comparative analysis
- Smart recommendations

## 📊 API Endpoints

### RFPs
- `GET /rfps` - List all RFPs
- `POST /rfps` - Create RFP
- `GET /rfps/:id` - Get RFP details
- `POST /rfps/:id/send` - Send to vendors
- `GET /rfps/:id/compare` - AI comparison

### Vendors
- `GET /vendors` - List vendors
- `POST /vendors` - Create vendor
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Proposals
- `GET /proposals?rfpId=:id` - Get proposals for RFP
- `POST /proposals/check-inbox` - Check email for new proposals

## 🎯 Key Features Breakdown

### AI-Powered RFP Parsing
```typescript
Input: "Need 50 MacBooks with 32GB RAM, budget $200k, needed by end of month"

Output: {
  items: [{ name: "MacBook", quantity: 50, specs: "32GB RAM" }],
  budget: 200000,
  deadline: "2024-01-31",
  currency: "USD"
}
```

### Interactive Tag Management
- Add tags by typing and pressing Enter
- Click tag to edit inline
- Hover to see remove button (desktop) or always visible (mobile)

### Proposal AI Extraction
Extracts from vendor emails:
- Total price
- Delivery timeline
- Individual line items with prices
- Warranty information
- Summary

## 🌟 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Ananth**
- GitHub: [@ananth127](https://github.com/ananth127)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent processing
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling

---

⭐ If you found this project helpful, please give it a star!
