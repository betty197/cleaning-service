-- ============================================================================
-- CleanPro Management System - MySQL Workbench Database Initialization Script
-- Compatible with MySQL 8.0+ and MariaDB
-- Synchronizes frontend layouts, cleaner tracking, bookings, & settings
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `cleanpro_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_0900_ai_ci;

USE `cleanpro_db`;

-- Disable Foreign Key Checks for clean table creation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(25) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'customer', 'cleaner') NOT NULL DEFAULT 'customer',
  `address` VARCHAR(255) DEFAULT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. SERVICES CATALOG TABLE
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(120) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  `duration_hours` DECIMAL(5,2) DEFAULT '2.00',
  `image` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. CLEANERS ROSTER & TRACKING TABLE
DROP TABLE IF EXISTS `cleaners`;
CREATE TABLE `cleaners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `status` ENUM('Available', 'On Job', 'Off Duty') NOT NULL DEFAULT 'Available',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT '5.00',
  `completed_jobs` INT NOT NULL DEFAULT '0',
  `active_job` VARCHAR(255) DEFAULT 'None',
  `priority_rank` INT NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cleaners_email` (`email`),
  CONSTRAINT `fk_cleaners_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. BOOKINGS TABLE
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `cleaner_id` INT DEFAULT NULL,
  `booking_date` DATE NOT NULL,
  `booking_time` TIME NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `status` ENUM('Pending', 'Confirmed', 'In Progress', 'Completed', 'Canceled') NOT NULL DEFAULT 'Pending',
  `notes` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_customer` (`customer_id`),
  KEY `idx_bookings_service` (`service_id`),
  KEY `idx_bookings_cleaner` (`cleaner_id`),
  KEY `idx_bookings_status` (`status`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookings_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookings_cleaner` FOREIGN KEY (`cleaner_id`) REFERENCES `cleaners` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. PAYMENTS TABLE
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `booking_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
  `payment_status` ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Completed',
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payments_booking` (`booking_id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. CONTACT MESSAGES TABLE
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(25) DEFAULT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Replied', 'Archived') NOT NULL DEFAULT 'New',
  `admin_reply` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contact_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. SYSTEM SETTINGS & BACKUP REGISTRY
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA INSERTS
-- ============================================================================

-- Seed Users (Admin, Cleaners, Customers)
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `address`) VALUES
(1, 'Admin Manager', 'admin@cleanpro.com', '+1 (800) 555-0199', '$2b$10$w6B9N8Wd3X3t4g5h6j7k8u9i0o1p2a3s4d5f6g7h8j9k0l', 'admin', '123 Clean St, Suite 400, NY'),
(2, 'Betelhem Bogale', 'betelhem@example.com', '0912345678', '$2b$10$1234567890123456789012', 'customer', 'Addis Ababa'),
(3, 'Yeabsira Alemu', 'yeabsira@email.com', '0975112294', '$2b$10$1234567890123456789012', 'customer', 'Addis Ababa'),
(4, 'Dawit Worku', 'dawit.w@cleanpro.com', '0911234567', '$2b$10$1234567890123456789012', 'cleaner', 'Addis Ababa'),
(5, 'Tigist Alemu', 'tigist.a@cleanpro.com', '0922345678', '$2b$10$1234567890123456789012', 'cleaner', 'Addis Ababa');

-- Seed Services
INSERT INTO `services` (`id`, `service_name`, `description`, `price`, `duration_hours`, `image`, `status`) VALUES
(1, 'Home Cleaning', 'A thorough cleaning of bedrooms, living room, kitchen, and bathrooms. We dust, mop, and sanitize.', 800.00, 3.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80', 'Active'),
(2, 'Office Cleaning', 'Professional cleaning for workspaces, desks, restrooms, and reception areas.', 1200.00, 4.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'Active'),
(3, 'Deep Cleaning', 'Intensive top-to-bottom cleaning including cabinets, appliances, and hard-to-reach areas.', 2000.00, 6.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', 'Active'),
(4, 'Kitchen Cleaning', 'Specialized deep cleaning of stovetop, oven, sink, tiles, and countertops.', 600.00, 2.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', 'Active');

-- Seed Cleaners Roster
INSERT INTO `cleaners` (`id`, `user_id`, `full_name`, `email`, `phone`, `status`, `rating`, `completed_jobs`, `active_job`, `priority_rank`) VALUES
(1, 4, 'Dawit Worku', 'dawit.w@cleanpro.com', '+251 911 234 567', 'On Job', 4.90, 48, 'Booking #1 - Home Deep Clean', 1),
(2, 5, 'Tigist Alemu', 'tigist.a@cleanpro.com', '+251 922 345 678', 'Available', 4.80, 35, 'None', 2),
(3, NULL, 'Samuel Tadesse', 'samuel.t@cleanpro.com', '+251 933 456 789', 'Available', 4.95, 62, 'None', 3),
(4, NULL, 'Solomon Kebede', 'solomon.k@cleanpro.com', '+251 955 678 901', 'On Job', 5.00, 84, 'Booking #2 - Office Sanitization', 4);

-- Seed Bookings
INSERT INTO `bookings` (`id`, `customer_id`, `service_id`, `cleaner_id`, `booking_date`, `booking_time`, `address`, `status`) VALUES
(1, 2, 1, 1, '2026-09-30', '09:00:00', 'Bole, Addis Ababa', 'Confirmed'),
(2, 3, 2, 4, '2026-10-02', '14:00:00', 'Kazanchis, Addis Ababa', 'In Progress');

-- Seed Payments
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `payment_method`, `payment_status`, `payment_date`) VALUES
(1, 1, 800.00, 'Bank Transfer', 'Completed', '2026-09-29 10:00:00'),
(2, 2, 1200.00, 'Credit Card', 'Completed', '2026-09-29 11:30:00');

-- Seed Contact Messages
INSERT INTO `contact_messages` (`id`, `customer_id`, `name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 2, 'Betelhem Bogale', 'betelhem@example.com', '0912345678', 'Inquiry regarding deep cleaning', 'Can I schedule a deep clean for this Friday morning?', 'New');

-- Seed Default Settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('site_name', 'CleanPro Cleaning Services'),
('currency', 'USD ($)'),
('tax_rate', '8.5'),
('theme_mode', 'light');

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
