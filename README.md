# ACEIB Educational Platform

A centralized, automated web platform designed to digitize student admission processing and implement intelligent mentor-student matching through a weighted multi-attribute algorithm.

## 🚀 Features

- **Weighted Multi-Attribute Matching Algorithm**: Intelligent pairing of mentors and students based on configurable compatibility scores
- **Rule-Based Conflict Mediation System**: Structured workflow for handling disputes and issues
- **Real-Time Chat System**: Instant messaging between mentor-student pairs with message persistence
- **Streak-Based Engagement Calendar**: Gamification system to track and encourage user engagement

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **UI Library**: Vuetify 3
- **Language**: TypeScript
- **State Management**: Pinia
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.io
- **Validation**: Joi/Zod

### Database
- **Database**: MongoDB
- **ODM**: Mongoose

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

## 🏗️ Architecture

The platform follows a client-server architecture:

- **Frontend SPA**: Vuetify-based responsive dashboard
- **Backend API**: RESTful Node.js/Express server
- **Database**: MongoDB for flexible data storage
- **Real-time Layer**: Socket.io for instant messaging

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (for local development without Docker)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aceib-educational-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development environment**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:3000`
   - MongoDB on `localhost:27017`

### Alternative: Run services individually

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

## 📁 Project Structure

```
aceib-educational-platform/
├── frontend/                    # Vue.js + Vuetify frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── views/              # Page components
│   │   ├── stores/             # Pinia state management
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   └── package.json
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic services
│   │   └── utils/              # Utility functions
│   └── package.json
├── docker/                      # Docker configuration
├── docker-compose.yml           # Multi-container setup
└── README.md
```

## 🔧 Core Features Implementation

### Weighted Multi-Attribute Matching Algorithm

The matching system evaluates compatibility between mentors and students based on:
- Subject expertise alignment
- Teaching/learning style compatibility
- Availability scheduling
- Grade level appropriateness
- Geographic preferences

Each attribute receives a configurable weight, and the algorithm calculates compatibility scores to rank potential pairings.

### Rule-Based Conflict Mediation System

A structured workflow for handling disputes:
- Issue categorization and prioritization
- Automated status tracking
- Resolution documentation
- Audit trail maintenance

### Real-Time Chat System

WebSocket-based messaging with:
- Private rooms for mentor-student pairs
- Message persistence in MongoDB
- Real-time delivery notifications
- Chat history retrieval

### Streak-Based Engagement Calendar

Gamification features:
- Daily login/activity tracking
- Current and longest streak calculation
- Visual calendar display
- Achievement notifications

## 🧪 Testing

```bash
npm test
```

## 🚢 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@aceib.com or create an issue in this repository.
