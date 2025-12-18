import mongoose from 'mongoose';
import User from '../models/User';
import MentorStudentPairing from '../models/MentorStudentPairing';
import Chat from '../models/Chat';
import MediationTicket from '../models/MediationTicket';
import { logger } from './logger';

// Mock data for seeding the database
export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      logger.info('Database already has data, skipping seed');
      return;
    }

    logger.info('Seeding database with mock data...');

    // Create admin user
    const admin = new User({
      email: 'admin@aceib.com',
      password: 'admin123', // Will be hashed by pre-save hook
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      profile: {
        bio: 'Platform administrator managing the ACEIB educational ecosystem.',
        languages: ['English']
      },
      isActive: true,
      isVerified: true
    });
    await admin.save();

    // Create mentor users
    const mentors = await Promise.all([
      new User({
        email: 'sarah.johnson@aceib.com',
        password: 'mentor123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          bio: 'Experienced math and science tutor with 8 years of teaching experience.',
          location: 'New York, NY',
          timezone: 'America/New_York',
          languages: ['English', 'Spanish']
        },
        mentorProfile: {
          expertise: ['Mathematics', 'Physics', 'Chemistry'],
          teachingStyle: 'structured',
          experienceYears: 8,
          availability: ['monday-2pm', 'wednesday-2pm', 'friday-10am', 'saturday-9am'],
          maxStudents: 4,
          certifications: ['Certified Math Teacher', 'Physics Education Degree'],
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
      new User({
        email: 'michael.chen@aceib.com',
        password: 'mentor123',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          bio: 'Computer science professor passionate about coding education.',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          languages: ['English', 'Mandarin']
        },
        mentorProfile: {
          expertise: ['Computer Science', 'Python', 'JavaScript', 'Web Development'],
          teachingStyle: 'project-based',
          experienceYears: 12,
          availability: ['tuesday-3pm', 'thursday-3pm', 'sunday-2pm'],
          maxStudents: 3,
          certifications: ['PhD Computer Science', 'AWS Certified'],
          hourlyRate: 60
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
      new User({
        email: 'emily.rodriguez@aceib.com',
        password: 'mentor123',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
          bio: 'Literature and writing mentor helping students discover their voice.',
          location: 'Austin, TX',
          timezone: 'America/Chicago',
          languages: ['English', 'French']
        },
        mentorProfile: {
          expertise: ['English Literature', 'Creative Writing', 'Essay Writing', 'Public Speaking'],
          teachingStyle: 'interactive',
          experienceYears: 6,
          availability: ['monday-4pm', 'wednesday-4pm', 'saturday-11am'],
          maxStudents: 5,
          certifications: ['MFA Creative Writing', 'Teaching Certificate'],
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
      new User({
        email: 'alex.thompson@aceib.com',
        password: 'student123',
        firstName: 'Alex',
        lastName: 'Thompson',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
          bio: 'High school senior preparing for college applications and interested in STEM.',
          location: 'Boston, MA',
          timezone: 'America/New_York',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'high-school',
          subjects: ['Mathematics', 'Physics', 'Computer Science'],
          learningStyle: 'visual',
          availability: ['monday-3pm', 'tuesday-3pm', 'thursday-3pm', 'saturday-10am'],
          goals: ['Improve math grades', 'Learn programming', 'College preparation'],
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
      new User({
        email: 'maya.patel@aceib.com',
        password: 'student123',
        firstName: 'Maya',
        lastName: 'Patel',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
          bio: 'College freshman majoring in biology, seeking help with organic chemistry.',
          location: 'Chicago, IL',
          timezone: 'America/Chicago',
          languages: ['English', 'Hindi']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Chemistry', 'Biology', 'Mathematics'],
          learningStyle: 'kinesthetic',
          availability: ['tuesday-2pm', 'wednesday-2pm', 'friday-1pm', 'sunday-3pm'],
          goals: ['Master organic chemistry', 'Improve study techniques', 'Research opportunities'],
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
      new User({
        email: 'jordan.williams@aceib.com',
        password: 'student123',
        firstName: 'Jordan',
        lastName: 'Williams',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
          bio: 'Middle school student who loves science and wants to become an engineer.',
          location: 'Seattle, WA',
          timezone: 'America/Los_Angeles',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'middle-school',
          subjects: ['Science', 'Mathematics', 'Computer Science'],
          learningStyle: 'auditory',
          availability: ['monday-4pm', 'tuesday-4pm', 'thursday-4pm', 'saturday-11am'],
          goals: ['Learn coding basics', 'Science fair project', 'Math competition prep'],
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
      new MentorStudentPairing({
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
      new MentorStudentPairing({
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
      new MentorStudentPairing({
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
      new Chat({
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
      new Chat({
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
      new MediationTicket({
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
      new MediationTicket({
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

    logger.info('✅ Database seeded successfully with mock data');
    logger.info(`Created: ${mentors.length} mentors, ${students.length} students, ${pairings.length} pairings, ${chats.length} chats, ${mediationTickets.length} mediation tickets`);

  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  }
};
