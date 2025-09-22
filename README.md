# DriveConnect UK - Advanced Driving School Management Platform

A comprehensive SAAS platform for UK driving schools with automated notifications, progress tracking, and DVSA-compliant learning management.

## 🚀 Project Status: Phase 2 Complete

✅ **Phase 1**: Core Infrastructure & Instructor Calendar System  
✅ **Phase 2**: Automated Notifications + Progress Tracking Foundation  
🔄 **Phase 3**: Lesson Progress Tracking System (In Progress)  
⏳ **Phase 4**: Theory Test System & Course Builder  
⏳ **Phase 5**: Analytics & Performance Reports  

## 🌟 Key Features

### ✅ Completed Features

#### 🔔 **Automated Notifications System**
- **Multi-channel delivery**: Real-time Socket.IO + Email notifications
- **Lesson reminders**: Automated 24h, 2h, and 30-minute alerts
- **Booking confirmations**: Instant notifications for lesson scheduling
- **Availability alerts**: Notify learners when instructor schedules change
- **System announcements**: Admin broadcast capabilities
- **Priority handling**: Low, Medium, High, Urgent notification levels

#### 📊 **Progress Tracking Foundation**
- **DVSA-compliant competency framework**: 20+ core driving skills
- **Learning path management**: Personalized study routes
- **Milestone tracking**: Achievement recognition system
- **Progress snapshots**: Historical learning analytics
- **Objective-based assessments**: Granular skill evaluation
- **Predictive analytics**: Test readiness estimation

#### 🏫 **Core Management System**
- **User management**: Learners, Instructors, Admins with role-based access
- **Assignment system**: Learner-instructor pairing
- **Lesson scheduling**: Calendar integration with availability management
- **Booking system**: Automated lesson booking workflow
- **Real-time communication**: Socket.IO powered live updates

### 🔄 In Development

#### 📈 **Enhanced Progress Tracking**
- Detailed competency assessment tools
- Learning path completion tracking
- Progress dashboard interfaces
- Integration with notification system

## 🛠 Technical Stack

### Backend
- **Framework**: Node.js + Express.js + TypeScript
- **Database**: MySQL with Prisma ORM
- **Real-time**: Socket.IO for live notifications
- **Authentication**: JWT-based security
- **Email**: Nodemailer with Gmail integration
- **Validation**: Comprehensive input validation

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Lucide React icons
- **State Management**: Context API + React Query
- **Real-time**: Socket.IO client integration
- **Build Tool**: Vite for fast development

### Infrastructure
- **Database Migrations**: Prisma migrations
- **Development**: Hot reload with Nodemon
- **Type Safety**: Strict TypeScript compilation
- **Code Quality**: ESLint + Prettier (configured)

## 📋 Database Schema

### Core Models
```
Users ────────── Notifications
  │                   │
  ├── LearnerProfile ──┼── ProgressSnapshots
  │        │           │
  │        ├── Assignments ── Lessons ── SkillAssessments
  │        │                   │
  │        ├── LearningPaths ───┘
  │        │        │
  │        │        └── PathSteps
  │        │
  │        ├── CourseEnrollments ── LessonProgress
  │        │
  │        └── TestSessions ── TestAnalytics
  │
  └── InstructorProfile
           │
           ├── Courses ── CourseLessons
           │
           └── InstructorAvailability ── LessonBookings
```

### Progress Tracking Models
- **SkillCompetency**: DVSA-standard driving skills
- **SkillAssessment**: Individual competency evaluations
- **LessonObjective**: Granular lesson goals
- **ObjectiveProgress**: Learner progress on objectives
- **ProgressMilestone**: Achievement markers
- **LearningPath**: Personalized learning routes
- **ProgressSnapshot**: Historical progress records

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/knightappsdev/driveschooluk.git
cd driveschooluk
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../
npm install
```

3. **Environment Setup**

Backend `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/driveconnect_uk"
JWT_SECRET="your-secret-key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
CORS_ORIGIN="http://localhost:5173"
```

4. **Database Setup**
```bash
cd backend
npx prisma db push
npx prisma generate
```

5. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev  # Runs on http://localhost:3001
```

Frontend:
```bash
npm run dev  # Runs on http://localhost:5173
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/send` - Send notification (Admin)
- `POST /api/notifications/announcements` - System announcements (Admin)

### Progress Tracking
- `GET /api/progress/analytics/:learnerId` - Get progress analytics
- `POST /api/progress/lesson-outcome` - Record lesson outcome
- `GET /api/progress/competencies` - Get skill competencies
- `POST /api/progress/learning-path` - Create learning path

### Calendar & Booking
- `GET /api/calendar/availability` - Get instructor availability
- `POST /api/bookings` - Create lesson booking
- `GET /api/bookings/learner/:id` - Get learner bookings

## 🔄 Real-time Features

### Socket.IO Events

**Client → Server:**
- `join-user-room` - Join user-specific room
- `mark-notification-read` - Mark notification as read
- `get-notifications` - Retrieve notifications

**Server → Client:**
- `notification` - New notification received
- `notification-read` - Notification marked as read
- `assignment-updated` - Assignment status changed
- `lesson-updated` - Lesson details updated

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# TypeScript compilation check
cd backend
npx tsc --noEmit
```

## 📈 Progress Tracking System

### Competency Categories
1. **Vehicle Control**: Moving off, clutch control, steering, speed control
2. **Hazard Awareness**: Scanning, response, anticipation
3. **Road Positioning**: Lane positioning, following distance, roundabouts
4. **Manoeuvres**: Parking, three-point turns, emergency stops
5. **Observation**: Mirror use, blind spots, junction observation
6. **Communication**: Signaling, road positioning communication

### Learning Path Features
- Adaptive step generation based on current progress
- Prerequisite management for skill dependencies
- Estimated time calculation for completion
- Resource linking to learning materials
- Progress milestone integration

### Assessment Scale
- **1.0-1.9**: Needs significant improvement
- **2.0-2.9**: Developing skill
- **3.0-3.9**: Competent with guidance
- **4.0-4.5**: Independent competency
- **4.6-5.0**: Advanced/Teaching level

## 🔐 Security Features

- JWT authentication with refresh tokens
- Role-based access control (Learner/Instructor/Admin/Super Admin)
- Input validation and sanitization
- SQL injection protection via Prisma
- CORS configuration
- Secure password hashing

## 🚀 Deployment

### Environment Variables
Set appropriate values for production:
- `NODE_ENV=production`
- `DATABASE_URL` (Production MySQL)
- `JWT_SECRET` (Strong secret)
- `EMAIL_USER` & `EMAIL_PASS` (Production email)
- `CORS_ORIGIN` (Production domain)

### Build Process
```bash
# Backend
cd backend
npm run build

# Frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Roadmap

### Phase 3: Enhanced Progress Tracking
- [ ] Progress dashboard UI components
- [ ] Competency assessment interface
- [ ] Learning path visualization
- [ ] Progress report generation

### Phase 4: Theory Test System
- [ ] DVSA question bank integration
- [ ] Mock test generator
- [ ] Hazard perception tests
- [ ] Test analytics and insights

### Phase 5: Course Builder
- [ ] Instructor course creation tools
- [ ] Learning material management
- [ ] Course templates and sharing
- [ ] Student enrollment system

### Phase 6: Analytics & Reports
- [ ] Instructor performance metrics
- [ ] School-wide analytics dashboard
- [ ] Financial reporting
- [ ] Student progress reports

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DVSA (Driver and Vehicle Standards Agency) for competency frameworks
- UK driving instruction standards and best practices
- Open source community for excellent tooling

---

**DriveConnect UK** - Transforming driving education through technology 🚗💡