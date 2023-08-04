-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2023 at 10:14 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sales_department`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(5) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `name`, `type`, `email`, `password`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Tan Juan Kai', 'admin', 'jk@admin.com', '$2b$10$o31qYLsWO1Kn2OBBZqGVu.gmlP.9VEfICSeWSSH23mTAM7fqWSql.', 1, '2023-06-11 15:55:35', '2023-06-11 15:55:35'),
(2, 'Lim Zhe Yu', 'admin', 'zy@admin.com', '$2b$10$wCfbK442Q6rHRvUH0NL3Cu8/DibJZJPyDWS43Fo8wSvAOn3cB5Cg2', 1, '2023-06-11 15:55:48', '2023-06-11 15:55:48'),
(3, 'Jordan Chew Ding Jian', 'user', 'jc@user.com', '$2b$10$tSo57AyA/jpgUBmUZdz4/eqplCfQZrsVk6BtFXepoV29oG.9rQ17i', 1, '2023-06-11 15:57:53', '2023-06-11 15:57:53');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(50) NOT NULL,
  `customer_contact` varchar(11) NOT NULL,
  `customer_email` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `customer_sales` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `customer_name`, `customer_contact`, `customer_email`, `createdAt`, `updatedAt`, `customer_sales`) VALUES
(1, 'Nicole Ha Yah Yie', '01110442211', 'ncl@gmail.com', '2023-06-11 15:58:02', '2023-06-11 15:58:02', 11168.96),
(2, 'Ooi Wei Shan ', '0123345556', 'weishan@gmail.com', '2023-06-11 16:09:19', '2023-06-11 16:09:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(11) NOT NULL,
  `invoice_total` decimal(9,2) DEFAULT NULL,
  `account_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`invoice_id`, `invoice_total`, `account_id`, `customer_id`, `createdAt`, `updatedAt`) VALUES
(1, 2222.99, 3, 1, '2023-06-11 15:59:35', '2023-06-11 15:59:35'),
(2, 2222.99, 3, 1, '2023-06-11 16:00:00', '2023-06-11 16:00:00'),
(3, 6722.98, 3, 1, '2023-06-11 16:01:08', '2023-06-11 16:01:08');

--
-- Triggers `invoices`
--
DELIMITER $$
CREATE TRIGGER `update_customer_sales` AFTER UPDATE ON `invoices` FOR EACH ROW BEGIN
              UPDATE customers
              SET customer_sales = (
                SELECT SUM(invoice_total) 
                FROM invoices 
                WHERE invoices.customer_id = customers.customer_id
                GROUP BY customers.customer_id
              );
            END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_details`
--

CREATE TABLE `invoice_details` (
  `invoice_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `purchase_qty` int(11) NOT NULL,
  `purchase_price` decimal(9,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `invoice_details`
--

INSERT INTO `invoice_details` (`invoice_id`, `item_id`, `purchase_qty`, `purchase_price`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2222.99, '2023-06-11 15:59:35', '2023-06-11 15:59:35'),
(2, 1, 1, 2222.99, '2023-06-11 16:00:00', '2023-06-11 16:00:00'),
(3, 1, 1, 2222.99, '2023-06-11 16:01:08', '2023-06-11 16:01:08'),
(3, 2, 1, 4499.99, '2023-06-11 16:01:43', '2023-06-11 16:01:43');

--
-- Triggers `invoice_details`
--
DELIMITER $$
CREATE TRIGGER `update_invoice_price` AFTER INSERT ON `invoice_details` FOR EACH ROW BEGIN
            UPDATE invoices
            SET invoice_total = (
              SELECT SUM(purchase_price) 
              FROM invoice_details 
              WHERE invoices.invoice_id = invoice_details.invoice_id
              GROUP BY invoices.invoice_id
            );
          END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_item` AFTER INSERT ON `invoice_details` FOR EACH ROW BEGIN
            UPDATE items
            SET item_quantity = item_quantity - NEW.purchase_qty
            WHERE item_id = NEW.item_id;
          END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(30) NOT NULL,
  `item_type` varchar(25) NOT NULL,
  `item_quantity` int(4) NOT NULL,
  `item_price` decimal(9,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `item_type`, `item_quantity`, `item_price`, `createdAt`, `updatedAt`) VALUES
(1, 'HP 15', 'laptop', 19, 2222.99, '2023-06-11 15:58:27', '2023-06-11 15:58:27'),
(2, 'Air Mac Pro 2022', 'laptop', 9, 4499.99, '2023-06-11 16:01:33', '2023-06-11 16:01:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD PRIMARY KEY (`invoice_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoice_details`
--
ALTER TABLE `invoice_details`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_23` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`),
  ADD CONSTRAINT `invoices_ibfk_24` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD CONSTRAINT `invoice_details_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`),
  ADD CONSTRAINT `invoice_details_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
