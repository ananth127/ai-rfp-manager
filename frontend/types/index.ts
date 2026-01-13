// Frontend type definitions (no mongoose)

export interface IVendor {
    _id?: string;
    name: string;
    email: string;
    contactPerson?: string;
    tags?: string[];
}

export interface IRFPItem {
    name: string;
    quantity: number;
    specs: string;
}

export interface IStructuredData {
    items: IRFPItem[];
    budget: number;
    currency: string;
    deadline: string;
    requirements: string[];
}

export interface IRFP {
    _id?: string;
    title: string;
    originalRequest: string;
    structuredData: IStructuredData;
    status: 'draft' | 'sent' | 'closed';
    sentTo?: string[];
    createdAt: string;
}

export interface IProposalLineItem {
    name: string;
    price: number;
    notes: string;
}

export interface IProposal {
    _id?: string;
    rfp: string;
    vendor: {
        _id: string;
        name: string;
        email: string;
    };
    emailContent: string;
    receivedAt: string;
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
