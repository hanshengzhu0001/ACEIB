import mongoose, { Document } from 'mongoose';
export interface IMediationTicket extends Document {
    _id: mongoose.Types.ObjectId;
    ticketNumber: string;
    issueType: 'academic' | 'communication' | 'schedule' | 'behavior' | 'technical' | 'other';
    title: string;
    description: string;
    status: 'open' | 'in-review' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reporter: mongoose.Types.ObjectId;
    reported: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    relatedPairing?: mongoose.Types.ObjectId;
    relatedChat?: mongoose.Types.ObjectId;
    resolution?: {
        resolvedBy: mongoose.Types.ObjectId;
        resolution: string;
        resolvedAt: Date;
        satisfactionRating?: number;
        feedback?: string;
    };
    tags: string[];
    attachments: string[];
    internalNotes: Array<{
        note: string;
        createdBy: mongoose.Types.ObjectId;
        createdAt: Date;
    }>;
    statusHistory: Array<{
        status: string;
        changedBy: mongoose.Types.ObjectId;
        changedAt: Date;
        note?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMediationTicket, {}, {}, {}, mongoose.Document<unknown, {}, IMediationTicket, {}, {}> & IMediationTicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=MediationTicket.d.ts.map