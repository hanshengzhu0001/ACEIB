"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const User_1 = __importDefault(require("../models/User"));
const MentorStudentPairing_1 = __importDefault(require("../models/MentorStudentPairing"));
const Chat_1 = __importDefault(require("../models/Chat"));
const MediationTicket_1 = __importDefault(require("../models/MediationTicket"));
const logger_1 = require("./logger");
// Mock data for seeding the database
const seedDatabase = async () => {
    try {
        // Check if data already exists
        const userCount = await User_1.default.countDocuments();
        if (userCount > 0) {
            logger_1.logger.info('Database already has data, skipping seed');
            return;
        }
        logger_1.logger.info('Seeding database with mock data...');
        // Create admin user
        const admin = new User_1.default({
            email: 'admin@aceib-platform.demo',
            password: 'DemoAdmin2024!', // Will be hashed by pre-save hook
            firstName: 'Demo',
            lastName: 'Administrator',
            role: 'admin',
            profile: {
                bio: 'Platform administrator for demonstration purposes.',
                languages: ['English']
            },
            isActive: true,
            isVerified: true
        });
        await admin.save();
        // Create mentor users
        const mentors = await Promise.all([
            new User_1.default({
                email: 'mentor.demo1@aceib-platform.demo',
                password: 'DemoMentor2024!',
                firstName: 'Dr.',
                lastName: 'Smith',
                role: 'mentor',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                    bio: 'Experienced STEM educator with a passion for making complex concepts accessible.',
                    location: 'Demo City, DC',
                    timezone: 'America/New_York',
                    languages: ['English']
                },
                mentorProfile: {
                    expertise: ['Mathematics', 'Physics', 'General Science'],
                    teachingStyle: 'structured',
                    experienceYears: 8,
                    availability: ['monday-2pm', 'wednesday-2pm', 'friday-10am', 'saturday-9am'],
                    maxStudents: 4,
                    certifications: ['Teaching Certificate', 'STEM Education Specialist'],
                    hourlyRate: 45
                },
                engagement: {
                    currentStreak: 15,
                    longestStreak: 23,
                    lastActivity: new Date(),
                    totalSessions: 156,
                    averageRating: 4.8
                },
                isActive: true,
                isVerified: true
            }),
            new User_1.default({
                email: 'mentor.demo2@aceib-platform.demo',
                password: 'DemoMentor2024!',
                firstName: 'Prof.',
                lastName: 'Garcia',
                role: 'mentor',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                    bio: 'Technology educator focused on practical programming skills and problem-solving.',
                    location: 'Demo Valley, CA',
                    timezone: 'America/Los_Angeles',
                    languages: ['English', 'Spanish']
                },
                mentorProfile: {
                    expertise: ['Computer Science', 'Programming', 'Web Development'],
                    teachingStyle: 'project-based',
                    experienceYears: 10,
                    availability: ['tuesday-3pm', 'thursday-3pm', 'sunday-2pm'],
                    maxStudents: 3,
                    certifications: ['Computer Science Education', 'Full Stack Development'],
                    hourlyRate: 55
                },
                engagement: {
                    currentStreak: 8,
                    longestStreak: 18,
                    lastActivity: new Date(),
                    totalSessions: 89,
                    averageRating: 4.9
                },
                isActive: true,
                isVerified: true
            }),
            new User_1.default({
                email: 'mentor.demo3@aceib-platform.demo',
                password: 'DemoMentor2024!',
                firstName: 'Ms.',
                lastName: 'Johnson',
                role: 'mentor',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
                    bio: 'Language arts specialist dedicated to developing strong communication skills.',
                    location: 'Demo Town, TX',
                    timezone: 'America/Chicago',
                    languages: ['English']
                },
                mentorProfile: {
                    expertise: ['English', 'Writing', 'Literature', 'Communication'],
                    teachingStyle: 'interactive',
                    experienceYears: 6,
                    availability: ['monday-4pm', 'wednesday-4pm', 'saturday-11am'],
                    maxStudents: 5,
                    certifications: ['English Education', 'Writing Instruction'],
                    hourlyRate: 40
                },
                engagement: {
                    currentStreak: 22,
                    longestStreak: 31,
                    lastActivity: new Date(),
                    totalSessions: 203,
                    averageRating: 4.7
                },
                isActive: true,
                isVerified: true
            })
        ].map(user => user.save()));
        // Create student users
        const students = await Promise.all([
            new User_1.default({
                email: 'student.demo1@aceib-platform.demo',
                password: 'DemoStudent2024!',
                firstName: 'Jamie',
                lastName: 'Demo',
                role: 'student',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
                    bio: 'High school student passionate about STEM subjects and future engineering.',
                    location: 'Demo City, DC',
                    timezone: 'America/New_York',
                    languages: ['English']
                },
                studentProfile: {
                    gradeLevel: 'high-school',
                    subjects: ['Mathematics', 'Physics', 'Computer Science'],
                    learningStyle: 'visual',
                    availability: ['monday-3pm', 'tuesday-3pm', 'thursday-3pm', 'saturday-10am'],
                    goals: ['Improve calculus skills', 'Learn programming basics', 'College preparation'],
                    preferredMentorExperience: 'intermediate'
                },
                engagement: {
                    currentStreak: 5,
                    longestStreak: 12,
                    lastActivity: new Date(),
                    totalSessions: 23
                },
                isActive: true,
                isVerified: true
            }),
            new User_1.default({
                email: 'student.demo2@aceib-platform.demo',
                password: 'DemoStudent2024!',
                firstName: 'Taylor',
                lastName: 'Sample',
                role: 'student',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
                    bio: 'College student studying science with a focus on laboratory research.',
                    location: 'Demo Valley, CA',
                    timezone: 'America/Los_Angeles',
                    languages: ['English']
                },
                studentProfile: {
                    gradeLevel: 'college',
                    subjects: ['Chemistry', 'Biology', 'Mathematics'],
                    learningStyle: 'kinesthetic',
                    availability: ['tuesday-2pm', 'wednesday-2pm', 'friday-1pm', 'sunday-3pm'],
                    goals: ['Master laboratory techniques', 'Improve research skills', 'Academic excellence'],
                    preferredMentorExperience: 'advanced'
                },
                engagement: {
                    currentStreak: 3,
                    longestStreak: 8,
                    lastActivity: new Date(),
                    totalSessions: 15
                },
                isActive: true,
                isVerified: true
            }),
            new User_1.default({
                email: 'student.demo3@aceib-platform.demo',
                password: 'DemoStudent2024!',
                firstName: 'Morgan',
                lastName: 'Test',
                role: 'student',
                profile: {
                    avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
                    bio: 'Middle school student with a curiosity for science and technology.',
                    location: 'Demo Town, TX',
                    timezone: 'America/Chicago',
                    languages: ['English']
                },
                studentProfile: {
                    gradeLevel: 'middle-school',
                    subjects: ['Science', 'Mathematics', 'Technology'],
                    learningStyle: 'auditory',
                    availability: ['monday-4pm', 'tuesday-4pm', 'thursday-4pm', 'saturday-11am'],
                    goals: ['Learn basic programming', 'Science experiments', 'STEM exploration'],
                    preferredMentorExperience: 'beginner'
                },
                engagement: {
                    currentStreak: 7,
                    longestStreak: 14,
                    lastActivity: new Date(),
                    totalSessions: 31
                },
                isActive: true,
                isVerified: true
            })
        ].map(user => user.save()));
        // Create pairings
        const pairings = await Promise.all([
            new MentorStudentPairing_1.default({
                mentor: mentors[0]._id, // Sarah Johnson
                student: students[0]._id, // Alex Thompson
                status: 'active',
                compatibilityScore: 85,
                matchingCriteria: {
                    subjectMatch: 90,
                    teachingStyleMatch: 80,
                    availabilityMatch: 85,
                    experienceLevelMatch: 85,
                    weights: {
                        subjectWeight: 0.3,
                        teachingStyleWeight: 0.25,
                        availabilityWeight: 0.25,
                        experienceLevelWeight: 0.2
                    }
                },
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                sessionCount: 8,
                totalHours: 24,
                communicationPrefs: {
                    preferredPlatform: 'chat',
                    frequency: 'weekly',
                    duration: 60,
                    timezone: 'America/New_York'
                },
                goals: [
                    {
                        description: 'Improve calculus understanding',
                        status: 'in-progress',
                        progress: 65
                    },
                    {
                        description: 'Learn basic programming concepts',
                        status: 'completed',
                        progress: 100,
                        completedDate: new Date()
                    }
                ]
            }),
            new MentorStudentPairing_1.default({
                mentor: mentors[1]._id, // Michael Chen
                student: students[1]._id, // Maya Patel
                status: 'active',
                compatibilityScore: 92,
                matchingCriteria: {
                    subjectMatch: 95,
                    teachingStyleMatch: 90,
                    availabilityMatch: 90,
                    experienceLevelMatch: 95,
                    weights: {
                        subjectWeight: 0.3,
                        teachingStyleWeight: 0.25,
                        availabilityWeight: 0.25,
                        experienceLevelWeight: 0.2
                    }
                },
                startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                sessionCount: 5,
                totalHours: 15,
                communicationPrefs: {
                    preferredPlatform: 'video',
                    frequency: 'bi-weekly',
                    duration: 90,
                    timezone: 'America/Chicago'
                },
                goals: [
                    {
                        description: 'Master organic chemistry mechanisms',
                        status: 'in-progress',
                        progress: 40
                    }
                ]
            }),
            new MentorStudentPairing_1.default({
                mentor: mentors[2]._id, // Emily Rodriguez
                student: students[2]._id, // Jordan Williams
                status: 'pending',
                compatibilityScore: 78,
                matchingCriteria: {
                    subjectMatch: 75,
                    teachingStyleMatch: 85,
                    availabilityMatch: 80,
                    experienceLevelMatch: 70,
                    weights: {
                        subjectWeight: 0.3,
                        teachingStyleWeight: 0.25,
                        availabilityWeight: 0.25,
                        experienceLevelWeight: 0.2
                    }
                },
                startDate: new Date(),
                communicationPrefs: {
                    preferredPlatform: 'chat',
                    frequency: 'weekly',
                    duration: 45,
                    timezone: 'America/Los_Angeles'
                }
            })
        ].map(pairing => pairing.save()));
        // Create chat rooms and messages
        const chats = await Promise.all([
            new Chat_1.default({
                roomId: `pairing-${pairings[0]._id}`,
                participants: [mentors[0]._id, students[0]._id],
                pairingId: pairings[0]._id,
                messages: [
                    {
                        sender: mentors[0]._id,
                        content: 'Hi Alex! I\'m excited to help you with your calculus and programming goals. How are you finding the material so far?',
                        messageType: 'text',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                        readBy: [mentors[0]._id, students[0]._id]
                    },
                    {
                        sender: students[0]._id,
                        content: 'Hi Ms. Johnson! I\'m struggling a bit with derivatives. Could we focus on that this week?',
                        messageType: 'text',
                        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
                        readBy: [mentors[0]._id, students[0]._id]
                    },
                    {
                        sender: mentors[0]._id,
                        content: 'Absolutely! Let\'s schedule our next session for Thursday at 3 PM. I\'ll prepare some derivative practice problems.',
                        messageType: 'text',
                        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                        readBy: [mentors[0]._id, students[0]._id]
                    }
                ]
            }),
            new Chat_1.default({
                roomId: `pairing-${pairings[1]._id}`,
                participants: [mentors[1]._id, students[1]._id],
                pairingId: pairings[1]._id,
                messages: [
                    {
                        sender: students[1]._id,
                        content: 'Dr. Chen, I\'m having trouble understanding SN1 vs SN2 reactions. Could you explain the difference?',
                        messageType: 'text',
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                        readBy: [mentors[1]._id, students[1]._id]
                    },
                    {
                        sender: mentors[1]._id,
                        content: 'Great question! SN1 reactions are unimolecular and typically occur with tertiary substrates, while SN2 are bimolecular and work best with primary substrates. Let me send you a diagram.',
                        messageType: 'text',
                        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
                        readBy: [mentors[1]._id, students[1]._id]
                    }
                ]
            })
        ].map(chat => chat.save()));
        // Create mediation tickets
        const mediationTickets = await Promise.all([
            new MediationTicket_1.default({
                ticketNumber: 'MED-20241218-001',
                issueType: 'schedule',
                title: 'Mentor unavailable for scheduled session',
                description: 'Student Alex reported that mentor Sarah was unable to attend the scheduled session due to a family emergency. Requesting to reschedule.',
                status: 'resolved',
                priority: 'medium',
                reporter: students[0]._id,
                reported: mentors[0]._id,
                assignedTo: admin._id,
                relatedPairing: pairings[0]._id,
                resolution: {
                    resolvedBy: admin._id,
                    resolution: 'Session rescheduled for next week. Mentor confirmed availability.',
                    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    satisfactionRating: 5,
                    feedback: 'Issue resolved quickly and professionally.'
                },
                tags: ['scheduling', 'rescheduling'],
                statusHistory: [
                    {
                        status: 'open',
                        changedBy: students[0]._id,
                        note: 'Ticket created'
                    },
                    {
                        status: 'in-review',
                        changedBy: admin._id,
                        note: 'Assigned for review'
                    },
                    {
                        status: 'resolved',
                        changedBy: admin._id,
                        note: 'Resolution provided'
                    }
                ]
            }),
            new MediationTicket_1.default({
                ticketNumber: 'MED-20241218-002',
                issueType: 'communication',
                title: 'Misunderstanding about assignment expectations',
                description: 'There seems to be a misunderstanding between mentor and student regarding the complexity of weekly assignments.',
                status: 'open',
                priority: 'low',
                reporter: students[1]._id,
                reported: mentors[1]._id,
                relatedPairing: pairings[1]._id,
                tags: ['communication', 'assignments'],
                statusHistory: [
                    {
                        status: 'open',
                        changedBy: students[1]._id,
                        note: 'Ticket created'
                    }
                ]
            })
        ].map(ticket => ticket.save()));
        logger_1.logger.info('✅ Database seeded successfully with mock data');
        logger_1.logger.info(`Created: ${mentors.length} mentors, ${students.length} students, ${pairings.length} pairings, ${chats.length} chats, ${mediationTickets.length} mediation tickets`);
    }
    catch (error) {
        logger_1.logger.error('❌ Error seeding database:', error);
        throw error;
    }
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seedData.js.map