-- DriveConnect UK Optimized Database Schema for SAAS Platform
-- Focus: Learner-Instructor Management (Excluding Vehicle Management)
-- MySQL Database Structure

-- Create Database
CREATE DATABASE IF NOT EXISTS driveconnect_saas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE driveconnect_saas;

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table (base table for learners, instructors, and admins)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('learner', 'instructor', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_created_at (created_at)
);

-- Addresses table
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100),
    postcode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'United Kingdom',
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_city (city),
    INDEX idx_postcode (postcode)
);

-- =============================================
-- INSTRUCTOR SPECIFIC TABLES
-- =============================================

-- Instructor profiles
CREATE TABLE instructor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    adi_number VARCHAR(50) UNIQUE NOT NULL,
    adi_expiry_date DATE NOT NULL,
    driving_license_number VARCHAR(50) NOT NULL,
    driving_license_expiry DATE NOT NULL,
    years_experience INT NOT NULL,
    hourly_rate DECIMAL(6,2) NOT NULL,
    transmission_type ENUM('manual', 'automatic', 'both') NOT NULL,
    specialty TEXT,
    bio TEXT,
    languages_spoken VARCHAR(255),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    ethnicity VARCHAR(100),
    dbs_check_status ENUM('clear', 'pending', 'expired') DEFAULT 'pending',
    dbs_check_date DATE,
    insurance_provider VARCHAR(255),
    insurance_expiry_date DATE,
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date DATETIME,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    pass_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_adi_number (adi_number),
    INDEX idx_rating (rating_average),
    INDEX idx_hourly_rate (hourly_rate),
    INDEX idx_transmission (transmission_type),
    INDEX idx_approved (is_approved)
);

-- Instructor availability
CREATE TABLE instructor_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (instructor_id) REFERENCES instructor_profiles(id) ON DELETE CASCADE,
    INDEX idx_instructor_day (instructor_id, day_of_week),
    UNIQUE KEY unique_instructor_day_time (instructor_id, day_of_week, start_time, end_time)
);

-- Instructor service areas
CREATE TABLE instructor_service_areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    instructor_id INT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode_prefix VARCHAR(5),
    travel_radius_miles INT DEFAULT 10,
    additional_charge DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (instructor_id) REFERENCES instructor_profiles(id) ON DELETE CASCADE,
    INDEX idx_instructor_id (instructor_id),
    INDEX idx_city (city),
    INDEX idx_postcode (postcode_prefix)
);

-- =============================================
-- LEARNER SPECIFIC TABLES
-- =============================================

-- Learner profiles
CREATE TABLE learner_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    provisional_license_number VARCHAR(50),
    provisional_license_date DATE,
    theory_test_passed BOOLEAN DEFAULT FALSE,
    theory_test_date DATE,
    theory_test_expiry DATE,
    previous_experience ENUM('none', 'some', 'failed_test', 'refresher') DEFAULT 'none',
    preferred_transmission ENUM('manual', 'automatic') NOT NULL,
    preferred_instructor_gender ENUM('male', 'female', 'no_preference') DEFAULT 'no_preference',
    preferred_languages VARCHAR(255),
    budget_per_hour DECIMAL(5,2),
    learning_goals TEXT,
    special_requirements TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_transmission (preferred_transmission),
    INDEX idx_theory_passed (theory_test_passed)
);

-- Learner availability preferences
CREATE TABLE learner_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    learner_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    preferred_time ENUM('morning', 'afternoon', 'evening', 'flexible') NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (learner_id) REFERENCES learner_profiles(id) ON DELETE CASCADE,
    INDEX idx_learner_day (learner_id, day_of_week)
);

-- =============================================
-- COURSE TABLES
-- =============================================

-- Course packages
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon_class VARCHAR(100),
    min_hours INT NOT NULL,
    max_hours INT NOT NULL,
    base_price DECIMAL(8,2) NOT NULL,
    transmission_type ENUM('manual', 'automatic', 'both') NOT NULL,
    difficulty_level ENUM('absolute_beginner', 'beginner', 'intermediate', 'advanced') NOT NULL,
    features JSON,
    full_features JSON,
    why_choose TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_transmission (transmission_type),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);

-- Course statistics (for live stats display)
CREATE TABLE course_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    registered_students INT DEFAULT 0,
    completed_students INT DEFAULT 0,
    pass_rate DECIMAL(5,2) DEFAULT 0.00,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_stats (course_id)
);

-- =============================================
-- BOOKING AND LESSON TABLES
-- =============================================

-- Bookings (course enrollments)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    learner_id INT NOT NULL,
    instructor_id INT NOT NULL,
    course_id INT NOT NULL,
    transmission_type ENUM('manual', 'automatic') NOT NULL,
    total_hours INT NOT NULL,
    hourly_rate DECIMAL(6,2) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    amount_paid DECIMAL(8,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    booking_status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (learner_id) REFERENCES learner_profiles(id),
    FOREIGN KEY (instructor_id) REFERENCES instructor_profiles(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    INDEX idx_booking_ref (booking_reference),
    INDEX idx_learner (learner_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_status (booking_status),
    INDEX idx_dates (start_date, estimated_completion_date)
);

-- Individual lessons
CREATE TABLE lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    lesson_number INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_start_time TIME NOT NULL,
    scheduled_end_time TIME NOT NULL,
    actual_start_time DATETIME,
    actual_end_time DATETIME,
    pickup_location VARCHAR(500),
    dropoff_location VARCHAR(500),
    lesson_type ENUM('standard', 'test_preparation', 'mock_test', 'practical_test') DEFAULT 'standard',
    lesson_status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    instructor_notes TEXT,
    learner_feedback TEXT,
    skills_practiced JSON,
    areas_for_improvement JSON,
    lesson_rating INT CHECK (lesson_rating >= 1 AND lesson_rating <= 5),
    weather_conditions VARCHAR(100),
    traffic_conditions VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_status (lesson_status),
    INDEX idx_lesson_number (booking_id, lesson_number),
    UNIQUE KEY unique_booking_lesson (booking_id, lesson_number)
);

-- =============================================
-- REVIEW AND RATING TABLES
-- =============================================

-- Reviews and testimonials
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    reviewer_type ENUM('learner', 'instructor') NOT NULL,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at DATETIME,
    is_public BOOLEAN DEFAULT TRUE,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    INDEX idx_reviewee (reviewee_id),
    INDEX idx_rating (rating),
    INDEX idx_featured (is_featured),
    INDEX idx_approved (is_approved),
    INDEX idx_public (is_public),
    UNIQUE KEY unique_booking_reviewer (booking_id, reviewer_id)
);

-- =============================================
-- SYSTEM TABLES FOR SAAS MANAGEMENT
-- =============================================

-- Form submissions (for managing visitor inquiries and registrations)
CREATE TABLE form_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_type ENUM('learner_inquiry', 'instructor_inquiry', 'contact', 'newsletter', 'booking_request') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    form_data JSON, -- Store additional form fields dynamically
    submission_source VARCHAR(100), -- 'website', 'landing_page', etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('new', 'contacted', 'converted', 'spam', 'archived') DEFAULT 'new',
    assigned_to INT, -- Admin user who handles this inquiry
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_form_type (form_type),
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- System notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('booking', 'lesson', 'payment', 'review', 'system', 'marketing') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_type (type),
    INDEX idx_created (created_at)
);

-- Email templates for automated communications
CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (template_name),
    INDEX idx_active (is_active)
);

-- System settings for dashboard configuration
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'general',
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_public (is_public)
);

-- Admin activity log for SAAS management
CREATE TABLE admin_activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'user', 'booking', 'setting', etc.
    resource_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin (admin_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created (created_at)
);

-- Frontend content management for dashboard
CREATE TABLE frontend_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(100) NOT NULL, -- 'hero', 'features', 'testimonials', etc.
    content_key VARCHAR(100) NOT NULL,
    content_type ENUM('text', 'html', 'image', 'json', 'number') NOT NULL,
    content_value TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    last_modified_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (last_modified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_section (section),
    INDEX idx_key (content_key),
    INDEX idx_active (is_active),
    UNIQUE KEY unique_section_key (section, content_key)
);

-- =============================================
-- VIEWS FOR COMMON DASHBOARD QUERIES
-- =============================================

-- Instructor dashboard summary
CREATE VIEW instructor_dashboard_summary AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    ip.adi_number,
    ip.years_experience,
    ip.hourly_rate,
    ip.transmission_type,
    ip.specialty,
    ip.rating_average,
    ip.total_reviews,
    ip.pass_rate,
    a.city,
    a.postcode,
    GROUP_CONCAT(DISTINCT isa.city) as service_areas,
    ip.is_approved,
    u.is_active,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.booking_status = 'completed' THEN b.id END) as completed_bookings,
    COUNT(DISTINCT CASE WHEN l.lesson_status = 'completed' THEN l.id END) as total_lessons_taught
FROM users u
JOIN instructor_profiles ip ON u.id = ip.user_id
LEFT JOIN addresses a ON u.id = a.user_id AND a.is_primary = TRUE
LEFT JOIN instructor_service_areas isa ON ip.id = isa.instructor_id
LEFT JOIN bookings b ON ip.id = b.instructor_id
LEFT JOIN lessons l ON b.id = l.booking_id
WHERE u.user_type = 'instructor'
GROUP BY u.id;

-- Learner dashboard summary
CREATE VIEW learner_dashboard_summary AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    lp.theory_test_passed,
    lp.preferred_transmission,
    lp.budget_per_hour,
    a.city,
    a.postcode,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.booking_status = 'completed' THEN b.id END) as completed_courses,
    COUNT(DISTINCT CASE WHEN l.lesson_status = 'completed' THEN l.id END) as total_lessons_taken,
    AVG(l.lesson_rating) as average_lesson_rating
FROM users u
JOIN learner_profiles lp ON u.id = lp.user_id
LEFT JOIN addresses a ON u.id = a.user_id AND a.is_primary = TRUE
LEFT JOIN bookings b ON lp.id = b.learner_id
LEFT JOIN lessons l ON b.id = l.booking_id
WHERE u.user_type = 'learner'
GROUP BY u.id;

-- Admin dashboard metrics
CREATE VIEW admin_dashboard_metrics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE user_type = 'learner' AND is_active = TRUE) as total_learners,
    (SELECT COUNT(*) FROM users WHERE user_type = 'instructor' AND is_active = TRUE) as total_instructors,
    (SELECT COUNT(*) FROM instructor_profiles WHERE is_approved = TRUE) as approved_instructors,
    (SELECT COUNT(*) FROM bookings WHERE booking_status = 'confirmed') as active_bookings,
    (SELECT COUNT(*) FROM lessons WHERE lesson_status = 'completed') as completed_lessons,
    (SELECT COUNT(*) FROM form_submissions WHERE status = 'new') as new_inquiries,
    (SELECT SUM(total_amount) FROM bookings WHERE payment_status = 'paid') as total_revenue;

-- =============================================
-- STORED PROCEDURES FOR BUSINESS LOGIC
-- =============================================

DELIMITER //

-- Update instructor rating and statistics
CREATE PROCEDURE UpdateInstructorStats(IN instructor_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE review_count INT;
    DECLARE lesson_count INT;
    
    -- Calculate average rating
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE reviewee_id = instructor_id AND is_approved = TRUE;
    
    -- Count total lessons taught
    SELECT COUNT(DISTINCT l.id)
    INTO lesson_count
    FROM lessons l
    JOIN bookings b ON l.booking_id = b.id
    WHERE b.instructor_id = instructor_id AND l.lesson_status = 'completed';
    
    -- Update instructor profile
    UPDATE instructor_profiles 
    SET rating_average = COALESCE(avg_rating, 0.00),
        total_reviews = COALESCE(review_count, 0),
        total_lessons = COALESCE(lesson_count, 0)
    WHERE id = instructor_id;
END //

-- Process form submission and create notification
CREATE PROCEDURE ProcessFormSubmission(
    IN form_type VARCHAR(50),
    IN submission_data JSON,
    IN admin_user_id INT
)
BEGIN
    DECLARE submission_id INT;
    
    -- Insert form submission
    INSERT INTO form_submissions (form_type, form_data, status)
    VALUES (form_type, submission_data, 'new');
    
    SET submission_id = LAST_INSERT_ID();
    
    -- Create notification for admin
    INSERT INTO notifications (user_id, type, title, message, action_url)
    VALUES (
        admin_user_id, 
        'system', 
        CONCAT('New ', form_type, ' submission'),
        CONCAT('A new form submission has been received and requires attention.'),
        CONCAT('/admin/submissions/', submission_id)
    );
END //

DELIMITER ;

-- =============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================

-- Enhanced composite indexes for dashboard queries
CREATE INDEX idx_instructor_performance ON instructor_profiles(is_approved, rating_average DESC, total_reviews DESC);
CREATE INDEX idx_booking_analytics ON bookings(booking_status, payment_status, created_at);
CREATE INDEX idx_lesson_tracking ON lessons(lesson_status, scheduled_date, booking_id);
CREATE INDEX idx_form_management ON form_submissions(status, form_type, created_at);
CREATE INDEX idx_user_management ON users(user_type, is_active, created_at);

-- Full-text search for content management
ALTER TABLE instructor_profiles ADD FULLTEXT(bio, specialty);
ALTER TABLE courses ADD FULLTEXT(title, description);
ALTER TABLE reviews ADD FULLTEXT(title, review_text);
ALTER TABLE frontend_content ADD FULLTEXT(content_value);

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert default admin user
INSERT INTO users (email, password_hash, user_type, first_name, last_name, is_active, email_verified)
VALUES ('admin@driveconnect.uk', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewHvzQTJ.CySxHYa', 'admin', 'System', 'Administrator', TRUE, TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('site_name', 'DriveConnect UK', 'string', 'Website name displayed in dashboard', 'general'),
('default_lesson_duration', '60', 'number', 'Default lesson duration in minutes', 'booking'),
('max_advance_booking_days', '30', 'number', 'Maximum days in advance lessons can be booked', 'booking'),
('admin_notifications_enabled', 'true', 'boolean', 'Enable admin notifications for new submissions', 'notifications'),
('learner_auto_approval', 'true', 'boolean', 'Auto-approve learner registrations', 'registration'),
('instructor_manual_approval', 'true', 'boolean', 'Require manual approval for instructors', 'registration');