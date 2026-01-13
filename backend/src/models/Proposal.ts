
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProposalLineItem {
    name: string;
    price: number;
    notes: string;
}

export interface IProposal extends Document {
    rfp: mongoose.Types.ObjectId;
    vendor: mongoose.Types.ObjectId;
    emailContent: string;
    receivedAt: Date;
    parsedData: {
        totalPrice: number;
        deliveryTimeline: string;
        lineItems: IProposalLineItem[];
        warranty: string;
        score: number;
        summary: string;
        analysis: string;
    };
}

const ProposalSchema: Schema = new Schema({
    rfp: { type: Schema.Types.ObjectId, ref: 'RFP', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    emailContent: String,
    receivedAt: { type: Date, default: Date.now },
    parsedData: {
        totalPrice: Number,
        deliveryTimeline: String,
        lineItems: [{
            name: String,
            price: Number,
            notes: String
        }],
        warranty: String,
        score: Number,
        summary: String,
        analysis: String
    }
});

const Proposal: Model<IProposal> = mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema);
export default Proposal;
