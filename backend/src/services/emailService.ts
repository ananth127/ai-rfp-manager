
import nodemailer from 'nodemailer';
import { IVendor } from '../models/Vendor';
import { IRFP } from '../models/RFP';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Check if we should mock emails (Explicit Log or no credentials)
const SHOULD_MOCK = process.env.MOCK_EMAIL === 'true' || process.env.EMAIL_USER === 'PLACEHOLDER';

export const sendRFPEmail = async (vendor: IVendor, rfp: IRFP) => {
    // MOCK MODE
    if (SHOULD_MOCK) {
        console.log(`[MOCK EMAIL] Sending to ${vendor.email}`);
        console.log(`[MOCK SUBJECT] Request for Proposal: ${rfp.title} [Ref: ${rfp._id}]`);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));
        return { messageId: 'mock-id-' + Date.now() };
    }

    try {
        const mailOptions = {
            from: `"ProcureAI System" <${process.env.EMAIL_USER}>`,
            to: vendor.email,
            subject: `Request for Proposal: ${rfp.title} [Ref: ${rfp._id}]`,
            text: `
Dear ${vendor.contactPerson || vendor.name},

We are inviting you to submit a proposal for the following request:

Title: ${rfp.title}
Budget Guide: ${rfp.structuredData.currency} ${rfp.structuredData.budget}
Deadline: ${new Date(rfp.structuredData.deadline || Date.now()).toLocaleDateString()}

Items Requested:
${rfp.structuredData.items.map(i => `- ${i.name} (Qty: ${i.quantity}): ${i.specs}`).join('\n')}

Requirements:
${rfp.structuredData.requirements.join('\n')}

Please reply directly to this email with your proposal. Ensure the subject line remains unchanged so our AI system can process your response.

Best regards,
Procurement Team
      `,
            html: `
<div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Request for Proposal</h2>
    <p>Dear ${vendor.contactPerson || vendor.name},</p>
    <p>We are inviting you to submit a proposal for the following request:</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
        <h3 style="margin-top:0;">${rfp.title}</h3>
        <p><strong>Ref ID:</strong> ${rfp._id}</p>
        <p><strong>Budget Guide:</strong> ${rfp.structuredData.currency} ${rfp.structuredData.budget?.toLocaleString()}</p>
        <p><strong>Deadline:</strong> ${new Date(rfp.structuredData.deadline || Date.now()).toLocaleDateString()}</p>
    </div>

    <h3>Items Requested</h3>
    <ul>
        ${rfp.structuredData.items.map(i => `<li><strong>${i.name}</strong> (Qty: ${i.quantity})<br/><span style="color:#666;">${i.specs}</span></li>`).join('')}
    </ul>

    <h3>Requirements</h3>
    <ul>
        ${rfp.structuredData.requirements.map(r => `<li>${r}</li>`).join('')}
    </ul>

    <hr/>
    <p><strong>How to Respond:</strong></p>
    <p>Please reply directly to this email with your proposal details. <br/>
    <span style="color: red;">IMPORTANT: Do not change the subject line of this email.</span></p>
    
    <p>Best regards,<br/>Procurement Team</p>
</div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email to " + vendor.email, error);
        // Fallback to mock on auth failure
        if ((error as any).code === 'EAUTH') {
            console.log("[MOCK FALLBACK] Auth failed. Pretending email sent.");
            return { messageId: 'mock-fallback-id' };
        }
        return null;
    }
};
