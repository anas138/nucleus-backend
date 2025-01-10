-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: nucleus_listener
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

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
-- Table structure for table `drop_down_category`
--

DROP TABLE IF EXISTS `drop_down_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drop_down_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `constant` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `record_status` enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4a1583fd59fa824e15e0be005d` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drop_down_category`
--

LOCK TABLES `drop_down_category` WRITE;
/*!40000 ALTER TABLE `drop_down_category` DISABLE KEYS */;
INSERT INTO `drop_down_category` VALUES (1,'Observium Alarm Severity','OBS_ALARM_SEVERITY',NULL,'ACTIVE','2023-08-09 17:33:07.267044','2023-08-09 17:35:09.820052'),(2,'Nce Alarm Severity','NCE_ALARM_SEVERITY',NULL,'ACTIVE','2023-08-09 17:33:49.693608','2023-08-09 17:35:09.830076'),(3,'Alarm Status','ALARM_STATUS',NULL,'ACTIVE','2023-08-09 17:34:11.395623','2023-08-09 17:35:09.834497'),(5,'Nce Alarm Field Names','NCE_ALARM_FIELD_NAMES',NULL,'ACTIVE','2023-08-18 14:49:17.975582','2023-08-18 14:49:17.975582'),(6,'Observium Alarm Field Names','OBS_ALARM_FIELD_NAMES',NULL,'ACTIVE','2023-08-18 14:50:52.710230','2023-08-18 14:50:52.710230'),(7,'Alarm Filter Search Criteria','ALARM_FILTER_ADVANCED_CONDITION_SEARCH_CRITERIA',NULL,'ACTIVE','2023-08-18 14:50:52.720244','2023-08-18 14:50:52.720244');
/*!40000 ALTER TABLE `drop_down_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drop_down_item`
--

DROP TABLE IF EXISTS `drop_down_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drop_down_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `sequence` int(11) DEFAULT NULL,
  `dd_category_id` int(11) NOT NULL,
  `record_status` enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_60db51b9090c8e0a4337166ed09` (`dd_category_id`),
  CONSTRAINT `FK_60db51b9090c8e0a4337166ed09` FOREIGN KEY (`dd_category_id`) REFERENCES `drop_down_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drop_down_item`
--

LOCK TABLES `drop_down_item` WRITE;
/*!40000 ALTER TABLE `drop_down_item` DISABLE KEYS */;
INSERT INTO `drop_down_item` VALUES (2,'Critical',1,2,'ACTIVE','2023-08-10 11:24:57.119542','2023-08-10 11:24:57.119542'),(3,'Major',2,2,'ACTIVE','2023-08-10 11:25:32.932953','2023-08-10 11:25:32.932953'),(4,'Minor',3,2,'ACTIVE','2023-08-10 11:25:32.942967','2023-08-10 11:25:32.942967'),(5,'Critical',1,1,'ACTIVE','2023-08-10 11:26:35.872663','2023-08-10 11:26:35.872663'),(6,'Warning',2,1,'ACTIVE','2023-08-10 11:34:55.689295','2023-08-10 11:34:55.689295'),(7,'cleared',1,3,'ACTIVE','2023-08-10 11:35:44.302567','2023-08-10 14:38:00.010685'),(8,'uncleared',2,3,'ACTIVE','2023-08-10 11:36:08.714560','2023-08-10 14:38:00.020891'),(9,'location_info',1,5,'ACTIVE','2023-08-18 15:25:47.039638','2023-08-18 15:25:47.039638'),(10,'native_probable_cause',2,5,'ACTIVE','2023-08-18 15:25:47.051310','2023-08-18 15:25:47.051310'),(11,'probable_cause',3,5,'ACTIVE','2023-08-18 15:25:47.055028','2023-08-18 15:25:47.055028'),(12,'md_name',4,5,'ACTIVE','2023-08-18 15:25:47.058756','2023-08-18 15:25:47.058756'),(13,'fiber_name',5,5,'ACTIVE','2023-08-18 15:25:47.061296','2023-08-18 15:25:47.061296'),(14,'ason_obj_name',6,5,'ACTIVE','2023-08-18 15:25:47.063812','2023-08-18 15:25:47.063812'),(15,'other_info',7,5,'ACTIVE','2023-08-18 15:25:47.065842','2023-08-18 15:25:47.065842'),(16,'trail_name',8,5,'ACTIVE','2023-08-18 15:25:47.068052','2023-08-18 15:25:47.068052'),(21,'alert_message',1,6,'ACTIVE','2023-08-18 15:27:45.786366','2023-08-18 15:27:45.786366'),(22,'contains',1,7,'ACTIVE','2023-08-18 15:28:29.783243','2023-08-18 15:28:29.783243'),(23,'like',2,7,'ACTIVE','2023-08-18 15:28:29.946484','2023-08-18 15:28:29.946484'),(24,'includes',3,7,'ACTIVE','2023-08-18 15:28:29.954994','2023-08-18 15:28:29.954994');
/*!40000 ALTER TABLE `drop_down_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-18 16:18:03
