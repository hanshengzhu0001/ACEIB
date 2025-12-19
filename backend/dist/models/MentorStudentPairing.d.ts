import mongoose, { Document } from 'mongoose';
export interface IMentorStudentPairing extends Document {
    _id: mongoose.Types.ObjectId;
    mentor: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    status: 'pending' | 'active' | 'paused' | 'completed' | 'terminated';
    compatibilityScore: number;
    matchingCriteria: {
        subjectMatch: number;
        teachingStyleMatch: number;
        availabilityMatch: number;
        experienceLevelMatch: number;
        locationMatch?: number;
        weights: {
            subjectWeight: number;
            teachingStyleWeight: number;
            availabilityWeight: number;
            experienceLevelWeight: number;
            locationWeight?: number;
        };
    };
    startDate: Date;
    endDate?: Date;
    sessionCount: number;
    totalHours: number;
    ratings: Array<{
        ratedBy: mongoose.Types.ObjectId;
        rating: number;
        feedback: string;
        ratedAt: Date;
        sessionNumber: number;
    }>;
    goals: Array<{
        description: string;
        status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
        targetDate?: Date;
        completedDate?: Date;
        progress: number;
    }>;
    communicationPrefs: {
        preferredPlatform: 'chat' | 'video' | 'phone' | 'in-person';
        frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
        duration: number;
        timezone: string;
    };
    adminNotes: Array<{
        note: string;
        createdBy: mongoose.Types.ObjectId;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMentorStudentPairing, {}, {}, {}, mongoose.Document<unknown, {}, IMentorStudentPairing, {}, {}> & IMentorStudentPairing & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=MentorStudentPairing.d.ts.map