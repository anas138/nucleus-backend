-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: nucleus_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.23-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `global_settings_types`
--

DROP TABLE IF EXISTS `global_settings_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `global_settings_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `constant` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `record_status` enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_d3434cda6deaee56f8307afffa0` (`name`),
  UNIQUE KEY `UQ_2e95b2d669ef7d70b88c8b68e40` (`constant`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_settings_types`
--

LOCK TABLES `global_settings_types` WRITE;
/*!40000 ALTER TABLE `global_settings_types` DISABLE KEYS */;
INSERT INTO `global_settings_types` VALUES (1,'CRM Web App Version','CRM_WEB_APP_VERSION','CRM Web application build version, so that we can keep users updated and notify in case of any build update','ACTIVE','2023-12-18 07:57:00','2023-12-18 07:57:00');
/*!40000 ALTER TABLE `global_settings_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `global_settings`
--

DROP TABLE IF EXISTS `global_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `global_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `global_setting_type_id` int(11) NOT NULL,
  `condition_value` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `value_datatype` enum('NUMBER','STRING','BOOLEAN','ARRAY') NOT NULL,
  `record_status` enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `sequence` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_6b3c9020164e507d6c96cb12d3a` (`global_setting_type_id`),
  CONSTRAINT `FK_6b3c9020164e507d6c96cb12d3a` FOREIGN KEY (`global_setting_type_id`) REFERENCES `global_settings_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_settings`
--

LOCK TABLES `global_settings` WRITE;
/*!40000 ALTER TABLE `global_settings` DISABLE KEYS */;
INSERT INTO `global_settings` VALUES (1,1,'','app_version','1.0.6','STRING','ACTIVE',1,'2023-12-18 07:57:00','2023-12-18 09:23:25'),(7,6,'','app_version','1.0.4','STRING','ACTIVE',1,'2023-12-18 10:47:14','2023-12-18 10:47:14');
/*!40000 ALTER TABLE `global_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-19 10:21:01
