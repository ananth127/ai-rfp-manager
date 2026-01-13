
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { parseVendorResponse } from './ai';
import RFP from '../models/RFP';
import Vendor from '../models/Vendor';
import Proposal from '../models/Proposal';
import connectDB from './db';

const config = {
    imap: {
        user: process.env.EMAIL_USER as string,
        password: process.env.EMAIL_PASS as string,
        host: process.env.EMAIL_HOST?.replace('smtp', 'imap') || 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false } // Fix for some self-signed certs
    }
};

const SHOULD_MOCK = process.env.MOCK_EMAIL === 'true' || process.env.EMAIL_USER === 'PLACEHOLDER';

export const fetchAndProcessEmails = async () => {
    // Ensure DB connected
    await connectDB();

    if (SHOULD_MOCK) {
        // In mock mode, we assume "Refresh Inbox" was clicked after manually using the Debug API.
        // So we just return "0 new emails from IMAP" (since the Debug API writes directly to DB).
        console.log("[MOCK IMAP] Skipping real email check. Use Debug API to simulate responses.");
        return { processed: 0, totalFound: 0, mockMode: true };
    }

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${messages.length} new emails.`);

        let processedCount = 0;

        for (const item of messages) {
            const all = item.parts.find(part => part.which === 'TEXT');
            const id = item.attributes.uid;
            // @ts-ignore
            const idHeader = "Imap-Id: " + id + "\r\n";
            const mail = await simpleParser(all?.body ? idHeader + all.body : idHeader);

            const subject = mail.subject || "";
            const rfpIdMatch = subject.match(/\[Ref: ([a-f0-9]{24})\]/);

            if (rfpIdMatch && rfpIdMatch[1]) {
                const rfpId = rfpIdMatch[1];
                const fromEmail = mail.from?.value[0]?.address;

                console.log(`Processing response for RFP ${rfpId} from ${fromEmail}`);

                const rfp = await RFP.findById(rfpId);
                const vendor = await Vendor.findOne({ email: fromEmail });

                if (rfp && vendor) {
                    const emailBody = (mail.text || mail.html || "") as string;
                    const parsedData = await parseVendorResponse(emailBody);

                    if (parsedData) {
                        const proposal = new Proposal({
                            rfp: rfp._id,
                            vendor: vendor._id,
                            emailContent: emailBody.substring(0, 5000),
                            parsedData,
                            receivedAt: new Date()
                        });
                        await proposal.save();
                        processedCount++;
                    }
                }
            }
        }

        connection.end();
        return { processed: processedCount, totalFound: messages.length };
    } catch (error: any) {
        console.error("IMAP Error:", error);
        return { error: error.message };
    }
};
