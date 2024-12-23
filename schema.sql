-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2024 at 09:07 AM
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
('ritem', 0xb03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342);

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
('C001', 'Meow Inc.', 'Neow York City', '09123131241');

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
('E001', 'Nyan Cannon', 999, '2024-12-23', 'C001');

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
('AL001', 'E001', 'O001', 500, '2024-12-23 08:05:26');

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
('O001', 'Nyagatron', 'Nyanager', '2147483647', 'C001');

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
