-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 23, 2024 at 05:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbms_mp_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `UserName` varchar(30) NOT NULL,
  `Password` binary(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`UserName`, `Password`) VALUES
('creativegamer03', 0xd300e2ca5ded5f6a735d59afc5a508496d0adb67b46e327d66f67e021b13a714),
('ritem', 0xe7cf3ef4f17c3999a94f2c6f612e8a888e5b1026878e4e19398b23bd38ec221a);

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `CompanyID` varchar(20) NOT NULL,
  `CompanyName` varchar(30) DEFAULT NULL,
  `Location` varchar(30) DEFAULT NULL,
  `Contact` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`CompanyID`, `CompanyName`, `Location`, `Contact`) VALUES
('C001', 'ABC Electronics', 'New York', '12345678'),
('C002', 'XYZ Tech', 'San Francisco', '98765432'),
('C003', 'Tech Innovators', 'London', '45678901'),
('C004', 'Global Systems', 'Tokyo', '78901234'),
('C005', 'Smart Solutions', 'Sydney', '32109876'),
('C006', 'Mann Co.', 'New Mexico', '5556943');

-- --------------------------------------------------------

--
-- Table structure for table `equipments`
--

CREATE TABLE `equipments` (
  `EquipmentID` varchar(20) NOT NULL,
  `EquipmentName` varchar(30) DEFAULT NULL,
  `PowerRating` int(11) DEFAULT NULL,
  `ManufacturingDate` date DEFAULT NULL,
  `CompanyID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipments`
--

INSERT INTO `equipments` (`EquipmentID`, `EquipmentName`, `PowerRating`, `ManufacturingDate`, `CompanyID`) VALUES
('E001', 'Generator X', 1000, '2022-02-15', 'C001'),
('E002', 'Robotics Arm', 500, '2021-08-10', 'C002'),
('E003', 'Solar Panel System', 200, '2023-05-20', 'C003'),
('E004', 'Industrial Printer', 800, '2022-11-05', 'C004'),
('E005', 'HVAC System', 300, '2023-01-30', 'C005'),
('E006', 'Respawn Machine ', 200, '2024-12-21', 'C003'),
('E007', 'Provisions Dispenser Machine', 2000, '1968-05-07', 'C006');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `AlertID` varchar(20) NOT NULL,
  `EquipmentID` varchar(20) DEFAULT NULL,
  `OperatorID` varchar(20) DEFAULT NULL,
  `EnergyConsumed` int(11) DEFAULT NULL,
  `TimeStamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`AlertID`, `EquipmentID`, `OperatorID`, `EnergyConsumed`, `TimeStamp`) VALUES
('AL001', 'E001', 'O001', 1500, '2024-03-05 00:30:00'),
('AL002', 'E002', 'O002', 800, '2024-03-05 02:15:00'),
('AL003', 'E003', 'O003', 300, '2024-03-05 04:45:00'),
('AL004', 'E004', 'O004', 1200, '2024-03-05 06:30:00'),
('AL005', 'E005', 'O005', 500, '2024-03-05 08:00:00'),
('AL006', 'E001', 'O004', 230, '2024-12-22 22:23:16'),
('AL007', 'E001', 'O004', 230, '2024-12-22 22:29:00'),
('AL008', 'E001', 'O004', 230, '2024-12-22 22:29:29'),
('AL009', 'E003', 'O003', 256, '2024-12-22 22:30:04'),
('AL010', 'E003', 'O003', 256, '2024-12-22 22:30:32'),
('AL011', 'E003', 'O003', 256, '2024-12-22 22:30:52'),
('AL012', 'E006', 'O001', 1000, '2024-12-22 23:12:53'),
('AL013', 'E005', 'O003', 541, '2024-12-22 23:14:35'),
('AL014', 'E001', 'O001', 250, '2024-12-22 23:15:14'),
('AL015', 'E003', 'O002', 200, '2024-12-22 23:16:18'),
('AL016', 'E006', 'O005', 2000, '2024-12-22 23:51:28'),
('AL017', 'E001', 'O003', 200, '2024-12-23 14:10:12'),
('AL018', 'E001', 'O001', 300, '2024-12-23 14:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `operators`
--

CREATE TABLE `operators` (
  `OperatorID` varchar(20) NOT NULL,
  `OperatorName` varchar(30) DEFAULT NULL,
  `Occupation` varchar(20) DEFAULT NULL,
  `PhoneNumber` varchar(11) DEFAULT NULL,
  `CompanyID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operators`
--

INSERT INTO `operators` (`OperatorID`, `OperatorName`, `Occupation`, `PhoneNumber`, `CompanyID`) VALUES
('O001', 'John Smith', 'Technician', '55512345', 'C001'),
('O002', 'Emily White', 'Engineer', '55598765', 'C002'),
('O003', 'David Brown', 'Operator', '55523456', 'C003'),
('O004', 'Sarah Miller', 'Maintenance', '55587654', 'C004'),
('O005', 'Alex Johnson', 'Inspector', '55534567', 'C005'),
('O006', 'Dell Conagher', 'Engineer', '183750842', 'C006');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`UserName`,`Password`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`CompanyID`);

--
-- Indexes for table `equipments`
--
ALTER TABLE `equipments`
  ADD PRIMARY KEY (`EquipmentID`),
  ADD KEY `CompanyID` (`CompanyID`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`AlertID`),
  ADD KEY `EquipmentID` (`EquipmentID`),
  ADD KEY `OperatorID` (`OperatorID`);

--
-- Indexes for table `operators`
--
ALTER TABLE `operators`
  ADD PRIMARY KEY (`OperatorID`),
  ADD KEY `CompanyID` (`CompanyID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `equipments`
--
ALTER TABLE `equipments`
  ADD CONSTRAINT `equipments_ibfk_1` FOREIGN KEY (`CompanyID`) REFERENCES `company` (`CompanyID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`EquipmentID`) REFERENCES `equipments` (`EquipmentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`OperatorID`) REFERENCES `operators` (`OperatorID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `operators`
--
ALTER TABLE `operators`
  ADD CONSTRAINT `operators_ibfk_1` FOREIGN KEY (`CompanyID`) REFERENCES `company` (`CompanyID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
