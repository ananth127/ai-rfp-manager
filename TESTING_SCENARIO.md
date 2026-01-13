
# 🧪 End-to-End Testing Scenario

This guide will walk you through testing the entire **AI-Powered RFP Management System**.

> **Pre-requisite**: Ensure the app is running (`npm run dev` in `frontend/`) and you have your `OPENAI_API_KEY` set in `.env.local`.

---

## 1. Create Data (Vendors)
First, we need "Vendors" in the system to invite.

1.  Navigate to **Vendors** (e.g., `http://localhost:3000/vendors`).
2.  Click **"Add Vendor"**.
3.  Add **Vendor A**:
    -   Name: `TechCorp Solutions`
    -   Email: `sales@techcorp.com` (Fake is fine for simulation)
    -   Contact: `Alice Smith`
    -   Tags: `Electronics, Hardware`
4.  Add **Vendor B**:
    -   Name: `Global Gadgets Inc`
    -   Email: `orders@globalgadgets.com`
    -   Contact: `Bob Jones`
    -   Tags: `Laptops`

---

## 2. Create an RFP (The Request)
Now, masquerade as a procurement manager.

1.  Go to the **Home Page** (`/`).
2.  Click **"Create New RFP"**.
3.  **Input Scenario**: Enter the following natural language request:
    > "I need to purchase 50 high-performance laptops for our dev team. Specs: 32GB RAM, 1TB SSD, M3 Max chip. Also need 50 4k Monitors (27-inch). Budget is $200,000. Delivery required by next month."
4.  Click **"Generate Structure"**.
5.  **Check**:
    -   Does the AI identify the budget (`$200,000`)?
    -   Does it list 2 Items (`Laptops`, `Monitors`) with correct quantities?
6.  Click **"Create RFP"**.

---

## 3. Invite Vendors
1.  You will be redirected to the **RFP Details Page**.
2.  In the "Invite Vendors" section, you should see TechCorp and Global Gadgets.
3.  Select both of them.
4.  Click **"Send to 2 Vendors"**.
    -   *Note: If you haven't set up real Email credentials, this will just update the UI status to 'Sent' but log an error in the console. That is fine for this test.*

---

## 4. Simulate Vendor Responses
Since we might not want to wait for real emails, we will **inject** responses using a hidden debug tool we added.

**Option A: Using Curl/Postman**
Send a POST request to `http://localhost:3000/api/debug/simulate-response` with:
```json
{
  "rfpId": "ID_FROM_Your_URL",
  "vendorId": "ID_OF_VENDOR_A",
  "emailBody": "Hi, thanks for the RFP. We can supply the 50 laptops at $3,500 each and monitors at $400 each. Total is $195,000. Delivery in 3 weeks. 2 Year Warranty included."
}
```

**Option B: Using Browser Console (Easier)**
1.  On the RFP Page, open Chrome DevTools (F12) -> Console.
2.  Get the RfpId from the URL (e.g., `.../rfp/65a1b2c3...`).
3.  Copy-paste this script (Replace IDs with actual ones from your DB/Network tab):

```javascript
// Simulate Vendor A (Cheaper, Good Warranty)
await fetch('http://localhost:5000/api/debug/simulate-response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rfpId: "YOUR_RFP_ID_HERE",
    vendorId: "VENDOR_A_ID_HERE", 
    emailBody: "Dear Team, TechCorp proposal: 50 Laptops @ $3000, 50 Monitors @ $500. Total $175,000. We can deliver in 15 days. Standard 1 year warranty."
  })
})

// Simulate Vendor B (More Expensive, but maybe better specs?)
await fetch('http://localhost:5000/api/debug/simulate-response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rfpId: "YOUR_RFP_ID_HERE",
    vendorId: "VENDOR_B_ID_HERE", 
    emailBody: "Global Gadgets Quote: Laptops $3800 each (M3 Max), Monitors $600. Grand total $220,000. But we offer 3 Years AppleCare+ included and immediate shipping."
  })
})
```

---

## 5. Review & Compare
1.  Reload the **RFP Details Page**.
2.  Click **"Refresh Inbox"** (This will just re-fetch the database since we injected the data).
3.  **Check**: You should see 2 Proposals in the table.
    -   AI Score should be calculated (e.g., 85/100).
    -   Prices and Summaries should be visible.
4.  Click **"AI Compare & Recommend"**.
5.  **Check**:
    -   A green recommendation box should appear.
    -   It should likely recommend **TechCorp** for price OR **Global Gadgets** for warranty/speed, depending on how the AI weighs the criteria.

---
**Success!** You have verified the end-to-end AI workflow.
