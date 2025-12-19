import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'mentor' | 'admin';
    profile: {
        avatar?: string;
        bio?: string;
        location?: string;
        timezone?: string;
        languages: string[];
    };
    studentProfile?: {
        gradeLevel: string;
        subjects: string[];
        learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
        availability: string[];
        goals: string[];
        preferredMentorExperience: 'beginner' | 'intermediate' | 'advanced';
    };
    mentorProfile?: {
        expertise: string[];
        teachingStyle: 'structured' | 'flexible' | 'interactive' | 'project-based';
        experienceYears: number;
        availability: string[];
        maxStudents: number;
        certifications: string[];
        hourlyRate?: number;
    };
    engagement: {
        currentStreak: number;
        longestStreak: number;
        lastActivity: Date;
        totalSessions: number;
        averageRating?: number;
    };
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map