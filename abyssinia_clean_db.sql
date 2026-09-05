-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: cleaning_service_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_assignments`
--

DROP TABLE IF EXISTS `booking_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `cleaner_id` int NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assignment_status` enum('assigned','accepted','in_progress','completed','cancelled') DEFAULT 'assigned',
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `cleaner_id` (`cleaner_id`),
  CONSTRAINT `booking_assignments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `booking_assignments_ibfk_2` FOREIGN KEY (`cleaner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_assignments`
--

LOCK TABLES `booking_assignments` WRITE;
/*!40000 ALTER TABLE `booking_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `service_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `address` text NOT NULL,
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `square_footage` int DEFAULT NULL,
  `service_type` enum('Standard Clean','Deep Clean','Post-Construction','VIP Booking') NOT NULL DEFAULT 'Standard Clean',
  `addons` json DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'2026-07-20','10:00:00','Addis Ababa',NULL,NULL,NULL,'Standard Clean',NULL,'completed','2026-07-19 01:38:55'),(2,6,1,'2026-07-30','10:00:00','Bole, Addis Ababa',NULL,NULL,NULL,'Standard Clean',NULL,'cancelled','2026-07-24 01:03:54'),(3,7,1,'2026-08-10','10:00:00','Addis Ababa, Bole',NULL,NULL,NULL,'Standard Clean',NULL,'cancelled','2026-08-08 02:28:01'),(4,8,1,'2026-09-12','12:43:00','rkmkr',NULL,NULL,NULL,'Standard Clean',NULL,'cancelled','2026-08-26 12:53:45'),(5,8,1,'2027-02-01','12:03:00','nfrjn',NULL,NULL,NULL,'Standard Clean',NULL,'completed','2026-08-26 12:55:57'),(6,8,1,'2026-09-11','12:34:00','hayat',NULL,NULL,NULL,'Standard Clean',NULL,'cancelled','2026-08-27 08:41:34'),(7,8,1,'2027-06-08','07:08:00','texis',45,29,6754,'Post-Construction','[\"Inside Fridge\"]','completed','2026-08-27 09:09:20'),(8,10,1,'2026-09-05','10:00:00','Addis Ababa',2,1,1200,'Standard Clean','[\"Inside Fridge\"]','cancelled','2026-08-27 12:04:59'),(9,8,2,'2026-08-31','15:07:00','gikujyt',NULL,NULL,2970,'Standard Clean','[\"Inside Fridge\"]','cancelled','2026-08-31 11:14:24'),(10,8,2,'2026-10-09','16:07:00','bolearabsa',2,5,1200,'Standard Clean','[\"Window Washing\", \"Inside Oven\", \"Carpet Cleaning\", \"Inside Fridge\"]','pending','2026-09-01 12:00:58'),(11,8,2,'2026-09-04','14:05:00','lamberet',6,NULL,56,'Post-Construction','[\"Carpet Cleaning\"]','pending','2026-09-04 11:57:33');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','telebirr','cbe','chapa') NOT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,500.00,'cash','paid','2026-07-19 01:42:43'),(2,11,1000.00,'telebirr','paid','2026-09-04 13:24:45');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `booking_id` int NOT NULL,
  `receipt_number` varchar(50) NOT NULL,
  `issued_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_number` (`receipt_number`),
  KEY `fk_receipt_payment` (`payment_id`),
  KEY `fk_receipt_booking` (`booking_id`),
  CONSTRAINT `fk_receipt_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_receipt_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (1,2,11,'AC-1788528818144-5953','2026-09-04 13:33:38');
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration_hours` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Home Cleaning','Complete house cleaning including rooms, kitchen, and bathroom.',500.00,3,NULL,'available','2026-07-19 01:35:42'),(2,'Office Cleaning','Professional office and workplace cleaning service.',1000.00,5,NULL,'available','2026-07-19 01:35:42'),(3,'Carpet Cleaning','Deep carpet washing and stain removal service.',400.00,2,NULL,'available','2026-07-19 01:35:42'),(4,'Window Cleaning','Cleaning and polishing windows for homes and offices.',200.00,1,NULL,'available','2026-07-19 01:35:42'),(6,'Kitchen Cleaning','Professional kitchen cleaning',350.00,2,NULL,'available','2026-07-24 00:38:26');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','cleaner','admin','team_admin','mentor_admin') NOT NULL DEFAULT 'customer',
  `address` text,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Hanan Mahmud','hanan@gmail.com','0911111111','12345','customer','Addis Ababa',NULL,'2026-07-19 01:30:20'),(2,'Admin User','admin@gmail.com','0922222222','$2b$10$6.33FJgdVj6iicF5kjZcyuZfjbA5Dbu09qqIoGBUGb84SOosBIO0m','admin','Addis Ababa',NULL,'2026-07-19 01:30:20'),(5,'Abebe Kebede','abebe@gmail.com','0912345678','$2b$10$searmM4rmSlJhio5ByGiSOHuxmAls7a7UAXi10JY5zxSR02ArI1/i','customer','Addis Ababa',NULL,'2026-07-22 00:58:23'),(6,'Super Admin','admin2@gmail.com','0911111111','$2b$10$LWT9XWendKntPgCX3Fo1q.chqD05x7hqaS8H5GEXKo8Ost0qiBaLW','admin','Addis Ababa',NULL,'2026-07-24 00:35:27'),(7,'Hani','hani@example.com','0912345678','$2b$10$hpe/LHkTKm/D6nZrirK1IOeTcszRFuWp1qpTo1.ALw43HZUMpBxjO','customer','Addis Ababa',NULL,'2026-08-07 01:04:48'),(8,'Hanan Mahmud','hananbereka2025@gmail.com',NULL,'$2b$10$L8eG2U37XW0eIvmo77egNeAr.g7MJQw09tU4IZqRpEhElII4.MBfu','admin',NULL,'https://lh3.googleusercontent.com/a/ACg8ocIA4v4M7da29EsTH5awSpRKa9kmuUDw235B39kHtA4y7PEcXQ=s96-c','2026-08-26 11:34:44'),(9,'Test Customer','testcustomer2026@gmail.com','0912345678','$2b$10$Wq24OJZWRevDYOudi9saB.jrvFpMD.psb8lRRVOvsqSDzeJ25ZVA6','customer','Addis Ababa',NULL,'2026-08-27 11:42:54'),(10,'Test Customer','testcustomer2026_01@gmail.com','0912345679','$2b$10$EFTOnt9voWlds42fWRUpmul8WSd5revXCq.0QMvVkD4A7Nlc2CM8y','customer','Addis Ababa',NULL,'2026-08-27 11:44:44');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-05  6:06:14
