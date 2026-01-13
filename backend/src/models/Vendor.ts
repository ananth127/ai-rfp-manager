
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVendor extends Document {
    name: string;
    email: string;
    contactPerson: string;
    tags: string[];
    createdAt: Date;
}

const VendorSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactPerson: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

const Vendor: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
export default Vendor;
