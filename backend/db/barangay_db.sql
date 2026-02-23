-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2026 at 06:57 AM
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
-- Database: `barangay_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `position` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `user_id`, `position`) VALUES
(2, 8, 'SK Kagawad');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_entries`
--

CREATE TABLE `chatbot_entries` (
  `id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `head` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `contact` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatbot_entries`
--

INSERT INTO `chatbot_entries` (`id`, `category`, `title`, `head`, `designation`, `contact`, `created_at`) VALUES
(16, 'Department', 'Office of the City Administrator', 'Atty. Eduardo Quintos XIV', 'City Administrator', '(+63) 2 8521 7505 / (+63) 2 8527 0984 / (+63) 2 8527 5004 / (+63) 2 8567 1837', '2026-02-23 05:49:11'),
(17, 'Department', 'Manila Barangay Bureau', 'Mr. Joel M. Par', 'Officer-In-Charge', '(+63) 2 5302 6878', '2026-02-23 05:49:11'),
(18, 'Department', 'Department of Tourism Culture & Arts of Manila', 'Ms. Cristal Bagatsing', 'Officer-In-Charge', '(+63) 2 5310 5224', '2026-02-23 05:49:11'),
(19, 'Department', 'Manila Health Department', 'Dr. Grace H. Padilla', 'Officer-in-Charge', '(+63) 2 8527 4960', '2026-02-23 05:49:11'),
(20, 'Department', 'Department of Public Services', 'Mr. Kenneth G. Amurao', 'Officer-In-Charge', '(+63) 2 5310 1261', '2026-02-23 05:49:11'),
(21, 'Department', 'Office of the City Treasurer', 'Mr. Paul Vega', 'City Treasurer', '(+63) 2 8527 5020', '2026-02-23 05:49:11'),
(22, 'Department', 'City Civil Registry Office', 'Atty. Jaime R. Tejero', 'Officer-in-Charge', '(+63) 2 8405 0081', '2026-02-23 05:49:11'),
(23, 'Department', 'Division of City Schools - Manila', 'Ms. Nerissa RR. Lomeda', 'Officer-in-Charge', '(+63) 2 8527 5180', '2026-02-23 05:49:11'),
(24, 'Department', 'Manila Disaster Risk Reduction Office', 'Mr. Arnel Eustacio M. Angeles', 'Director', '(+63) 950 7003710', '2026-02-23 05:49:11'),
(25, 'Hotline', 'Fire Station Hotlines', NULL, NULL, 'Sta Mesa: 0917-635-8570 | San Lazaro: 0928-940-6032 | Sampaloc: 0905-692-3584 | Pandacan: 0950-429-2897', '2026-02-23 05:49:11'),
(26, 'Hotline', 'Police Station Hotlines', NULL, NULL, 'Sta Mesa Station 8 | PCP Bacood: 716-6525 | PCP Mendiola: 466-7346 | PCP Palanca: 735-0036 | PCP Plaza Avelino: 491-5752', '2026-02-23 05:49:11'),
(27, 'Hotline', 'Emergency Hotlines', NULL, NULL, 'City of Manila: 8568-6909 | 0932-665-2322 | 0950-700-3710', '2026-02-23 05:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `created_at`) VALUES
(1, 'Where can I contact the City Administrator?', 'Office of the City Administrator', '2026-02-23 05:48:58'),
(2, 'Where can I contact the Barangay Bureau?', 'Manila Barangay Bureau', '2026-02-23 05:48:58'),
(3, 'Where can I contact the Department of Tourism Culture & Arts?', 'Department of Tourism Culture & Arts of Manila', '2026-02-23 05:48:58'),
(4, 'Where can I contact the Health Department?', 'Manila Health Department', '2026-02-23 05:48:58'),
(5, 'Where can I contact the Department of Public Services?', 'Department of Public Services', '2026-02-23 05:48:58'),
(6, 'Where can I contact the City Treasurer?', 'Office of the City Treasurer', '2026-02-23 05:48:58'),
(7, 'Where can I contact the Civil Registry Office?', 'City Civil Registry Office', '2026-02-23 05:48:58'),
(8, 'Where can I contact the Division of City Schools?', 'Division of City Schools - Manila', '2026-02-23 05:48:58'),
(9, 'Where can I contact the Disaster Risk Reduction Office?', 'Manila Disaster Risk Reduction Office', '2026-02-23 05:48:58'),
(10, 'Where can I call for fire emergencies?', 'Fire Station Hotlines', '2026-02-23 05:48:58'),
(11, 'Where can I call for police assistance?', 'Police Station Hotlines', '2026-02-23 05:48:58'),
(12, 'Where can I call for emergency help?', 'Emergency Hotlines', '2026-02-23 05:48:58');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `rating` int(11) NOT NULL,
  `message` text NOT NULL,
  `date_submitted` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contact` varchar(20) NOT NULL,
  `date_time` datetime NOT NULL,
  `type` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `status` enum('Open','In Progress','Closed') DEFAULT 'Open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `resident_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `civil_status` varchar(20) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`resident_id`, `user_id`, `address`, `gender`, `birthdate`, `civil_status`, `religion`) VALUES
(3, 10, 'Manila', 'Male', '2004-06-10', 'Single', 'Roman Catholic');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','resident') DEFAULT 'resident',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`) VALUES
(8, 'Ralph', 'Galve', 'ralphgalve@gmail.com', '$2b$10$.2F3or5s9W/0fBzz/lhfEe6OgFV92qROLSZVdkMsdY2RKlekjkNUy', 'admin', '2026-02-21 17:35:12'),
(10, 'Adrian', 'Medrano', 'adrian2004medrano@gmail.com', '$2b$10$lpU1sATwB6X78VOSHeFBl..Bzoq3Z22UP8yXICJKZ75MprZIOwB.q', 'resident', '2026-02-22 02:13:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_announcement_admin` (`admin_id`);

--
-- Indexes for table `chatbot_entries`
--
ALTER TABLE `chatbot_entries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feedback_user` (`user_id`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_incident_user` (`user_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`resident_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `chatbot_entries`
--
ALTER TABLE `chatbot_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `fk_announcement_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `fk_incident_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `residents`
--
ALTER TABLE `residents`
  ADD CONSTRAINT `residents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
