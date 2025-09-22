-- DriveConnect UK Seed Data
-- Sample data for development and testing

USE driveconnect_uk;

-- =============================================
-- SEED SYSTEM SETTINGS
-- =============================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'DriveConnect UK', 'string', 'Website name', TRUE),
('site_description', 'Find Your Perfect Driving Instructor in the UK', 'string', 'Website description', TRUE),
('contact_email', 'info@driveconnect.uk', 'string', 'Main contact email', TRUE),
('contact_phone', '+44 7756 183484', 'string', 'Main contact phone', TRUE),
('whatsapp_number', '447756183484', 'string', 'WhatsApp contact number', TRUE),
('default_currency', 'GBP', 'string', 'Default currency', TRUE),
('booking_advance_days', '7', 'number', 'Minimum days in advance for booking', FALSE),
('cancellation_hours', '24', 'number', 'Minimum hours for cancellation', FALSE),
('instructor_commission', '15.00', 'number', 'Platform commission percentage', FALSE),
('max_lessons_per_day', '8', 'number', 'Maximum lessons per instructor per day', FALSE);

-- =============================================
-- SEED COURSES
-- =============================================

INSERT INTO courses (title, subtitle, description, icon_class, min_hours, max_hours, base_price, transmission_type, difficulty_level, features, full_features, why_choose, sort_order) VALUES
(
    'Absolute Beginner',
    'Perfect for those who have never been behind the wheel',
    'Our comprehensive beginner course is designed for complete newcomers to driving. With patient, experienced instructors and a structured learning approach, you will build confidence from your very first lesson.',
    'bi-person-plus',
    45, 50, 1350.00, 'both', 'absolute_beginner',
    '["Basic vehicle controls", "Road awareness", "Parking fundamentals", "Highway Code basics"]',
    '["Complete vehicle familiarization", "Basic controls and safety checks", "Road positioning and awareness", "Traffic rules and regulations", "Parking and maneuvering", "Highway Code theory", "Mock theory tests", "Pre-test preparation"]',
    'Our comprehensive beginner course is designed for complete newcomers to driving. With patient, experienced instructors and a structured learning approach, you will build confidence from your very first lesson.',
    1
),
(
    'Beginner',
    'For those with some basic knowledge but limited practical experience',
    'Perfect for those who have some driving knowledge but need structured practice. Our beginner course focuses on building real-world driving skills and confidence.',
    'bi-person-check',
    35, 40, 1050.00, 'both', 'beginner',
    '["Building confidence", "Traffic navigation", "Advanced parking", "Test preparation"]',
    '["Confidence building exercises", "Complex traffic situations", "Advanced parking techniques", "Roundabout navigation", "Dual carriageway driving", "Test route practice", "Hazard perception training", "Final test preparation"]',
    'Perfect for those who have some driving knowledge but need structured practice. Our beginner course focuses on building real-world driving skills and confidence.',
    2
),
(
    'Intermediate',
    'Advance your skills with more complex driving scenarios',
    'Designed for drivers who have basic skills but need to master more challenging driving scenarios. Focus on advanced techniques and real-world application.',
    'bi-speedometer2',
    25, 30, 750.00, 'both', 'intermediate',
    '["Complex junctions", "Dual carriageways", "Night driving", "Weather conditions"]',
    '["Complex junction navigation", "Motorway and dual carriageway skills", "Night and adverse weather driving", "Advanced maneuvering", "Independent driving practice", "Test standard refinement", "Emergency procedures", "Eco-driving techniques"]',
    'Designed for drivers who have basic skills but need to master more challenging driving scenarios. Focus on advanced techniques and real-world application.',
    3
),
(
    'Advanced',
    'Master advanced techniques and prepare for your test',
    'The final step to test success. Our advanced course polishes your skills to test standard and beyond, ensuring you pass with confidence.',
    'bi-award',
    15, 20, 450.00, 'both', 'advanced',
    '["Test refinement", "Advanced maneuvers", "Mock tests", "Final preparation"]',
    '["Test standard refinement", "Advanced maneuvering techniques", "Multiple mock driving tests", "Test route familiarization", "Examiner expectations training", "Last-minute preparation", "Confidence building", "Post-test driving advice"]',
    'The final step to test success. Our advanced course polishes your skills to test standard and beyond, ensuring you pass with confidence.',
    4
);

-- =============================================
-- SEED SAMPLE USERS (INSTRUCTORS)
-- =============================================

INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, date_of_birth, gender, is_active, email_verified) VALUES
('sarah.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Sarah', 'Johnson', '+44 7700 900001', '1985-03-15', 'female', TRUE, TRUE),
('ahmed.hassan@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Ahmed', 'Hassan', '+44 7700 900002', '1980-07-22', 'male', TRUE, TRUE),
('emma.williams@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Emma', 'Williams', '+44 7700 900003', '1988-11-08', 'female', TRUE, TRUE),
('raj.patel@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Raj', 'Patel', '+44 7700 900004', '1975-12-03', 'male', TRUE, TRUE),
('maria.rodriguez@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Maria', 'Rodriguez', '+44 7700 900005', '1982-05-18', 'female', TRUE, TRUE),
('james.thompson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'James', 'Thompson', '+44 7700 900006', '1979-09-12', 'male', TRUE, TRUE),
('priya.singh@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Priya', 'Singh', '+44 7700 900007', '1986-01-25', 'female', TRUE, TRUE),
('david.chen@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'David', 'Chen', '+44 7700 900008', '1983-04-30', 'male', TRUE, TRUE),
('lisa.murphy@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'instructor', 'Lisa', 'Murphy', '+44 7700 900009', '1990-08-14', 'female', TRUE, TRUE);

-- =============================================
-- SEED INSTRUCTOR ADDRESSES
-- =============================================

INSERT INTO addresses (user_id, address_line_1, city, county, postcode, is_primary) VALUES
(1, '123 Oak Street', 'Manchester', 'Greater Manchester', 'M1 1AA', TRUE),
(2, '456 High Road', 'Birmingham', 'West Midlands', 'B1 1BB', TRUE),
(3, '789 King Street', 'London', 'Greater London', 'SW1A 1AA', TRUE),
(4, '321 Queen Avenue', 'Leicester', 'Leicestershire', 'LE1 1CC', TRUE),
(5, '654 Park Lane', 'Liverpool', 'Merseyside', 'L1 1DD', TRUE),
(6, '987 Church Road', 'Leeds', 'West Yorkshire', 'LS1 1EE', TRUE),
(7, '147 Mill Street', 'Bristol', 'Bristol', 'BS1 1FF', TRUE),
(8, '258 Castle Street', 'Edinburgh', 'Edinburgh', 'EH1 1GG', TRUE),
(9, '369 Bridge Road', 'Cardiff', 'Cardiff', 'CF1 1HH', TRUE);

-- =============================================
-- SEED INSTRUCTOR PROFILES
-- =============================================

INSERT INTO instructor_profiles (user_id, adi_number, adi_expiry_date, driving_license_number, driving_license_expiry, years_experience, hourly_rate, transmission_type, specialty, bio, languages_spoken, nationality, religion, ethnicity, dbs_check_status, insurance_provider, insurance_expiry_date, is_approved, rating_average, total_reviews, pass_rate) VALUES
(1, 'ADI123456', '2025-12-31', 'JOHNS851234567890', '2030-03-15', 8, 35.00, 'both', 'Nervous Drivers', 'Patient and understanding instructor specializing in helping nervous drivers build confidence.', 'English', 'British', 'Christian', 'White British', 'clear', 'AA Insurance', '2024-12-31', TRUE, 4.9, 127, 92.5),
(2, 'ADI234567', '2025-11-30', 'HASSA801234567890', '2029-07-22', 12, 40.00, 'manual', 'Test Preparation', 'Experienced instructor with high first-time pass rates. Expert in test preparation and advanced techniques.', 'English, Arabic', 'British', 'Muslim', 'Asian British', 'clear', 'Direct Line', '2024-11-30', TRUE, 4.8, 203, 94.2),
(3, 'ADI345678', '2025-10-31', 'WILLI881234567890', '2031-11-08', 6, 45.00, 'automatic', 'Intensive Courses', 'Friendly instructor offering intensive driving courses for quick learners. Modern teaching methods.', 'English', 'British', 'Christian', 'White British', 'clear', 'Aviva', '2024-10-31', TRUE, 4.7, 89, 89.3),
(4, 'ADI456789', '2025-09-30', 'PATEL751234567890', '2028-12-03', 15, 38.00, 'both', 'Beginner Friendly', 'Highly experienced instructor with a calm approach. Perfect for absolute beginners and mature learners.', 'English, Hindi, Gujarati', 'British', 'Hindu', 'Indian British', 'clear', 'Churchill', '2024-09-30', TRUE, 4.9, 245, 96.1),
(5, 'ADI567890', '2025-08-31', 'RODRI821234567890', '2030-05-18', 10, 42.00, 'manual', 'Multilingual', 'Bilingual instructor (English/Spanish) with excellent communication skills. Great with international students.', 'English, Spanish', 'Spanish', 'Catholic', 'Hispanic', 'clear', 'LV Insurance', '2024-08-31', TRUE, 4.8, 156, 91.7),
(6, 'ADI678901', '2025-07-31', 'THOMP791234567890', '2027-09-12', 7, 36.00, 'automatic', 'Senior Learners', 'Patient instructor specializing in teaching senior learners. Flexible approach tailored to individual needs.', 'English', 'British', 'Christian', 'White British', 'clear', 'Admiral', '2024-07-31', TRUE, 4.6, 98, 87.4),
(7, 'ADI789012', '2025-06-30', 'SINGH861234567890', '2029-01-25', 9, 39.00, 'both', 'Female Learners', 'Experienced female instructor specializing in teaching female learners. Creates a comfortable learning environment.', 'English, Punjabi', 'British', 'Sikh', 'Indian British', 'clear', 'Hastings Direct', '2024-06-30', TRUE, 4.9, 178, 94.8),
(8, 'ADI890123', '2025-05-31', 'CHEN831234567890', '2031-04-30', 11, 41.00, 'manual', 'Advanced Skills', 'Expert instructor focusing on advanced driving skills and motorway confidence. High pass rates.', 'English, Mandarin', 'British', 'Buddhist', 'Chinese British', 'clear', 'Zurich', '2024-05-31', TRUE, 4.8, 134, 93.6),
(9, 'ADI901234', '2025-04-30', 'MURPH901234567890', '2032-08-14', 5, 37.00, 'automatic', 'Young Learners', 'Energetic instructor who connects well with young learners. Makes learning fun and engaging.', 'English', 'British', 'Christian', 'White British', 'clear', 'More Than', '2024-04-30', TRUE, 4.7, 76, 88.9);

-- =============================================
-- SEED INSTRUCTOR VEHICLES
-- =============================================

INSERT INTO instructor_vehicles (instructor_id, make, model, year, registration, transmission, fuel_type, color, is_dual_control, is_primary, mot_expiry, insurance_expiry) VALUES
(1, 'Vauxhall', 'Corsa', 2022, 'SJ22 ABC', 'manual', 'petrol', 'White', TRUE, TRUE, '2024-12-15', '2024-12-31'),
(1, 'Vauxhall', 'Corsa', 2021, 'SJ21 DEF', 'automatic', 'petrol', 'Silver', TRUE, FALSE, '2024-11-20', '2024-12-31'),
(2, 'Ford', 'Fiesta', 2023, 'AH23 GHI', 'manual', 'petrol', 'Blue', TRUE, TRUE, '2025-01-10', '2024-11-30'),
(3, 'Nissan', 'Micra', 2022, 'EW22 JKL', 'automatic', 'petrol', 'Red', TRUE, TRUE, '2024-10-25', '2024-10-31'),
(4, 'Toyota', 'Yaris', 2023, 'RP23 MNO', 'manual', 'hybrid', 'White', TRUE, TRUE, '2025-02-14', '2024-09-30'),
(4, 'Toyota', 'Yaris', 2022, 'RP22 PQR', 'automatic', 'hybrid', 'Grey', TRUE, FALSE, '2024-12-08', '2024-09-30'),
(5, 'Peugeot', '208', 2023, 'MR23 STU', 'manual', 'petrol', 'Black', TRUE, TRUE, '2025-03-05', '2024-08-31'),
(6, 'Hyundai', 'i20', 2022, 'JT22 VWX', 'automatic', 'petrol', 'White', TRUE, TRUE, '2024-11-18', '2024-07-31'),
(7, 'Kia', 'Picanto', 2023, 'PB23 YZA', 'manual', 'petrol', 'Yellow', TRUE, TRUE, '2025-01-22', '2024-06-30'),
(7, 'Kia', 'Picanto', 2022, 'PB22 BCD', 'automatic', 'petrol', 'Blue', TRUE, FALSE, '2024-10-30', '2024-06-30'),
(8, 'Volkswagen', 'Polo', 2023, 'DC23 EFG', 'manual', 'petrol', 'Silver', TRUE, TRUE, '2025-02-28', '2024-05-31'),
(9, 'Seat', 'Ibiza', 2022, 'LM22 HIJ', 'automatic', 'petrol', 'Orange', TRUE, TRUE, '2024-12-12', '2024-04-30');

-- =============================================
-- SEED INSTRUCTOR AVAILABILITY
-- =============================================

INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time, is_available) VALUES
-- Sarah Johnson (ID: 1) - Mon-Fri: 9AM-6PM
(1, 'monday', '09:00:00', '18:00:00', TRUE),
(1, 'tuesday', '09:00:00', '18:00:00', TRUE),
(1, 'wednesday', '09:00:00', '18:00:00', TRUE),
(1, 'thursday', '09:00:00', '18:00:00', TRUE),
(1, 'friday', '09:00:00', '18:00:00', TRUE),

-- Ahmed Hassan (ID: 2) - Mon-Sat: 8AM-7PM
(2, 'monday', '08:00:00', '19:00:00', TRUE),
(2, 'tuesday', '08:00:00', '19:00:00', TRUE),
(2, 'wednesday', '08:00:00', '19:00:00', TRUE),
(2, 'thursday', '08:00:00', '19:00:00', TRUE),
(2, 'friday', '08:00:00', '19:00:00', TRUE),
(2, 'saturday', '08:00:00', '19:00:00', TRUE),

-- Emma Williams (ID: 3) - Tue-Sun: 10AM-8PM
(3, 'tuesday', '10:00:00', '20:00:00', TRUE),
(3, 'wednesday', '10:00:00', '20:00:00', TRUE),
(3, 'thursday', '10:00:00', '20:00:00', TRUE),
(3, 'friday', '10:00:00', '20:00:00', TRUE),
(3, 'saturday', '10:00:00', '20:00:00', TRUE),
(3, 'sunday', '10:00:00', '20:00:00', TRUE);

-- =============================================
-- SEED INSTRUCTOR SERVICE AREAS
-- =============================================

INSERT INTO instructor_service_areas (instructor_id, city, postcode_prefix, travel_radius_miles, additional_charge) VALUES
(1, 'Manchester', 'M', 15, 0.00),
(1, 'Salford', 'M', 10, 2.00),
(1, 'Stockport', 'SK', 12, 3.00),
(2, 'Birmingham', 'B', 20, 0.00),
(2, 'Solihull', 'B', 15, 2.50),
(2, 'West Bromwich', 'WS', 18, 3.50),
(3, 'London', 'SW', 25, 0.00),
(3, 'London', 'SE', 20, 1.00),
(3, 'London', 'W', 15, 2.00),
(4, 'Leicester', 'LE', 18, 0.00),
(4, 'Loughborough', 'LE', 12, 4.00),
(5, 'Liverpool', 'L', 16, 0.00),
(5, 'Birkenhead', 'CH', 14, 3.00);

-- =============================================
-- SEED COURSE STATISTICS
-- =============================================

INSERT INTO course_statistics (course_id, registered_students, completed_students, pass_rate, average_rating, total_reviews) VALUES
(1, 1247, 1148, 92.06, 4.8, 892),
(2, 892, 839, 94.06, 4.7, 654),
(3, 634, 608, 95.90, 4.9, 478),
(4, 423, 415, 98.11, 4.9, 321);

-- =============================================
-- SEED EMAIL TEMPLATES
-- =============================================

INSERT INTO email_templates (template_name, subject, html_content, text_content, variables) VALUES
('welcome_learner', 'Welcome to DriveConnect UK!', 
'<h1>Welcome {{first_name}}!</h1><p>Thank you for joining DriveConnect UK. We are excited to help you on your driving journey.</p>', 
'Welcome {{first_name}}! Thank you for joining DriveConnect UK. We are excited to help you on your driving journey.',
'["first_name", "last_name", "email"]'),

('welcome_instructor', 'Welcome to DriveConnect UK - Instructor', 
'<h1>Welcome {{first_name}}!</h1><p>Thank you for joining DriveConnect UK as an instructor. Your application is being reviewed.</p>', 
'Welcome {{first_name}}! Thank you for joining DriveConnect UK as an instructor. Your application is being reviewed.',
'["first_name", "last_name", "email", "adi_number"]'),

('booking_confirmation', 'Booking Confirmation - {{course_title}}', 
'<h1>Booking Confirmed!</h1><p>Your booking for {{course_title}} has been confirmed. Reference: {{booking_reference}}</p>', 
'Booking Confirmed! Your booking for {{course_title}} has been confirmed. Reference: {{booking_reference}}',
'["first_name", "course_title", "booking_reference", "instructor_name", "total_amount"]'),

('lesson_reminder', 'Lesson Reminder - Tomorrow at {{lesson_time}}', 
'<h1>Lesson Reminder</h1><p>You have a driving lesson tomorrow at {{lesson_time}} with {{instructor_name}}.</p>', 
'Lesson Reminder: You have a driving lesson tomorrow at {{lesson_time}} with {{instructor_name}}.',
'["first_name", "lesson_time", "instructor_name", "pickup_location"]');

-- =============================================
-- SEED SAMPLE LEARNERS
-- =============================================

INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, date_of_birth, gender, is_active, email_verified) VALUES
('john.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'learner', 'John', 'Smith', '+44 7700 800001', '1995-06-15', 'male', TRUE, TRUE),
('emily.brown@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'learner', 'Emily', 'Brown', '+44 7700 800002', '1998-09-22', 'female', TRUE, TRUE),
('michael.davis@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'learner', 'Michael', 'Davis', '+44 7700 800003', '1992-12-08', 'male', TRUE, TRUE);

-- =============================================
-- SEED LEARNER ADDRESSES
-- =============================================

INSERT INTO addresses (user_id, address_line_1, city, county, postcode, is_primary) VALUES
(10, '45 Victoria Road', 'Manchester', 'Greater Manchester', 'M14 5AB', TRUE),
(11, '78 Station Street', 'Birmingham', 'West Midlands', 'B5 6CD', TRUE),
(12, '92 Garden Lane', 'London', 'Greater London', 'SW2 3EF', TRUE);

-- =============================================
-- SEED LEARNER PROFILES
-- =============================================

INSERT INTO learner_profiles (user_id, provisional_license_number, theory_test_passed, previous_experience, preferred_transmission, preferred_instructor_gender, budget_per_hour, learning_goals, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship) VALUES
(10, 'SMITH951234567890', FALSE, 'none', 'manual', 'no_preference', 35.00, 'Want to pass my test within 6 months and gain confidence driving in city traffic.', 'Mary Smith', '+44 7700 800011', 'Mother'),
(11, 'BROWN981234567890', TRUE, 'some', 'automatic', 'female', 40.00, 'Failed my test once, need to improve parking and build confidence.', 'Robert Brown', '+44 7700 800012', 'Father'),
(12, 'DAVIS921234567890', TRUE, 'failed_test', 'manual', 'no_preference', 38.00, 'Need intensive course to pass quickly for new job.', 'Sarah Davis', '+44 7700 800013', 'Wife');

-- =============================================
-- SEED SAMPLE BOOKINGS
-- =============================================

INSERT INTO bookings (booking_reference, learner_id, instructor_id, course_id, transmission_type, total_hours, hourly_rate, total_amount, amount_paid, payment_status, booking_status, start_date, estimated_completion_date) VALUES
('BK2024001', 1, 1, 1, 'manual', 45, 35.00, 1575.00, 1575.00, 'paid', 'in_progress', '2024-01-15', '2024-04-15'),
('BK2024002', 2, 2, 2, 'automatic', 35, 40.00, 1400.00, 700.00, 'partial', 'confirmed', '2024-02-01', '2024-05-01'),
('BK2024003', 3, 4, 3, 'manual', 25, 38.00, 950.00, 950.00, 'paid', 'completed', '2023-11-01', '2024-01-30');

-- =============================================
-- SEED SAMPLE REVIEWS
-- =============================================

INSERT INTO reviews (booking_id, reviewer_type, reviewer_id, reviewee_id, rating, title, review_text, is_featured, is_approved, is_public) VALUES
(1, 'learner', 10, 1, 5, 'Excellent instructor!', 'Sarah was incredibly patient and helped me build confidence from day one. Her teaching methods are clear and effective.', TRUE, TRUE, TRUE),
(2, 'learner', 11, 2, 5, 'Highly recommended', 'Ahmed is a fantastic instructor with great knowledge of test routes. Passed first time thanks to his guidance!', TRUE, TRUE, TRUE),
(3, 'learner', 12, 4, 5, 'Perfect for beginners', 'Raj made learning to drive enjoyable and stress-free. His calm approach really helped with my nerves.', FALSE, TRUE, TRUE);
