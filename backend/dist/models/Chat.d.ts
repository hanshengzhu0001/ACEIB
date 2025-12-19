import mongoose, { Document } from 'mongoose';
export interface IChat extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: string;
    participants: mongoose.Types.ObjectId[];
    messages: Array<{
        _id: mongoose.Types.ObjectId;
        sender: mongoose.Types.ObjectId;
        content: string;
        messageType: 'text' | 'image' | 'file' | 'system';
        timestamp: Date;
        readBy: mongoose.Types.ObjectId[];
        edited?: boolean;
        editedAt?: Date;
        attachments?: Array<{
            filename: string;
            url: string;
            fileType: string;
            fileSize: number;
        }>;
    }>;
    pairingId?: mongoose.Types.ObjectId;
    isActive: boolean;
    lastMessage?: {
        sender: mongoose.Types.ObjectId;
        content: string;
        timestamp: Date;
    };
    settings: {
        allowFileSharing: boolean;
        maxFileSize: number;
        messageRetentionDays: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, {}> & IChat & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Chat.d.ts.map