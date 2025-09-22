# DriveConnect UK Database

A comprehensive MySQL database structure for the DriveConnect UK driving school platform.

## 🏗️ Database Architecture

### Core Tables
- **users** - Base user information (learners, instructors, admins)
- **addresses** - User address information
- **instructor_profiles** - Instructor-specific data
- **learner_profiles** - Learner-specific data
- **courses** - Available driving courses
- **bookings** - Course enrollments and bookings
- **lessons** - Individual lesson records
- **reviews** - User reviews and testimonials
- **payments** - Payment transactions

### Supporting Tables
- **instructor_vehicles** - Instructor vehicle information
- **instructor_availability** - Instructor schedule
- **instructor_service_areas** - Areas served by instructors
- **learner_availability** - Learner preferred times
- **course_statistics** - Live course statistics
- **notifications** - System notifications
- **email_templates** - Email templates
- **system_settings** - Application settings
- **audit_log** - System audit trail

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd database
npm install
```

2. **Configure environment:**
```bash
cp ../.env.example ../.env
# Edit .env with your database credentials
```

3. **Setup database:**
```bash
# Full setup (creates schema + seeds data)
npm run setup

# Or step by step:
npm run schema  # Create tables only
npm run seed    # Add sample data
```

4. **Verify setup:**
```bash
npm run verify
npm run info
```

## 📊 Database Commands

```bash
# Setup & Management
npm run setup     # Full database setup
npm run reset     # Drop all tables and recreate
npm run seed      # Add sample data only
npm run verify    # Verify database structure
npm run info      # Show database information

# Direct commands
node setup.js schema   # Create schema only
node setup.js drop     # Drop all tables (DANGEROUS)
```

## 🔧 Configuration

### Database Connection
```javascript
const { pool, testConnection } = require('./config/database');

// Test connection
await testConnection();

// Execute query
const results = await executeQuery('SELECT * FROM users WHERE id = ?', [userId]);
```

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=driveconnect_uk
```

## 📈 Models Usage

### User Model
```javascript
const User = require('./models/User');

// Create user
const userId = await User.create({
  email: 'user@example.com',
  password: 'password123',
  userType: 'learner',
  firstName: 'John',
  lastName: 'Doe'
});

// Find user
const user = await User.findByEmail('user@example.com');
```

### Instructor Model
```javascript
const Instructor = require('./models/Instructor');

// Get all instructors with filters
const instructors = await Instructor.getAll({
  city: 'London',
  transmission: 'manual',
  minRating: 4.5
});

// Get instructor details
const instructor = await Instructor.getById(instructorId);
```

### Course Model
```javascript
const Course = require('./models/Course');

// Get all courses
const courses = await Course.getAll();

// Get popular courses
const popular = await Course.getPopular(4);
```

### Booking Model
```javascript
const Booking = require('./models/Booking');

// Create booking
const booking = await Booking.create({
  learnerId: 1,
  instructorId: 2,
  courseId: 1,
  transmissionType: 'manual',
  totalHours: 40,
  hourlyRate: 35.00,
  totalAmount: 1400.00
});
```

## 🔍 Database Schema

### Key Relationships
- Users → Instructor/Learner Profiles (1:1)
- Users → Addresses (1:many)
- Instructors → Vehicles (1:many)
- Instructors → Service Areas (1:many)
- Bookings → Lessons (1:many)
- Bookings → Payments (1:many)
- Bookings → Reviews (1:many)

### Indexes & Performance
- Primary keys on all tables
- Foreign key constraints
- Composite indexes for common queries
- Full-text search on instructor bios and course descriptions

## 📋 Sample Data

The database includes comprehensive sample data:
- 9 sample instructors across UK cities
- 4 driving courses (Beginner to Advanced)
- Sample bookings and lessons
- User reviews and testimonials
- Course statistics

## 🔒 Security Features

- Password hashing with bcrypt
- SQL injection prevention
- Foreign key constraints
- Audit logging
- User role-based access

## 🛠️ Maintenance

### Backup
```bash
# Create backup
mysqldump -u root -p driveconnect_uk > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p driveconnect_uk < backup_20241201.sql
```

### Performance Monitoring
```sql
-- Check slow queries
SHOW PROCESSLIST;

-- Analyze table performance
ANALYZE TABLE users, bookings, lessons;

-- Check index usage
SHOW INDEX FROM bookings;
```

## 🧪 Testing

```bash
# Run database tests
npm test

# Test specific model
node -e "
const User = require('./models/User');
User.findByEmail('test@example.com').then(console.log);
"
```

## 📚 API Integration

The database models are designed to work seamlessly with:
- Express.js REST APIs
- GraphQL resolvers
- Real-time applications (Socket.io)
- Background job processors

## 🔄 Migrations

For production deployments, create migration files:
```sql
-- migrations/001_add_user_preferences.sql
ALTER TABLE learner_profiles 
ADD COLUMN notification_preferences JSON;
```

## 🎯 VS Code Integration

### Recommended Extensions
- MySQL (by Jun Han)
- Database Client (by Weijan Chen)
- SQL Tools (by Matheus Teixeira)

### VS Code Settings
```json
{
  "sqltools.connections": [{
    "name": "DriveConnect UK",
    "driver": "MySQL",
    "server": "localhost",
    "port": 3306,
    "database": "driveconnect_uk",
    "username": "root"
  }]
}
```

## 🚨 Troubleshooting

### Common Issues

**Connection refused:**
```bash
# Check MySQL service
sudo systemctl status mysql
sudo systemctl start mysql
```

**Permission denied:**
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON driveconnect_uk.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

**Foreign key errors:**
```sql
-- Disable temporarily
SET FOREIGN_KEY_CHECKS = 0;
-- Your operations here
SET FOREIGN_KEY_CHECKS = 1;
```

## 📞 Support

For database-related issues:
1. Check the logs: `tail -f logs/database.log`
2. Verify connection: `npm run info`
3. Run diagnostics: `npm run verify`

## 🔮 Future Enhancements

- [ ] Database sharding for scalability
- [ ] Read replicas for performance
- [ ] Automated backup system
- [ ] Performance monitoring dashboard
- [ ] Data archiving strategy
