-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2024 at 10:46 AM
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
('creativegamer03', 0xd300e2ca5ded5f6a735d59afc5a508496d0adb67b46e327d66f67e021b13a714);

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
('C001', 'ABC Electronics', 'New York', '09123456789'),
('C002', 'XYZ Tech', 'San Francisco', '09698765432'),
('C003', 'Tech Innovators', 'London', '09545678901'),
('C004', 'Global Systems', 'Tokyo', '09278901234'),
('C005', 'Smart Solutions', 'Sydney', '09632109876'),
('C006', 'Mann Co.', 'New Mexico', '09455569434');

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
('E001', 'Generator X', 10, '2022-02-15', 'C001'),
('E002', 'Robotics Arm', 50, '2021-08-10', 'C002'),
('E003', 'Solar Panel System', 20, '2023-05-20', 'C003'),
('E004', 'Industrial Printer', 5, '2022-11-05', 'C004'),
('E005', 'HVAC System', 10, '2023-01-30', 'C005'),
('E006', 'Respawn Machine ', 100, '2024-12-21', 'C003'),
('E007', 'Provisions Dispenser Machine', 50, '1968-05-07', 'C006');

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
('O001', 'John Smith', 'Technician', '09555123453', 'C001'),
('O002', 'Emily White', 'Engineer', '09855598765', 'C002'),
('O003', 'David Brown', 'Operator', '09555234565', 'C003'),
('O004', 'Sarah Miller', 'Maintenance', '09755587654', 'C004'),
('O005', 'Alex Johnson', 'Inspector', '09655534567', 'C005'),
('O006', 'Dell Conagher', 'Engineer', '09183750842', 'C006');

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
