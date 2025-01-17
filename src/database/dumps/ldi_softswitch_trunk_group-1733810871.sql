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
-- Table structure for table `ldi_softswitch_trunk_group`
--

DROP TABLE IF EXISTS `ldi_softswitch_trunk_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ldi_softswitch_trunk_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trunk_name` varchar(255) NOT NULL,
  `peer_end_ip` varchar(255) NOT NULL,
  `ldi_ip` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `record_status` enum('ACTIVE','INACTIVE','DELETED','DRAFT') DEFAULT 'ACTIVE',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ldi_softswitch_trunk_group`
--

LOCK TABLES `ldi_softswitch_trunk_group` WRITE;
/*!40000 ALTER TABLE `ldi_softswitch_trunk_group` DISABLE KEYS */;
INSERT INTO `ldi_softswitch_trunk_group` VALUES (1,'Acmetel','178.22.14.14','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(2,'DGS_INTL','178.22.8.26','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(3,'Telenor_INT_incoming','37.111.131.31','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(4,'PTCL_INT','59.103.29.22','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(5,'Telenor_NAT','37.111.131.1','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(6,'UFONE_INT','59.103.253.116','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(7,'ZBIZ GLOBAL','50.18.207.139','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(8,'Wateen international','178.22.10.45','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(9,'Tata_London','195.219.204.6','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(10,'SymUC','45.249.9.52','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(11,'TES-Bicom_LHR','110.93.240.250','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(12,'jazz_international_tru','119.160.114.10','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(13,'jazz_national_trunk','119.160.114.11','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(14,'RedTone','43.225.99.130','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(15,'TES-Bicom_ISB','110.93.240.247','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(16,'TES-Bicom_KHI','110.93.240.231','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(17,'RedTone-C4','43.225.98.76','110.93.220.194','Not commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(18,'Acmetel_Std','178.22.14.15','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(19,'Voitex_INTL_C4','185.32.78.18','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(20,'BOL','185.32.78.65','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(21,'Tata_Frankfurt','80.231.94.48','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(22,'PBX_ABT','149.40.227.18','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(23,'PTCL_nat','59.103.29.21','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(24,'Telenor Linx INT 1','213.230.176.5','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(25,'MGW_PSH','110.93.220.166','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(26,'Wateen C4','58.27.240.212','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(27,'Telenor Linx INT 2','213.230.178.5','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(28,'Zong_INT','111.119.176.156','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(29,'PBX_TES','149.40.227.10','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(30,'ABT_MGW','110.93.220.170','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(31,'PBX_LDI','110.93.220.154','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(32,'PBX_SHL','149.40.227.14','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(33,'PBX_QTR','149.40.227.26','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(34,'PBX_DIK','149.40.227.22','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(35,'Ooredoo Doha SBC','86.62.241.33','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(36,'Zong_Ooredo','45.249.9.240','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(37,'HG_AJK','103.86.88.29','110.93.220.194','Not commercia','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(38,'HG_AJK_Backup','103.180.243.7','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(39,'TES-Bicom_ISB2','110.93.240.251','110.93.220.194','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(40,'Zong_NAT','111.119.176.156','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(41,'TES_ISB_NAT','110.93.240.247','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(42,'TES_LHR_NAT','110.93.240.250','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(43,'TES_KHI_NAT','110.93.240.231','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(44,'Ufone_Nat','59.103.253.116','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32'),(45,'TES_ISB_NAT2','110.93.240.251','110.93.220.196','Commercial','ACTIVE',NULL,NULL,'2024-12-10 06:01:32','2024-12-10 06:01:32');
/*!40000 ALTER TABLE `ldi_softswitch_trunk_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-10 11:05:17
