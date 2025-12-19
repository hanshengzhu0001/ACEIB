import mongoose from 'mongoose';
import User from '../models/User';
import MentorStudentPairing from '../models/MentorStudentPairing';
import Chat from '../models/Chat';
import MediationTicket from '../models/MediationTicket';
import Notification from '../models/Notification';
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
      // STEM Mentors
      new User({
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
      new User({
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
      new User({
        email: 'mentor.chemistry@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Chen',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Organic chemistry specialist with 12+ years in pharmaceutical research and teaching.',
          location: 'Boston, MA',
          timezone: 'America/New_York',
          languages: ['English', 'Mandarin']
        },
        mentorProfile: {
          expertise: ['Chemistry', 'Organic Chemistry', 'Biochemistry', 'Lab Techniques'],
          teachingStyle: 'hands-on',
          experienceYears: 12,
          availability: ['monday-10am', 'wednesday-10am', 'friday-2pm', 'saturday-1pm'],
          maxStudents: 3,
          certifications: ['Chemistry PhD', 'Lab Safety Instructor', 'Organic Chemistry Specialist'],
          hourlyRate: 65
        },
        engagement: {
          currentStreak: 25,
          longestStreak: 35,
          lastActivity: new Date(),
          totalSessions: 287,
          averageRating: 4.9
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.physics@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Williams',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
          bio: 'Theoretical physicist passionate about quantum mechanics and relativity. Former NASA researcher.',
          location: 'Houston, TX',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Physics', 'Quantum Physics', 'Thermodynamics', 'Electromagnetism'],
          teachingStyle: 'conceptual',
          experienceYears: 15,
          availability: ['tuesday-9am', 'thursday-9am', 'friday-3pm'],
          maxStudents: 2,
          certifications: ['Physics PhD', 'NASA Research Fellow', 'Quantum Physics Specialist'],
          hourlyRate: 70
        },
        engagement: {
          currentStreak: 12,
          longestStreak: 28,
          lastActivity: new Date(),
          totalSessions: 198,
          averageRating: 4.8
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.biology@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Rodriguez',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
          bio: 'Molecular biologist with expertise in genetics and cell biology. Loves making science accessible.',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          languages: ['English', 'Spanish']
        },
        mentorProfile: {
          expertise: ['Biology', 'Genetics', 'Cell Biology', 'Molecular Biology'],
          teachingStyle: 'visual',
          experienceYears: 9,
          availability: ['monday-1pm', 'wednesday-1pm', 'thursday-4pm', 'sunday-10am'],
          maxStudents: 4,
          certifications: ['Biology PhD', 'Genetics Research', 'Science Education Certificate'],
          hourlyRate: 50
        },
        engagement: {
          currentStreak: 18,
          longestStreak: 24,
          lastActivity: new Date(),
          totalSessions: 167,
          averageRating: 4.7
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.compsci@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Mr.',
        lastName: 'Kim',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
          bio: 'Software engineer at Google with 8 years experience. Specializes in algorithms and system design.',
          location: 'Seattle, WA',
          timezone: 'America/Los_Angeles',
          languages: ['English', 'Korean']
        },
        mentorProfile: {
          expertise: ['Computer Science', 'Algorithms', 'Data Structures', 'System Design'],
          teachingStyle: 'problem-solving',
          experienceYears: 8,
          availability: ['tuesday-6pm', 'wednesday-6pm', 'saturday-2pm'],
          maxStudents: 3,
          certifications: ['Computer Science BS', 'Google Software Engineer', 'Algorithm Specialist'],
          hourlyRate: 60
        },
        engagement: {
          currentStreak: 20,
          longestStreak: 30,
          lastActivity: new Date(),
          totalSessions: 145,
          averageRating: 4.9
        },
        isActive: true,
        isVerified: true
      }),

      // Humanities & Languages
      new User({
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
      }),
      new User({
        email: 'mentor.history@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Prof.',
        lastName: 'Thompson',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
          bio: 'History professor with focus on critical thinking and research skills. Former museum curator.',
          location: 'Philadelphia, PA',
          timezone: 'America/New_York',
          languages: ['English', 'French']
        },
        mentorProfile: {
          expertise: ['History', 'Research Methods', 'Critical Thinking', 'Essay Writing'],
          teachingStyle: 'discussion-based',
          experienceYears: 14,
          availability: ['tuesday-11am', 'thursday-11am', 'friday-1pm'],
          maxStudents: 4,
          certifications: ['History PhD', 'Research Methodology', 'Teaching Excellence'],
          hourlyRate: 45
        },
        engagement: {
          currentStreak: 16,
          longestStreak: 22,
          lastActivity: new Date(),
          totalSessions: 189,
          averageRating: 4.6
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.spanish@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Señora',
        lastName: 'Martinez',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
          bio: 'Native Spanish speaker from Madrid. Experienced in teaching Spanish to all levels.',
          location: 'Miami, FL',
          timezone: 'America/New_York',
          languages: ['Spanish', 'English']
        },
        mentorProfile: {
          expertise: ['Spanish', 'Spanish Literature', 'Spanish Culture', 'Conversation'],
          teachingStyle: 'immersive',
          experienceYears: 7,
          availability: ['monday-5pm', 'tuesday-5pm', 'wednesday-5pm', 'saturday-10am'],
          maxStudents: 6,
          certifications: ['Spanish Teaching Certificate', 'DELE Examiner', 'Cultural Studies'],
          hourlyRate: 35
        },
        engagement: {
          currentStreak: 28,
          longestStreak: 35,
          lastActivity: new Date(),
          totalSessions: 245,
          averageRating: 4.8
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.french@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Madame',
        lastName: 'Dubois',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
          bio: 'French native speaker with extensive experience teaching French language and culture.',
          location: 'New Orleans, LA',
          timezone: 'America/Chicago',
          languages: ['French', 'English']
        },
        mentorProfile: {
          expertise: ['French', 'French Literature', 'French Culture', 'Business French'],
          teachingStyle: 'cultural-immersion',
          experienceYears: 11,
          availability: ['tuesday-4pm', 'thursday-4pm', 'sunday-11am'],
          maxStudents: 4,
          certifications: ['French Teaching Diploma', 'Cultural Studies', 'Business French'],
          hourlyRate: 42
        },
        engagement: {
          currentStreak: 14,
          longestStreak: 26,
          lastActivity: new Date(),
          totalSessions: 178,
          averageRating: 4.7
        },
        isActive: true,
        isVerified: true
      }),

      // Social Sciences & Arts
      new User({
        email: 'mentor.psychology@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Anderson',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/34.jpg',
          bio: 'Clinical psychologist and researcher specializing in developmental psychology and mental health.',
          location: 'Portland, OR',
          timezone: 'America/Los_Angeles',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Psychology', 'Research Methods', 'Statistics', 'Mental Health'],
          teachingStyle: 'analytical',
          experienceYears: 13,
          availability: ['monday-11am', 'wednesday-11am', 'friday-9am'],
          maxStudents: 3,
          certifications: ['Psychology PhD', 'Clinical License', 'Research Methodology'],
          hourlyRate: 55
        },
        engagement: {
          currentStreak: 19,
          longestStreak: 27,
          lastActivity: new Date(),
          totalSessions: 201,
          averageRating: 4.8
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.economics@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Prof.',
        lastName: 'Lee',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
          bio: 'Economist and former Wall Street analyst. Expert in macro/micro economics and finance.',
          location: 'New York, NY',
          timezone: 'America/New_York',
          languages: ['English', 'Korean']
        },
        mentorProfile: {
          expertise: ['Economics', 'Finance', 'Statistics', 'Business'],
          teachingStyle: 'case-study',
          experienceYears: 16,
          availability: ['tuesday-2pm', 'thursday-2pm', 'friday-11am'],
          maxStudents: 3,
          certifications: ['Economics PhD', 'CFA Charterholder', 'Financial Analysis'],
          hourlyRate: 75
        },
        engagement: {
          currentStreak: 11,
          longestStreak: 19,
          lastActivity: new Date(),
          totalSessions: 134,
          averageRating: 4.9
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.art@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Ms.',
        lastName: 'Davis',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
          bio: 'Professional artist and art historian. Specializes in visual arts and art appreciation.',
          location: 'Chicago, IL',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Art History', 'Drawing', 'Painting', 'Art Appreciation'],
          teachingStyle: 'creative',
          experienceYears: 10,
          availability: ['monday-3pm', 'wednesday-3pm', 'saturday-12pm'],
          maxStudents: 4,
          certifications: ['Art History MA', 'Professional Artist', 'Teaching Artist'],
          hourlyRate: 48
        },
        engagement: {
          currentStreak: 23,
          longestStreak: 32,
          lastActivity: new Date(),
          totalSessions: 223,
          averageRating: 4.6
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.music@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Mr.',
        lastName: 'Wilson',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
          bio: 'Professional musician and composer. Experienced in music theory and performance.',
          location: 'Nashville, TN',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Music Theory', 'Composition', 'Piano', 'Music History'],
          teachingStyle: 'performance-based',
          experienceYears: 12,
          availability: ['tuesday-12pm', 'thursday-12pm', 'sunday-1pm'],
          maxStudents: 3,
          certifications: ['Music Composition MA', 'Piano Performance', 'Music Education'],
          hourlyRate: 52
        },
        engagement: {
          currentStreak: 17,
          longestStreak: 25,
          lastActivity: new Date(),
          totalSessions: 156,
          averageRating: 4.7
        },
        isActive: true,
        isVerified: true
      }),

      // Additional STEM & Specialties
      new User({
        email: 'mentor.statistics@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Brown',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
          bio: 'Data scientist and statistician. Expert in statistical analysis and probability theory.',
          location: 'Austin, TX',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Statistics', 'Data Analysis', 'Probability', 'R Programming'],
          teachingStyle: 'analytical',
          experienceYears: 9,
          availability: ['monday-9am', 'wednesday-9am', 'friday-4pm'],
          maxStudents: 3,
          certifications: ['Statistics PhD', 'Data Science Certificate', 'R Programming'],
          hourlyRate: 58
        },
        engagement: {
          currentStreak: 21,
          longestStreak: 29,
          lastActivity: new Date(),
          totalSessions: 178,
          averageRating: 4.8
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.engineering@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Taylor',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/40.jpg',
          bio: 'Mechanical engineer with expertise in design, thermodynamics, and materials science.',
          location: 'Detroit, MI',
          timezone: 'America/New_York',
          languages: ['English']
        },
        mentorProfile: {
          expertise: ['Engineering', 'Thermodynamics', 'Materials Science', 'CAD'],
          teachingStyle: 'practical',
          experienceYears: 11,
          availability: ['tuesday-10am', 'thursday-10am', 'saturday-10am'],
          maxStudents: 3,
          certifications: ['Mechanical Engineering PhD', 'PE License', 'CAD Certification'],
          hourlyRate: 62
        },
        engagement: {
          currentStreak: 13,
          longestStreak: 21,
          lastActivity: new Date(),
          totalSessions: 145,
          averageRating: 4.7
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.webdev@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Ms.',
        lastName: 'Zhang',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
          bio: 'Full-stack web developer at a Fortune 500 company. Specializes in modern web technologies.',
          location: 'San Jose, CA',
          timezone: 'America/Los_Angeles',
          languages: ['English', 'Mandarin']
        },
        mentorProfile: {
          expertise: ['Web Development', 'JavaScript', 'React', 'Node.js'],
          teachingStyle: 'project-based',
          experienceYears: 6,
          availability: ['monday-6pm', 'wednesday-6pm', 'sunday-3pm'],
          maxStudents: 4,
          certifications: ['Full Stack Development', 'React Specialist', 'Node.js Expert'],
          hourlyRate: 55
        },
        engagement: {
          currentStreak: 24,
          longestStreak: 33,
          lastActivity: new Date(),
          totalSessions: 189,
          averageRating: 4.9
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'mentor.datascience@aceib-platform.demo',
        password: 'DemoMentor2024!',
        firstName: 'Dr.',
        lastName: 'Patel',
        role: 'mentor',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          bio: 'Data scientist with PhD in Machine Learning. Expert in Python, ML algorithms, and big data.',
          location: 'Palo Alto, CA',
          timezone: 'America/Los_Angeles',
          languages: ['English', 'Hindi']
        },
        mentorProfile: {
          expertise: ['Data Science', 'Machine Learning', 'Python', 'Statistics'],
          teachingStyle: 'algorithm-focused',
          experienceYears: 8,
          availability: ['tuesday-1pm', 'thursday-1pm', 'saturday-11am'],
          maxStudents: 2,
          certifications: ['Data Science PhD', 'Machine Learning Specialist', 'Python Expert'],
          hourlyRate: 68
        },
        engagement: {
          currentStreak: 16,
          longestStreak: 24,
          lastActivity: new Date(),
          totalSessions: 167,
          averageRating: 4.9
        },
        isActive: true,
        isVerified: true
      })
    ].map(user => user.save()));

    // Create student users
    const students = await Promise.all([
      // Existing students
      new User({
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
      new User({
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
      new User({
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
      }),

      // Additional STEM-focused students
      new User({
        email: 'student.physics@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Alex',
        lastName: 'Rivera',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
          bio: 'College physics major fascinated by quantum mechanics and astrophysics.',
          location: 'Houston, TX',
          timezone: 'America/Chicago',
          languages: ['English', 'Spanish']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Physics', 'Mathematics', 'Astronomy'],
          learningStyle: 'visual',
          availability: ['monday-9am', 'wednesday-9am', 'friday-9am', 'saturday-2pm'],
          goals: ['Master quantum physics', 'Improve mathematical modeling', 'Research experience'],
          preferredMentorExperience: 'advanced'
        },
        engagement: {
          currentStreak: 4,
          longestStreak: 9,
          lastActivity: new Date(),
          totalSessions: 18
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.chemistry@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Sofia',
        lastName: 'Chen',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
          bio: 'High school senior aspiring to be a pharmacist. Loves organic chemistry.',
          location: 'Boston, MA',
          timezone: 'America/New_York',
          languages: ['English', 'Mandarin']
        },
        studentProfile: {
          gradeLevel: 'high-school',
          subjects: ['Chemistry', 'Biology', 'Mathematics'],
          learningStyle: 'kinesthetic',
          availability: ['tuesday-3pm', 'thursday-3pm', 'friday-2pm', 'sunday-1pm'],
          goals: ['Excel in organic chemistry', 'Prepare for pharmacy school', 'Research opportunities'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 6,
          longestStreak: 11,
          lastActivity: new Date(),
          totalSessions: 27
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.compsci@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Marcus',
        lastName: 'Johnson',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
          bio: 'Self-taught programmer looking to formalize skills and learn advanced concepts.',
          location: 'Seattle, WA',
          timezone: 'America/Los_Angeles',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Computer Science', 'Mathematics', 'Web Development'],
          learningStyle: 'problem-solving',
          availability: ['monday-6pm', 'tuesday-6pm', 'wednesday-6pm', 'saturday-3pm'],
          goals: ['Master algorithms', 'Learn data structures', 'Build portfolio projects'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 8,
          longestStreak: 15,
          lastActivity: new Date(),
          totalSessions: 34
        },
        isActive: true,
        isVerified: true
      }),

      // Humanities and Languages students
      new User({
        email: 'student.spanish@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Isabella',
        lastName: 'Garcia',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
          bio: 'Bilingual student wanting to improve Spanish fluency for family and career.',
          location: 'Miami, FL',
          timezone: 'America/New_York',
          languages: ['English', 'Spanish']
        },
        studentProfile: {
          gradeLevel: 'high-school',
          subjects: ['Spanish', 'Spanish Literature', 'Spanish Culture'],
          learningStyle: 'immersive',
          availability: ['monday-5pm', 'tuesday-5pm', 'wednesday-5pm', 'saturday-10am'],
          goals: ['Improve conversation skills', 'Learn business Spanish', 'Cultural understanding'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 9,
          longestStreak: 16,
          lastActivity: new Date(),
          totalSessions: 38
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.history@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Daniel',
        lastName: 'Thompson',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
          bio: 'History buff and aspiring teacher. Interested in research methods and critical analysis.',
          location: 'Philadelphia, PA',
          timezone: 'America/New_York',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['History', 'Research Methods', 'Writing'],
          learningStyle: 'discussion-based',
          availability: ['tuesday-11am', 'thursday-11am', 'friday-1pm'],
          goals: ['Develop research skills', 'Improve essay writing', 'Critical thinking'],
          preferredMentorExperience: 'advanced'
        },
        engagement: {
          currentStreak: 5,
          longestStreak: 10,
          lastActivity: new Date(),
          totalSessions: 22
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.english@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Emma',
        lastName: 'Williams',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
          bio: 'Creative writer working on improving literary analysis and composition skills.',
          location: 'Chicago, IL',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['English', 'Writing', 'Literature'],
          learningStyle: 'creative',
          availability: ['monday-2pm', 'wednesday-2pm', 'friday-2pm', 'sunday-2pm'],
          goals: ['Improve creative writing', 'Literary analysis', 'Academic writing'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 7,
          longestStreak: 13,
          lastActivity: new Date(),
          totalSessions: 29
        },
        isActive: true,
        isVerified: true
      }),

      // Social Sciences and Arts students
      new User({
        email: 'student.psychology@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Olivia',
        lastName: 'Anderson',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/56.jpg',
          bio: 'Psychology major interested in developmental and clinical psychology research.',
          location: 'Portland, OR',
          timezone: 'America/Los_Angeles',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Psychology', 'Research Methods', 'Statistics'],
          learningStyle: 'analytical',
          availability: ['monday-11am', 'wednesday-11am', 'friday-11am'],
          goals: ['Research methodology', 'Statistical analysis', 'Academic writing'],
          preferredMentorExperience: 'advanced'
        },
        engagement: {
          currentStreak: 4,
          longestStreak: 9,
          lastActivity: new Date(),
          totalSessions: 19
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.economics@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'James',
        lastName: 'Lee',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
          bio: 'Business economics student preparing for finance career and CFA exams.',
          location: 'New York, NY',
          timezone: 'America/New_York',
          languages: ['English', 'Korean']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Economics', 'Finance', 'Mathematics'],
          learningStyle: 'case-study',
          availability: ['tuesday-2pm', 'thursday-2pm', 'saturday-11am'],
          goals: ['Macro/micro economics', 'Financial analysis', 'Investment strategies'],
          preferredMentorExperience: 'advanced'
        },
        engagement: {
          currentStreak: 6,
          longestStreak: 12,
          lastActivity: new Date(),
          totalSessions: 26
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.art@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Maya',
        lastName: 'Davis',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
          bio: 'Art student exploring various mediums and building a portfolio for art school.',
          location: 'Los Angeles, CA',
          timezone: 'America/Los_Angeles',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'high-school',
          subjects: ['Art History', 'Drawing', 'Painting'],
          learningStyle: 'creative',
          availability: ['monday-3pm', 'wednesday-3pm', 'saturday-12pm'],
          goals: ['Portfolio development', 'Art techniques', 'Art history knowledge'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 8,
          longestStreak: 15,
          lastActivity: new Date(),
          totalSessions: 33
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.music@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Lucas',
        lastName: 'Wilson',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
          bio: 'Music theory student and aspiring composer. Plays piano and guitar.',
          location: 'Nashville, TN',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'college',
          subjects: ['Music Theory', 'Composition', 'Piano'],
          learningStyle: 'performance-based',
          availability: ['tuesday-12pm', 'thursday-12pm', 'sunday-1pm'],
          goals: ['Composition techniques', 'Music theory', 'Performance skills'],
          preferredMentorExperience: 'intermediate'
        },
        engagement: {
          currentStreak: 5,
          longestStreak: 10,
          lastActivity: new Date(),
          totalSessions: 21
        },
        isActive: true,
        isVerified: true
      }),

      // Younger students
      new User({
        email: 'student.elementary@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Lily',
        lastName: 'Brown',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/girls/60.jpg',
          bio: 'Curious elementary student who loves science experiments and math puzzles.',
          location: 'Austin, TX',
          timezone: 'America/Chicago',
          languages: ['English']
        },
        studentProfile: {
          gradeLevel: 'elementary',
          subjects: ['Mathematics', 'Science', 'Reading'],
          learningStyle: 'hands-on',
          availability: ['monday-4pm', 'tuesday-4pm', 'thursday-4pm', 'saturday-11am'],
          goals: ['Fun with math', 'Science experiments', 'Reading improvement'],
          preferredMentorExperience: 'beginner'
        },
        engagement: {
          currentStreak: 10,
          longestStreak: 18,
          lastActivity: new Date(),
          totalSessions: 42
        },
        isActive: true,
        isVerified: true
      }),
      new User({
        email: 'student.french@aceib-platform.demo',
        password: 'DemoStudent2024!',
        firstName: 'Claire',
        lastName: 'Dubois',
        role: 'student',
        profile: {
          avatar: 'https://randomuser.me/api/portraits/women/61.jpg',
          bio: 'French exchange student improving English while helping others learn French.',
          location: 'New Orleans, LA',
          timezone: 'America/Chicago',
          languages: ['French', 'English']
        },
        studentProfile: {
          gradeLevel: 'high-school',
          subjects: ['French', 'English', 'French Culture'],
          learningStyle: 'cultural-immersion',
          availability: ['tuesday-4pm', 'thursday-4pm', 'sunday-11am'],
          goals: ['French conversation', 'Cultural exchange', 'Language teaching'],
          preferredMentorExperience: 'intermediate'
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

    // Create notifications for demonstration
    const notifications = await Promise.all([
      // Pairing notifications
      new Notification({
        recipient: students[0]._id, // Jamie Demo
        type: 'pairing_accepted',
        title: 'Mentor Pairing Confirmed',
        message: 'You have been paired with Dr. Smith. Start your learning journey!',
        data: { pairingId: pairings[0]._id, mentorId: mentors[0]._id },
        isRead: false
      }),
      new Notification({
        recipient: mentors[0]._id, // Dr. Smith
        type: 'pairing_request',
        title: 'New Student Pairing',
        message: 'Jamie Demo has been paired with you for Mathematics and Physics tutoring.',
        data: { pairingId: pairings[0]._id, studentId: students[0]._id },
        isRead: false
      }),
      new Notification({
        recipient: students[1]._id, // Taylor Sample
        type: 'session_scheduled',
        title: 'Session Scheduled',
        message: 'Your chemistry session with Prof. Garcia is scheduled for tomorrow at 2:00 PM.',
        data: { pairingId: pairings[1]._id, sessionTime: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        isRead: false
      }),
      new Notification({
        recipient: mentors[2]._id, // Dr. Chen (Chemistry)
        type: 'pairing_accepted',
        title: 'New Student Pairing',
        message: 'Sofia Chen has been paired with you for Chemistry tutoring.',
        data: { pairingId: pairings[2]._id, studentId: students[4]._id },
        isRead: true
      }),
      new Notification({
        recipient: students[4]._id, // Sofia Chen
        type: 'pairing_accepted',
        title: 'Mentor Pairing Confirmed',
        message: 'Welcome! You have been paired with Dr. Chen for Chemistry tutoring.',
        data: { pairingId: pairings[2]._id, mentorId: mentors[2]._id },
        isRead: true
      }),
      new Notification({
        recipient: mentors[3]._id, // Dr. Williams (Physics)
        type: 'message_received',
        title: 'New Message',
        message: 'Alex Rivera sent you a message about quantum physics homework.',
        data: { chatId: `pairing-${pairings[3]._id}`, senderId: students[3]._id },
        isRead: false
      }),
      new Notification({
        recipient: students[5]._id, // Marcus Johnson
        type: 'system',
        title: 'Welcome to ACEIB!',
        message: 'Thanks for joining! Complete your profile to get matched with the best mentors.',
        data: {},
        isRead: true
      }),
      new Notification({
        recipient: mentors[1]._id, // Prof. Garcia
        type: 'session_completed',
        title: 'Session Completed',
        message: 'Your session with Taylor Sample has been marked as complete.',
        data: { pairingId: pairings[1]._id, sessionDuration: 90 },
        isRead: false
      }),
      new Notification({
        recipient: students[6]._id, // Isabella Garcia
        type: 'pairing_accepted',
        title: 'Spanish Mentor Found!',
        message: 'You have been paired with Señora Martinez for Spanish language learning.',
        data: { pairingId: pairings[4]._id, mentorId: mentors[7]._id },
        isRead: false
      }),
      new Notification({
        recipient: mentors[4]._id, // Dr. Rodriguez (Biology)
        type: 'pairing_terminated',
        title: 'Pairing Terminated',
        message: 'Your pairing with Emma Williams has been terminated.',
        data: { pairingId: pairings[5]._id, terminatedBy: students[8]._id, reason: 'Schedule conflict' },
        isRead: true
      })
    ].map(notification => notification.save()));

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
