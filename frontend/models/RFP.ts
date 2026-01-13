import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRFPItem {
    name: string;
    quantity: number;
    specs: string;
}

export interface IRFP extends Document {
    title: string;
    originalRequest: string;
    structuredData: {
        budget: number | null;
        currency: string;
        deadline: Date | null;
        items: IRFPItem[];
        requirements: string[];
    };
    status: 'draft' | 'sent' | 'closed';
    sentTo: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const RFPSchema: Schema = new Schema({
    title: { type: String, default: 'Untitled RFP' },
    originalRequest: { type: String, required: true },
    structuredData: {
        budget: Number,
        currency: String,
        deadline: Date,
        items: [{
            name: String,
            quantity: Number,
            specs: String
        }],
        requirements: [String]
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'closed'],
        default: 'draft'
    },
    sentTo: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }],
    createdAt: { type: Date, default: Date.now }
});

const RFP: Model<IRFP> = mongoose.models.RFP || mongoose.model<IRFP>('RFP', RFPSchema);
export default RFP;
