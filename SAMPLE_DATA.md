
# Sample Data & Verification Guide

Use this exact data to verify your **AI-Powered RFP Management System**.

---

## 1. Setup: Vendors
**Action**: Create these two vendors in the system (via UI -> Vendors -> Add).

### Vendor A: "Budget IT Corp"
- **Name**: Budget IT Corp
- **Email**: sales@budgetit.com
- **Contact**: Sarah Conner
- **Tags**: Hardware, Electronics

### Vendor B: "Premium Tech Systems"
- **Name**: Premium Tech Systems
- **Email**: enterprise@premiumtech.com
- **Contact**: John Wick
- **Tags**: Enterprise, Hardware

---

## 2. Step 1: Create RFP (Input)
**Action**: Go to "Create RFP" and paste this **exact** prompt.

**Input Text**:
> "We are looking to upgrade our design team's equipment. We need 10 Apple MacBook Pro 16-inch (M3 Max, 64GB RAM) and 10 Dell UltraSharp 32-inch 6K Monitors. Our total budget is $60,000. We need delivery to our NY office by February 15th, 2026. Payment terms should be Net 30."

**Expected AI Output (Structure)**:
*   **Budget**: `$60,000`
*   **Currency**: `USD`
*   **Deadline**: `2026-02-15` (or similar date format)
*   **Items**:
    1.  Name: `Apple MacBook Pro 16-inch...` | Qty: `10`
    2.  Name: `Dell UltraSharp 32-inch...` | Qty: `10`

---

## 3. Step 2: Vendor Responses (Simulation)
**Action**: Since we are simulating, use the **API/Console** method to inject these responses.

### Response 1: From "Budget IT Corp" (Vendor A)
**Copy-Paste Email Body**:
> "Hello, thank you for the invite. We can fulfill this order.
> 
> Quote:
> 1. MacBook Pro 16 M3 Max: $3,500 each x 10 = $35,000
> 2. Dell 6K Monitors: $2,000 each x 10 = $20,000
> 
> **Grand Total: $55,000**
> 
> Note: These are refurbished units with 90-day warranty. Delivery estimate is Feb 20th."

**Expected Parsing Result**:
-   **Total Price**: `$55,000`
-   **Delivery**: Feb 20th (Late!)
-   **Warranty**: "90-day" (Weak)
-   **AI Score**: Should be **Lower** (~60-75) due to late delivery and short warranty, despite being under budget.

### Response 2: From "Premium Tech Systems" (Vendor B)
**Copy-Paste Email Body**:
> "Greetings. Here is our proposal for brand new units.
> 
> - 10x MacBook Pro 16 M3 Max (Model Z37): $3,800/unit
> - 10x Dell U3224KB 6K Monitor: $2,300/unit
> 
> **Total Project Cost: $61,000**
> 
> Terms:
> - Includes 3-Year AppleCare+ and Dell Premium Panel Exchange.
> - Guaranteed delivery by Feb 10th.
> - Net 45 Payment terms."

**Expected Parsing Result**:
-   **Total Price**: `$61,000` (Over budget)
-   **Delivery**: Feb 10th (On time)
-   **Warranty**: "3-Year AppleCare+" (Excellent)
-   **AI Score**: Should be **High** (~80-90) despite price, due to quality, warranty, and meeting the deadline.

---

## 4. Step 3: Comparison (The Verdict)
**Action**: Click "**AI Compare & Recommend**".

**Expected Final Recommendation**:
The AI should likely recommend **Premium Tech Systems (Vendor B)**.

**Reasoning Pattern**:
> "Although Vendor B ($61k) is slightly over the $60k budget, they are the **only vendor meeting the delivery deadline** (Feb 10th vs Feb 15th req). Vendor A cannot deliver until Feb 20th, which misses the requirement. Additionally, Vendor B offers brand new units with a superior 3-year warranty compared to Vendor A's refurbished units with only 90 days coverage."

---
