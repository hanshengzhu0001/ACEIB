# Testing Guide - ACEIB Educational Platform

## 🧪 Testing in Real Environment

Since Docker and MongoDB aren't available in this sandbox, here's how to test the platform in a real development environment.

## Prerequisites

### Required Software
- **Node.js 18+**: https://nodejs.org/
- **MongoDB 7+**: https://docs.mongodb.com/manual/installation/
- **Docker & Docker Compose** (optional, for containerized testing)

### Quick Setup (macOS with Homebrew)
```bash
# Install Node.js (if not installed)
brew install node

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install Docker (optional)
# Download from: https://docs.docker.com/desktop/mac/install/
```

## 🚀 Testing Options

### Option 1: Local Development (Recommended)

#### 1. Start MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manual start
mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
```

#### 2. Configure Environment
```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit backend/.env with your settings:
# MONGODB_URI=mongodb://localhost:27017/aceib
# JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
# JWT_EXPIRE=7d
# FRONTEND_URL=http://localhost:3000
```

#### 3. Install Dependencies & Start Services
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/health

### Option 2: Docker Development

#### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM allocated to Docker

#### 1. Start Services
```bash
# Remove obsolete version field from docker-compose.yml
# (The warning is harmless but you can remove 'version: "3.8"' if desired)

# Start all services
docker-compose up --build
```

#### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017

## 🧪 Test Scenarios

### Demo Accounts
Use these pre-seeded accounts for testing:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Student** | `student.demo1@aceib-platform.demo` | `DemoStudent2024!` | Matching, chat, pairings |
| **Mentor** | `mentor.demo1@aceib-platform.demo` | `DemoMentor2024!` | Profile, chat, pairings |
| **Admin** | `admin@aceib-platform.demo` | `DemoAdmin2024!` | Full admin panel |

### Core Feature Testing

#### ✅ Authentication & Registration
1. Visit http://localhost:3000
2. Try registering a new account
3. Test login with demo accounts
4. Verify role-based redirects

#### ✅ Dashboard & Navigation
1. Login as different user types
2. Check dashboard statistics
3. Test navigation menu
4. Verify role-based menu items

#### ✅ Mentor Matching (Student View)
1. Login as student
2. Click "Find Mentor" or visit /matching
3. Review compatibility scores
4. Request a pairing
5. Check pairings page

#### ✅ Real-time Chat
1. Have two users (mentor + student) in active pairing
2. Navigate to /chat
3. Test sending messages
4. Verify real-time delivery
5. Test message history

#### ✅ Profile Management
1. Visit /profile
2. Update personal information
3. Test role-specific profile sections
4. Save changes and verify persistence

#### ✅ Mediation System
1. Visit /mediation
2. Create a support ticket
3. Test different issue types
4. Check ticket status tracking

#### ✅ Admin Panel (Admin Only)
1. Login as admin
2. Visit /admin
3. Test user management
4. Check analytics dashboard
5. Review mediation tickets

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Check Node.js version
node --version

# Check environment variables
cat backend/.env
```

#### Frontend Build Issues
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Database Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community

# Check database logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

#### Port Conflicts
```bash
# Find processes using ports
lsof -i :3000
lsof -i :3001
lsof -i :27017

# Kill conflicting processes
kill -9 <PID>
```

## 📊 Performance Testing

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run basic load test
artillery quick --count 10 --num 5 http://localhost:3001/health
```

### API Testing
```bash
# Test API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/users/stats/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Testing

### Authentication Testing
- Test expired JWT tokens
- Try accessing protected routes without auth
- Test role-based access control

### Input Validation Testing
- Test XSS attempts in forms
- Try SQL/NoSQL injection payloads
- Test file upload restrictions

## 📱 Cross-Platform Testing

### Browser Testing
- Chrome/Chromium
- Firefox
- Safari
- Edge

### Device Testing
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667)

## 🚀 Production Deployment Testing

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Database backups tested
- [ ] Monitoring tools configured
- [ ] CDN configured for static assets

### Deployment Commands
```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build -d

# Check logs
docker-compose logs -f

# Health check
curl https://yourdomain.com/health
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs
3. Test individual components
4. Check network connectivity
5. Verify environment configuration

## 🎯 Success Criteria

✅ **Application starts without errors**
✅ **All demo accounts work**
✅ **Real-time chat functions**
✅ **Matching algorithm returns results**
✅ **Admin panel accessible**
✅ **Responsive design works on mobile**
✅ **No console errors in browser**
✅ **API responds within 2 seconds**
✅ **Database connections stable**

---

**🎉 Once all tests pass, your ACEIB Educational Platform is ready for production!**
