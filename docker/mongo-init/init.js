// MongoDB initialization script
db = db.getSiblingDB('aceib');

// Create collections with indexes
db.createCollection('users');
db.createCollection('mediationtickets');
db.createCollection('chats');
db.createCollection('mentorstudentpairings');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "studentProfile.subjects": 1 });
db.users.createIndex({ "mentorProfile.expertise": 1 });
db.users.createIndex({ "engagement.currentStreak": -1 });

db.mediationtickets.createIndex({ "ticketNumber": 1 }, { unique: true });
db.mediationtickets.createIndex({ "status": 1, "priority": -1 });
db.mediationtickets.createIndex({ "reporter": 1 });
db.mediationtickets.createIndex({ "reported": 1 });
db.mediationtickets.createIndex({ "assignedTo": 1 });
db.mediationtickets.createIndex({ "issueType": 1 });
db.mediationtickets.createIndex({ "createdAt": -1 });

db.chats.createIndex({ "roomId": 1 }, { unique: true });
db.chats.createIndex({ "participants": 1 });
db.chats.createIndex({ "messages.timestamp": -1 });
db.chats.createIndex({ "pairingId": 1 });
db.chats.createIndex({ "isActive": 1 });

db.mentorstudentpairings.createIndex({ "mentor": 1, "status": 1 });
db.mentorstudentpairings.createIndex({ "student": 1, "status": 1 });
db.mentorstudentpairings.createIndex({ "status": 1 });
db.mentorstudentpairings.createIndex({ "compatibilityScore": -1 });
db.mentorstudentpairings.createIndex(
  { "mentor": 1, "student": 1, "status": 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);
db.mentorstudentpairings.createIndex({ "startDate": -1 });

// Create default admin user (for development)
db.users.insertOne({
  email: "admin@aceib.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU3lW", // password: admin123
  firstName: "System",
  lastName: "Administrator",
  role: "admin",
  profile: {
    bio: "System Administrator",
    languages: ["English"]
  },
  engagement: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: new Date(),
    totalSessions: 0
  },
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialized successfully!");
