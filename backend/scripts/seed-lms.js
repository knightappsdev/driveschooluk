const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LMS seeding...\n');

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // SuperAdmin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@driveconnect.co.uk' },
    update: {},
    create: {
      email: 'admin@driveconnect.co.uk',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      firstName: 'James',
      lastName: 'Morrison',
      phone: '+44 20 7946 0958',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Created SuperAdmin:', superAdmin.email);

  // Instructors
  const instructor1 = await prisma.user.upsert({
    where: { email: 'sarah.mitchell@driveconnect.co.uk' },
    update: {},
    create: {
      email: 'sarah.mitchell@driveconnect.co.uk',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      firstName: 'Sarah',
      lastName: 'Mitchell',
      phone: '+44 78 9654 3210',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'david.thompson@driveconnect.co.uk' },
    update: {},
    create: {
      email: 'david.thompson@driveconnect.co.uk',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      firstName: 'David',
      lastName: 'Thompson',
      phone: '+44 78 9654 3211',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const instructor3 = await prisma.user.upsert({
    where: { email: 'emma.wilson@driveconnect.co.uk' },
    update: {},
    create: {
      email: 'emma.wilson@driveconnect.co.uk',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      firstName: 'Emma',
      lastName: 'Wilson',
      phone: '+44 78 9654 3212',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Created Instructors:', [instructor1.email, instructor2.email, instructor3.email]);

  // Students
  const students = [];
  const studentData = [
    { email: 'alice.johnson@gmail.com', firstName: 'Alice', lastName: 'Johnson', phone: '+44 78 1234 5678', dob: new Date('2005-03-15') },
    { email: 'bob.smith@gmail.com', firstName: 'Bob', lastName: 'Smith', phone: '+44 78 1234 5679', dob: new Date('2004-07-22') },
    { email: 'charlie.brown@gmail.com', firstName: 'Charlie', lastName: 'Brown', phone: '+44 78 1234 5680', dob: new Date('2005-11-08') },
    { email: 'diana.prince@gmail.com', firstName: 'Diana', lastName: 'Prince', phone: '+44 78 1234 5681', dob: new Date('2004-12-25') },
    { email: 'ethan.hunt@gmail.com', firstName: 'Ethan', lastName: 'Hunt', phone: '+44 78 1234 5682', dob: new Date('2005-05-18') },
    { email: 'fiona.green@gmail.com', firstName: 'Fiona', lastName: 'Green', phone: '+44 78 1234 5683', dob: new Date('2006-01-30') },
  ];

  for (const student of studentData) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        password: hashedPassword,
        role: 'LEARNER',
        status: 'ACTIVE',
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    students.push(user);
  }

  console.log('✅ Created Students:', students.map(s => s.email));

  // Create Instructor Profiles
  const instructorProfile1 = await prisma.instructorProfile.upsert({
    where: { userId: instructor1.id },
    update: {},
    create: {
      userId: instructor1.id,
      instructorLicense: 'ADI-001-SM',
      vehicleType: 'Manual/Automatic',
      experience: 8,
      specializations: JSON.stringify(['Nervous Students', 'Pass Plus', 'Intensive Courses']),
      availabilityNotes: JSON.stringify({ flexible: true, evenings: true, weekends: true }),
      hourlyRate: 35.00,
      bio: 'Experienced driving instructor with 8 years of teaching. Specializes in helping nervous students build confidence.',
      qualifications: JSON.stringify(['ADI Qualified', 'Pass Plus Instructor', 'First Aid Certified']),
      rating: 4.8,
      totalStudents: 156,
      activeStudents: 12,
      completedStudents: 144,
      isActive: true,
    },
  });

  const instructorProfile2 = await prisma.instructorProfile.upsert({
    where: { userId: instructor2.id },
    update: {},
    create: {
      userId: instructor2.id,
      instructorLicense: 'ADI-002-DT',
      vehicleType: 'Manual',
      experience: 12,
      specializations: JSON.stringify(['Test Preparation', 'Advanced Driving', 'Fleet Training']),
      availabilityNotes: JSON.stringify({ mornings: true, weekdays: true }),
      hourlyRate: 40.00,
      bio: '12 years of driving instruction experience. Expert in test preparation and advanced driving techniques.',
      qualifications: JSON.stringify(['ADI Qualified', 'IAM Advanced Instructor', 'Fleet Training Certified']),
      rating: 4.9,
      totalStudents: 203,
      activeStudents: 15,
      completedStudents: 188,
      isActive: true,
    },
  });

  const instructorProfile3 = await prisma.instructorProfile.upsert({
    where: { userId: instructor3.id },
    update: {},
    create: {
      userId: instructor3.id,
      instructorLicense: 'ADI-003-EW',
      vehicleType: 'Automatic',
      experience: 5,
      specializations: JSON.stringify(['Young Drivers', 'Refresher Lessons', 'Eco Driving']),
      availabilityNotes: JSON.stringify({ afternoons: true, weekends: true, flexible: true }),
      hourlyRate: 32.00,
      bio: 'Passionate instructor focusing on young drivers and eco-friendly driving techniques.',
      qualifications: JSON.stringify(['ADI Qualified', 'Eco Driving Specialist', 'Young Driver Trainer']),
      rating: 4.7,
      totalStudents: 89,
      activeStudents: 18,
      completedStudents: 71,
      isActive: true,
    },
  });

  console.log('✅ Created Instructor Profiles');

  // Create Learner Profiles
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const studentInfo = studentData[i];
    
    await prisma.learnerProfile.upsert({
      where: { userId: student.id },
      update: {},
      create: {
        userId: student.id,
        dateOfBirth: studentInfo.dob,
        address: `${i + 1}${i + 1} Example Street, London, SW1A 1AA`,
        emergencyContact: `Parent of ${student.firstName}`,
        emergencyPhone: `+44 20 7946 ${1000 + i}`,
        theoryTestPassed: i < 3, // First 3 students have passed theory
        theoryTestDate: i < 3 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : null, // 30 days ago
        practicalTestPassed: i < 1, // Only first student has passed practical
        practicalTestDate: i < 1 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null, // 7 days ago
        notes: `Learning progress notes for ${student.firstName}`,
        startDate: new Date(Date.now() - (60 - i * 10) * 24 * 60 * 60 * 1000), // Staggered start dates
        totalLessons: 10 + i * 3,
        completedLessons: 5 + i * 2,
      },
    });
  }

  console.log('✅ Created Learner Profiles');

  // Create Test Categories
  const categories = [
    { name: 'Traffic Signs', description: 'Road signs and markings', order: 1 },
    { name: 'Rules of the Road', description: 'Highway code and traffic rules', order: 2 },
    { name: 'Vehicle Safety Checks', description: 'Pre-driving safety inspections', order: 3 },
    { name: 'Vulnerable Road Users', description: 'Pedestrians, cyclists, and motorcyclists', order: 4 },
    { name: 'Other Types of Vehicle', description: 'Buses, lorries, and emergency vehicles', order: 5 },
    { name: 'Vehicle Loading', description: 'Safe loading and weight distribution', order: 6 },
    { name: 'Driving Test', description: 'Practical test requirements', order: 7 },
    { name: 'Accidents', description: 'Emergency procedures and first aid', order: 8 },
    { name: 'Vehicle Defects', description: 'Identifying and reporting defects', order: 9 },
    { name: 'Environmental Issues', description: 'Eco-friendly driving practices', order: 10 },
  ];

  const testCategories = [];
  for (const cat of categories) {
    const category = await prisma.testCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    testCategories.push(category);
  }

  console.log('✅ Created Test Categories');

  // Create sample questions for each category
  const sampleQuestions = [
    {
      categoryName: 'Traffic Signs',
      questions: [
        {
          question: 'What does a triangular road sign mean?',
          options: JSON.stringify(['Give information', 'Give orders', 'Give warnings', 'Give directions']),
          correctAnswer: 'Give warnings',
          explanation: 'Triangular signs are warning signs that alert drivers to hazards ahead.',
          difficulty: 'BEGINNER'
        },
        {
          question: 'What does this sign mean? [STOP sign image]',
          options: JSON.stringify(['Slow down', 'Give way', 'Stop', 'No entry']),
          correctAnswer: 'Stop',
          explanation: 'The STOP sign requires you to come to a complete stop.',
          difficulty: 'BEGINNER'
        },
        {
          question: 'A red circular sign with a white bar means:',
          options: JSON.stringify(['No entry', 'Stop', 'Give way', 'Warning']),
          correctAnswer: 'No entry',
          explanation: 'Red circle with white bar indicates prohibition - no entry.',
          difficulty: 'INTERMEDIATE'
        }
      ]
    },
    {
      categoryName: 'Rules of the Road',
      questions: [
        {
          question: 'What is the national speed limit on a dual carriageway?',
          options: JSON.stringify(['60 mph', '70 mph', '50 mph', '40 mph']),
          correctAnswer: '70 mph',
          explanation: 'The national speed limit on dual carriageways is 70 mph for cars.',
          difficulty: 'BEGINNER'
        },
        {
          question: 'When should you use hazard warning lights?',
          options: JSON.stringify(['When parking illegally', 'When your vehicle has broken down', 'When reversing', 'When overtaking']),
          correctAnswer: 'When your vehicle has broken down',
          explanation: 'Hazard lights should be used when your vehicle is causing an obstruction.',
          difficulty: 'INTERMEDIATE'
        }
      ]
    },
    {
      categoryName: 'Vehicle Safety Checks',
      questions: [
        {
          question: 'How often should you check your tire pressure?',
          options: JSON.stringify(['Weekly', 'Monthly', 'Daily', 'Yearly']),
          correctAnswer: 'Weekly',
          explanation: 'Tire pressure should be checked at least weekly for safety and fuel efficiency.',
          difficulty: 'BEGINNER'
        },
        {
          question: 'What is the minimum legal tread depth for car tires?',
          options: JSON.stringify(['1.6mm', '2.0mm', '1.0mm', '3.0mm']),
          correctAnswer: '1.6mm',
          explanation: 'The legal minimum tread depth is 1.6mm across the central three-quarters of the tire.',
          difficulty: 'INTERMEDIATE'
        }
      ]
    }
  ];

  const testQuestions = [];
  for (const catQuestions of sampleQuestions) {
    const category = testCategories.find(c => c.name === catQuestions.categoryName);
    for (const q of catQuestions.questions) {
      const question = await prisma.testQuestion.create({
        data: {
          categoryId: category.id,
          type: 'MULTIPLE_CHOICE',
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          tags: JSON.stringify(['theory-test', 'dvsa']),
        },
      });
      testQuestions.push(question);
    }
  }

  console.log('✅ Created Test Questions');

  // Create Theory Tests
  const theoryTest = await prisma.theoryTest.create({
    data: {
      title: 'DVSA Practice Test - Highway Code',
      description: 'Official DVSA-style practice test covering essential highway code knowledge',
      type: 'PRACTICE',
      timeLimit: 45,
      passingScore: 43,
      totalQuestions: 50,
      isRandomized: true,
      createdBy: superAdmin.id,
    },
  });

  const mockExam = await prisma.theoryTest.create({
    data: {
      title: 'Mock Theory Test - Full Exam',
      description: 'Complete mock exam simulating the real theory test conditions',
      type: 'MOCK_EXAM',
      timeLimit: 57,
      passingScore: 43,
      totalQuestions: 50,
      isRandomized: true,
      createdBy: superAdmin.id,
    },
  });

  console.log('✅ Created Theory Tests');

  // Map questions to tests
  for (let i = 0; i < testQuestions.length; i++) {
    await prisma.testQuestionMapping.create({
      data: {
        testId: theoryTest.id,
        questionId: testQuestions[i].id,
        order: i + 1,
        weight: 1.0,
      },
    });

    await prisma.testQuestionMapping.create({
      data: {
        testId: mockExam.id,
        questionId: testQuestions[i].id,
        order: i + 1,
        weight: 1.0,
      },
    });
  }

  console.log('✅ Mapped Questions to Tests');

  // Create Courses
  const practicalCourse = await prisma.course.create({
    data: {
      title: 'Complete Practical Driving Course',
      description: 'Comprehensive practical driving course from beginner to test-ready',
      category: 'PRACTICAL',
      level: 'BEGINNER',
      duration: 40, // 40 hours
      status: 'PUBLISHED',
      price: 1200.00,
      isDefault: true,
      instructorId: instructorProfile1.id,
    },
  });

  const theoryCourse = await prisma.course.create({
    data: {
      title: 'Theory Test Preparation Course',
      description: 'Complete theory test preparation with practice tests and study materials',
      category: 'THEORY',
      level: 'BEGINNER',
      duration: 20, // 20 hours
      status: 'PUBLISHED',
      price: 299.00,
      isDefault: true,
      instructorId: instructorProfile2.id,
    },
  });

  const intensiveCourse = await prisma.course.create({
    data: {
      title: 'Intensive Driving Course',
      description: 'Fast-track driving course for quick learners',
      category: 'COMBINED',
      level: 'INTERMEDIATE',
      duration: 30, // 30 hours
      status: 'PUBLISHED',
      price: 1500.00,
      isDefault: false,
      instructorId: instructorProfile3.id,
    },
  });

  console.log('✅ Created Courses');

  // Create Course Lessons
  const practicalLessons = [
    { title: 'Introduction to Vehicle Controls', type: 'THEORY', order: 1, duration: 60 },
    { title: 'Starting and Moving Off', type: 'PRACTICAL', order: 2, duration: 120 },
    { title: 'Steering and Vehicle Control', type: 'PRACTICAL', order: 3, duration: 120 },
    { title: 'Use of Mirrors', type: 'PRACTICAL', order: 4, duration: 90 },
    { title: 'Traffic Signs and Signals', type: 'THEORY', order: 5, duration: 60 },
    { title: 'Junction Procedures', type: 'PRACTICAL', order: 6, duration: 150 },
    { title: 'Roundabouts', type: 'PRACTICAL', order: 7, duration: 120 },
    { title: 'Dual Carriageways', type: 'PRACTICAL', order: 8, duration: 120 },
    { title: 'Emergency Stop', type: 'PRACTICAL', order: 9, duration: 90 },
    { title: 'Independent Driving', type: 'PRACTICAL', order: 10, duration: 180 },
  ];

  for (const lesson of practicalLessons) {
    await prisma.courseLesson.create({
      data: {
        courseId: practicalCourse.id,
        title: lesson.title,
        description: `Learn ${lesson.title.toLowerCase()} with practical exercises and guidance`,
        type: lesson.type,
        order: lesson.order,
        duration: lesson.duration,
        content: `Comprehensive training in ${lesson.title.toLowerCase()}`
      },
    });
  }

  console.log('✅ Created Course Lessons');

  // Create Instructor Availability
  const instructorProfiles = [instructorProfile1, instructorProfile2, instructorProfile3];
  for (let i = 0; i < instructorProfiles.length; i++) {
    const profile = instructorProfiles[i];
    
    // Monday to Friday availability
    for (let day = 1; day <= 5; day++) {
      await prisma.instructorAvailability.create({
        data: {
          instructorId: profile.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isRecurring: true,
        },
      });
    }
    
    // Weekend availability for some instructors
    if (i === 0 || i === 2) { // Sarah and Emma work weekends
      await prisma.instructorAvailability.create({
        data: {
          instructorId: profile.id,
          dayOfWeek: 6, // Saturday
          startTime: '10:00',
          endTime: '16:00',
          isRecurring: true,
        },
      });
    }
  }

  console.log('✅ Created Instructor Availability');

  // Create Course Enrollments
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const learnerProfile = await prisma.learnerProfile.findUnique({
      where: { userId: student.id }
    });

    if (learnerProfile) {
      const courseId = i % 2 === 0 ? practicalCourse.id : theoryCourse.id;
      const progress = Math.random() * 80 + 10; // 10-90% progress
      
      await prisma.courseEnrollment.create({
        data: {
          courseId: courseId,
          learnerId: learnerProfile.id,
          progress: progress,
          isActive: true,
        },
      });
    }
  }

  console.log('✅ Created Course Enrollments');

  // Create some sample lessons and bookings
  const assignments = await prisma.assignment.findMany({
    include: {
      learner: true,
      instructor: true,
    }
  });

  for (const assignment of assignments.slice(0, 3)) {
    // Create completed lesson
    await prisma.lesson.create({
      data: {
        assignmentId: assignment.id,
        learnerId: assignment.learnerId,
        instructorId: assignment.instructorId,
        title: 'Basic Vehicle Control',
        description: 'Introduction to clutch, accelerator, and steering control',
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 120,
        status: 'COMPLETED',
        location: 'DriveConnect Training Centre',
        notes: 'Student showed good progress with basic controls',
        instructorNotes: 'Needs more practice with hill starts',
        rating: 4,
        feedback: 'Good lesson, making steady progress',
      },
    });

    // Create upcoming booking
    await prisma.lessonBooking.create({
      data: {
        learnerId: assignment.learnerId,
        instructorId: assignment.instructorId,
        lessonType: 'PRACTICAL',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 120,
        status: 'CONFIRMED',
        location: 'Student pickup location',
        notes: 'Focus on roundabouts and junction work',
      },
    });
  }

  console.log('✅ Created Sample Lessons and Bookings');

  // Create some test sessions
  const learnerProfiles = await prisma.learnerProfile.findMany({
    take: 3
  });

  for (const learner of learnerProfiles) {
    const session = await prisma.testSession.create({
      data: {
        testId: theoryTest.id,
        learnerId: learner.id,
        completedAt: new Date(),
        timeSpent: 42,
        score: 85.5,
        passed: true,
        status: 'COMPLETED',
        currentQuestionIndex: 50,
      },
    });

    // Create test analytics
    await prisma.testAnalytics.create({
      data: {
        sessionId: session.id,
        learnerId: learner.id,
        weakCategories: JSON.stringify(['Vehicle Loading', 'Environmental Issues']),
        strongCategories: JSON.stringify(['Traffic Signs', 'Rules of the Road']),
        timePerQuestion: 50.4,
        accuracyRate: 85.5,
        improvementAreas: JSON.stringify([
          'Review vehicle loading regulations',
          'Study environmental impact of driving',
          'Practice more hazard perception'
        ]),
      },
    });
  }

  console.log('✅ Created Test Sessions and Analytics');

  // Create performance reports
  for (const learner of learnerProfiles) {
    await prisma.performanceReport.create({
      data: {
        learnerId: learner.id,
        instructorId: instructorProfile1.id,
        reportType: 'MONTHLY',
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: new Date(),
        totalLessons: 8,
        completedLessons: 6,
        averageScore: 82.5,
        strengths: JSON.stringify([
          'Good observation skills',
          'Confident with basic maneuvers',
          'Follows instructions well'
        ]),
        weaknesses: JSON.stringify([
          'Needs practice with parallel parking',
          'Hesitant at busy junctions',
          'Speed control on dual carriageways'
        ]),
        recommendations: JSON.stringify([
          'Additional parking practice sessions',
          'Focus on junction confidence building',
          'Dual carriageway driving experience'
        ]),
        overallGrade: 'B+',
      },
    });
  }

  console.log('✅ Created Performance Reports');

  // Create notifications
  const notificationTypes = [
    { type: 'LESSON', title: 'Upcoming Lesson Reminder', message: 'You have a driving lesson scheduled for tomorrow at 2:00 PM' },
    { type: 'ASSIGNMENT', title: 'New Assignment', message: 'You have been assigned a new instructor for your driving course' },
    { type: 'SYSTEM', title: 'Course Progress Update', message: 'Congratulations! You have completed 50% of your driving course' },
    { type: 'TEST', title: 'Theory Test Reminder', message: 'Your theory test is scheduled for next week. Good luck!' },
  ];

  for (const student of students.slice(0, 4)) {
    const notification = notificationTypes[students.indexOf(student) % notificationTypes.length];
    await prisma.notification.create({
      data: {
        userId: student.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: 'UNREAD',
      },
    });
  }

  console.log('✅ Created Notifications');

  // Create learning materials
  const materials = [
    {
      title: 'Highway Code PDF',
      description: 'Complete Highway Code reference document',
      type: 'PDF',
      content: 'Complete guide to UK traffic laws and road safety',
      courseId: theoryCourse.id,
      order: 1,
    },
    {
      title: 'Hazard Perception Training Video',
      description: 'Interactive hazard perception training',
      type: 'VIDEO',
      content: 'Learn to identify and respond to road hazards',
      courseId: theoryCourse.id,
      order: 2,
    },
    {
      title: 'Vehicle Safety Checklist',
      description: 'Pre-driving safety inspection guide',
      type: 'PDF',
      content: 'Step-by-step vehicle safety check procedures',
      courseId: practicalCourse.id,
      order: 1,
    },
    {
      title: 'Maneuver Practice Guide',
      description: 'Guide for practicing driving maneuvers',
      type: 'PDF',
      content: 'Detailed instructions for all driving test maneuvers',
      courseId: practicalCourse.id,
      order: 2,
    },
  ];

  for (const material of materials) {
    await prisma.learningMaterial.create({
      data: {
        title: material.title,
        description: material.description,
        type: material.type,
        content: material.content,
        courseId: material.courseId,
        order: material.order,
        uploadedBy: superAdmin.id,
      },
    });
  }

  console.log('✅ Created Learning Materials');

  console.log('\n🎉 LMS Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`• Users: ${students.length + 4} (1 SuperAdmin, 3 Instructors, ${students.length} Students)`);
  console.log('• Courses: 3 (Practical, Theory, Intensive)');
  console.log(`• Test Categories: ${testCategories.length}`);
  console.log(`• Test Questions: ${testQuestions.length}`);
  console.log('• Theory Tests: 2');
  console.log(`• Learning Materials: ${materials.length}`);
  console.log('• Course Enrollments: 6');
  console.log('• Instructor Availability: Configured for all instructors');
  console.log('• Sample Lessons and Bookings: Created');
  console.log('• Test Sessions with Analytics: Created');
  console.log('• Performance Reports: Created');
  console.log('• Notifications: Created');
  
  console.log('\n🔐 Login Credentials:');
  console.log('SuperAdmin: admin@driveconnect.co.uk / password123');
  console.log('Instructor: sarah.mitchell@driveconnect.co.uk / password123');
  console.log('Student: alice.johnson@gmail.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });