import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import MentorStudentPairing from '../models/MentorStudentPairing';
import { logger } from '../utils/logger';

const router = express.Router();

// @route   POST /api/matching/generate
// @desc    Generate matching recommendations for a student
// @access  Private
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.role !== 'student') {
      return res.status(400).json({
        success: false,
        error: 'Only students can generate matches'
      });
    }

    if (!user.studentProfile) {
      return res.status(400).json({
        success: false,
        error: 'Please complete your student profile first'
      });
    }

    // Find potential mentors
    const mentors = await User.find({
      role: 'mentor',
      isActive: true,
      mentorProfile: { $exists: true }
    });

    if (mentors.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No mentors available at this time'
      });
    }

    // Calculate compatibility scores
    const matches = await Promise.all(
      mentors.map(async (mentor) => {
        const score = calculateCompatibilityScore(user, mentor);
        return {
          mentor: {
            id: mentor._id,
            firstName: mentor.firstName,
            lastName: mentor.lastName,
            profile: {
              avatar: mentor.profile.avatar,
              bio: mentor.profile.bio,
              location: mentor.profile.location,
              languages: mentor.profile.languages
            },
          mentorProfile: mentor.mentorProfile ? {
            expertise: mentor.mentorProfile.expertise,
            teachingStyle: mentor.mentorProfile.teachingStyle,
            experienceYears: mentor.mentorProfile.experienceYears,
            maxStudents: mentor.mentorProfile.maxStudents,
            certifications: mentor.mentorProfile.certifications,
            hourlyRate: mentor.mentorProfile.hourlyRate
          } : undefined,
            engagement: {
              averageRating: mentor.engagement.averageRating,
              totalSessions: mentor.engagement.totalSessions
            }
          },
          compatibilityScore: score.compatibilityScore,
          matchingCriteria: score.criteria
        };
      })
    );

    // Sort by compatibility score (descending)
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Filter out mentors the student is already paired with
    const existingPairings = await MentorStudentPairing.find({
      student: userId,
      status: { $in: ['active', 'pending'] }
    }).select('mentor');

    const existingMentorIds = existingPairings.map(p => p.mentor.toString());
    const availableMatches = matches.filter(match =>
      !existingMentorIds.includes(match.mentor.id.toString())
    );

    logger.info(`Generated ${availableMatches.length} matches for student: ${user.email}`);

    res.json({
      success: true,
      data: {
        matches: availableMatches.slice(0, 10), // Return top 10 matches
        totalAvailable: availableMatches.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/matching/pair
// @desc    Create a mentor-student pairing
// @access  Private/Admin
router.post('/pair', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mentorId, studentId, compatibilityScore, matchingCriteria } = req.body;

    // Validate required fields
    if (!mentorId || !studentId || !compatibilityScore || !matchingCriteria) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if users exist
    const [mentor, student] = await Promise.all([
      User.findById(mentorId),
      User.findById(studentId)
    ]);

    if (!mentor || !student) {
      return res.status(404).json({
        success: false,
        error: 'Mentor or student not found'
      });
    }

    // Check if pairing already exists
    const existingPairing = await MentorStudentPairing.findOne({
      mentor: mentorId,
      student: studentId,
      status: { $in: ['active', 'pending'] }
    });

    if (existingPairing) {
      return res.status(400).json({
        success: false,
        error: 'Pairing already exists'
      });
    }

    // Create pairing
    const pairing = new MentorStudentPairing({
      mentor: mentorId,
      student: studentId,
      compatibilityScore,
      matchingCriteria,
      communicationPrefs: {
        timezone: student.profile.timezone || 'UTC',
        ...matchingCriteria.communicationPrefs
      }
    });

    await pairing.save();

    logger.info(`New pairing created: Mentor ${mentor.email} - Student ${student.email}`);

    res.status(201).json({
      success: true,
      data: { pairing }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/matching/pairings
// @desc    Get pairings (filtered by user role)
// @access  Private
router.get('/pairings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const status = req.query.status as string;

    let query: any = {};

    if (userRole === 'student') {
      query.student = userId;
    } else if (userRole === 'mentor') {
      query.mentor = userId;
    }
    // Admin can see all pairings

    if (status) {
      query.status = status;
    }

    const pairings = await MentorStudentPairing.find(query)
      .populate('mentor', 'firstName lastName email profile mentorProfile')
      .populate('student', 'firstName lastName email profile studentProfile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { pairings }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/matching/pairings/:id/status
// @desc    Update pairing status
// @access  Private
router.put('/pairings/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, reason } = req.body;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const pairing = await MentorStudentPairing.findById(req.params.id);

    if (!pairing) {
      return res.status(404).json({
        success: false,
        error: 'Pairing not found'
      });
    }

    // Check permissions
    if (userRole !== 'admin' &&
        pairing.mentor.toString() !== userId &&
        pairing.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this pairing'
      });
    }

    // Validate status transitions
    const validStatuses = ['active', 'pending', 'completed', 'terminated', 'paused'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    pairing.status = status;

    // Add status change to history
    pairing.statusHistory.push({
      status,
      changedBy: userId,
      changedAt: new Date(),
      note: reason || `Status changed to ${status}`
    });

    if (status === 'completed' || status === 'terminated') {
      pairing.endDate = new Date();
    }

    await pairing.save();

    logger.info(`Pairing status updated to ${status}: ${pairing._id}`);

    res.json({
      success: true,
      data: { pairing }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/matching/pairings/:id
// @desc    Cancel/terminate a pairing
// @access  Private
router.delete('/pairings/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const pairing = await MentorStudentPairing.findById(req.params.id);

    if (!pairing) {
      return res.status(404).json({
        success: false,
        error: 'Pairing not found'
      });
    }

    // Check permissions - users can only terminate their own pairings
    if (userRole !== 'admin' &&
        pairing.mentor.toString() !== userId &&
        pairing.student.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to terminate this pairing'
      });
    }

    // Prevent termination of completed pairings
    if (pairing.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot terminate a completed pairing'
      });
    }

    // Update pairing status to terminated
    pairing.status = 'terminated';
    pairing.endDate = new Date();

    // Add termination reason to status history
    pairing.statusHistory.push({
      status: 'terminated',
      changedBy: userId,
      changedAt: new Date(),
      note: reason || 'Pairing terminated by user'
    });

    await pairing.save();

    // Update user engagement if needed
    if (pairing.status === 'active') {
      // Could add logic to update engagement metrics here
    }

    logger.info(`Pairing terminated: ${pairing._id} by user: ${userId}`);

    res.json({
      success: true,
      data: {
        pairing,
        message: 'Pairing has been terminated successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to calculate compatibility score
function calculateCompatibilityScore(student: any, mentor: any) {
  const studentProfile = student.studentProfile;
  const mentorProfile = mentor.mentorProfile;

  // Subject match (0-100)
  const subjectMatch = calculateSubjectMatch(
    studentProfile.subjects || [],
    mentorProfile?.expertise || []
  );

  // Teaching style match (0-100)
  const teachingStyleMatch = studentProfile.learningStyle === mentorProfile?.teachingStyle ? 100 :
    (studentProfile.learningStyle === 'visual' && mentorProfile?.teachingStyle === 'interactive') ? 80 :
    (studentProfile.learningStyle === 'auditory' && mentorProfile?.teachingStyle === 'project-based') ? 80 : 60;

  // Availability match (0-100)
  const availabilityMatch = calculateAvailabilityMatch(
    studentProfile.availability || [],
    mentorProfile?.availability || []
  );

  // Experience level match (0-100)
  const experienceMatch = calculateExperienceMatch(
    studentProfile.preferredMentorExperience,
    mentorProfile?.experienceYears || 0
  );

  // Weights (configurable)
  const weights = {
    subjectWeight: 0.3,
    teachingStyleWeight: 0.25,
    availabilityWeight: 0.25,
    experienceLevelWeight: 0.2
  };

  // Calculate weighted score
  const compatibilityScore = Math.round(
    subjectMatch * weights.subjectWeight +
    teachingStyleMatch * weights.teachingStyleWeight +
    availabilityMatch * weights.availabilityWeight +
    experienceMatch * weights.experienceLevelWeight
  );

  return {
    compatibilityScore: Math.max(0, Math.min(100, compatibilityScore)),
    criteria: {
      subjectMatch,
      teachingStyleMatch,
      availabilityMatch,
      experienceMatch,
      weights
    }
  };
}

function calculateSubjectMatch(studentSubjects: string[], mentorExpertise: string[]): number {
  if (!studentSubjects.length || !mentorExpertise.length) return 0;

  const matches = studentSubjects.filter(subject =>
    mentorExpertise.some(expertise =>
      expertise.toLowerCase().includes(subject.toLowerCase()) ||
      subject.toLowerCase().includes(expertise.toLowerCase())
    )
  );

  return Math.round((matches.length / studentSubjects.length) * 100);
}

function calculateAvailabilityMatch(studentAvail: string[], mentorAvail: string[]): number {
  if (!studentAvail.length || !mentorAvail.length) return 0;

  const matches = studentAvail.filter(slot => mentorAvail.includes(slot));
  return Math.round((matches.length / Math.max(studentAvail.length, mentorAvail.length)) * 100);
}

function calculateExperienceMatch(preferred: string, years: number): number {
  if (!preferred || !years) return 50;

  const ranges = {
    'beginner': [0, 2],
    'intermediate': [1, 5],
    'advanced': [3, Infinity]
  };

  const [min, max] = ranges[preferred as keyof typeof ranges] || [0, Infinity];

  if (years >= min && years <= max) return 100;
  if (years < min) return Math.max(0, years / min * 80);
  return Math.max(0, 80 - (years - max) * 10);
}

export default router;
