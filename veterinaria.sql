-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2025 a las 23:24:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `veterinaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-7b87689d4ed9cf9ce8c24096a5c25189', 'i:1;', 1762812025),
('laravel-cache-7b87689d4ed9cf9ce8c24096a5c25189:timer', 'i:1762812025;', 1762812025),
('laravel-cache-8f8857ba7825973efdf6e773694b5060', 'i:1;', 1764101697),
('laravel-cache-8f8857ba7825973efdf6e773694b5060:timer', 'i:1764101697;', 1764101697),
('laravel-cache-f6db5a94bcda06d76e213cb9b5760885', 'i:1;', 1763758244),
('laravel-cache-f6db5a94bcda06d76e213cb9b5760885:timer', 'i:1763758244;', 1763758244),
('veterinaria-cache-c525a5357e97fef8d3db25841c86da1a', 'i:1;', 1765136775),
('veterinaria-cache-c525a5357e97fef8d3db25841c86da1a:timer', 'i:1765136775;', 1765136775);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL,
  `id_mascota` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `fecha_hora_atencion` datetime DEFAULT NULL,
  `fecha_hora_notificacion` datetime DEFAULT NULL,
  `id_motivo_cita` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_estado_cita` int(11) DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`id_cita`, `id_mascota`, `fecha`, `hora`, `fecha_hora_atencion`, `fecha_hora_notificacion`, `id_motivo_cita`, `observaciones`, `id_estado_cita`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 3, '2025-09-27', '11:40:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-01 19:44:34', 3, '2025-09-29 12:09:43'),
(2, 2, '2025-09-21', '16:17:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-26 15:17:52', NULL, '2025-09-26 15:17:52'),
(3, 2, '2025-09-26', '16:18:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-26 15:18:36', NULL, '2025-09-26 15:18:36'),
(4, 7, '2025-09-28', '11:10:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:05:46', NULL, '2025-09-29 12:05:46'),
(5, 8, '2025-09-28', '15:08:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:08:27', NULL, '2025-09-29 12:08:27'),
(6, 4, '2025-09-27', '11:40:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:10:16', NULL, '2025-09-29 12:10:16'),
(7, 9, '2025-09-25', '09:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:23:56', NULL, '2025-09-29 12:23:56'),
(8, 13, '2025-09-23', '14:40:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:38:27', NULL, '2025-09-29 12:38:27'),
(9, 1, '2025-09-21', '14:47:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:48:00', NULL, '2025-09-29 12:48:00'),
(10, 18, '2025-09-21', '11:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:51:34', NULL, '2025-09-29 12:51:34'),
(11, 19, '2025-09-21', '16:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:54:42', NULL, '2025-09-29 12:54:42'),
(12, 20, '2025-09-21', '13:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 12:59:27', NULL, '2025-09-29 12:59:27'),
(13, 21, '2025-09-21', '13:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 13:01:35', NULL, '2025-09-29 13:01:35'),
(14, 2, '2025-09-21', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 14:42:39', NULL, '2025-09-29 14:42:39'),
(15, 25, '2025-09-19', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 14:54:44', NULL, '2025-09-29 14:54:44'),
(16, 26, '2025-09-19', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 14:55:28', NULL, '2025-09-29 14:55:28'),
(17, 27, '2025-09-20', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 15:04:12', NULL, '2025-09-29 15:04:12'),
(18, 28, '2025-09-20', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 15:04:52', NULL, '2025-09-29 15:04:52'),
(19, 29, '2025-09-19', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, NULL, 2, 3, '2025-09-29 15:13:14', NULL, '2025-09-29 15:13:14'),
(20, 30, '2025-09-19', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 15:32:08', NULL, '2025-09-29 15:32:08'),
(21, 31, '2025-09-18', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:13:19', NULL, '2025-09-29 16:13:19'),
(22, 32, '2025-09-18', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:46:18', 3, '2025-09-29 16:47:25'),
(23, 33, '2025-09-18', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:47:05', NULL, '2025-09-29 16:47:05'),
(24, 34, '2025-09-17', '13:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:52:36', NULL, '2025-09-29 16:52:36'),
(25, 22, '2025-09-16', '10:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:53:29', NULL, '2025-09-29 16:53:29'),
(26, 23, '2025-09-17', '10:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 16:54:10', NULL, '2025-09-29 16:54:10'),
(27, 35, '2025-09-14', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 17:05:12', NULL, '2025-09-29 17:05:12'),
(28, 36, '2025-09-14', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 17:06:13', NULL, '2025-09-29 17:06:13'),
(29, 37, '2025-09-13', '14:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 17:10:09', NULL, '2025-09-29 17:10:09'),
(30, 40, '2025-09-13', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, NULL, 2, 3, '2025-09-29 17:25:16', NULL, '2025-09-29 17:25:16'),
(31, 44, '2025-09-11', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:07:47', NULL, '2025-09-29 19:07:47'),
(32, 48, '2025-09-06', '14:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:39:35', 3, '2025-10-04 18:07:55'),
(33, 49, '2025-09-06', '14:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:40:26', 3, '2025-10-04 18:09:45'),
(34, 50, '2025-09-06', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:43:51', NULL, '2025-09-29 19:43:51'),
(35, 51, '2025-09-06', '10:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:44:26', NULL, '2025-09-29 19:44:26'),
(36, 52, '2025-09-05', '11:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:47:57', NULL, '2025-09-29 19:47:57'),
(37, 53, '2025-09-05', '11:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-09-29 19:51:14', NULL, '2025-09-29 19:51:14'),
(38, 54, '2025-09-30', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 17:47:37', NULL, '2025-10-02 17:47:37'),
(39, 55, '2025-09-30', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 17:52:35', NULL, '2025-10-02 17:52:35'),
(40, 56, '2025-09-30', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 17:53:11', NULL, '2025-10-02 17:53:11'),
(41, 58, '2025-10-01', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 18:05:16', NULL, '2025-10-02 18:05:16'),
(42, 59, '2025-10-01', '11:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 18:06:01', NULL, '2025-10-02 18:06:01'),
(43, 60, '2025-10-01', '15:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 18:14:55', NULL, '2025-10-02 18:14:55'),
(44, 61, '2025-10-01', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-02 18:18:18', NULL, '2025-10-02 18:18:18'),
(45, 62, '2025-10-03', '10:11:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-03 19:12:21', NULL, '2025-10-03 19:12:21'),
(46, 57, '2025-10-04', '09:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-04 16:42:05', 3, '2025-10-06 10:57:14'),
(47, 68, '2025-10-04', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 12:51:43', NULL, '2025-10-06 12:51:43'),
(48, 64, '2025-10-05', '10:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 12:53:34', NULL, '2025-10-06 12:53:34'),
(49, 65, '2025-10-05', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 12:55:09', NULL, '2025-10-06 12:55:09'),
(50, 66, '2025-10-05', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 12:56:09', NULL, '2025-10-06 12:56:09'),
(51, 67, '2025-10-05', '14:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 12:57:14', NULL, '2025-10-06 12:57:14'),
(52, 70, '2025-10-06', '11:50:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 14:46:17', NULL, '2025-10-06 14:46:17'),
(53, 49, '2025-10-04', '12:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-06 16:40:58', NULL, '2025-10-06 16:40:58'),
(54, 48, '2025-10-04', '13:30:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 'Nada', 2, 3, '2025-10-06 16:45:01', 3, '2025-10-07 18:36:39'),
(55, 73, '2025-10-07', '09:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 'Corte NRO 10; cara snauzer, cola pompon', 2, 3, '2025-10-08 16:04:08', NULL, '2025-10-08 16:04:08'),
(56, 72, '2025-10-07', '09:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 'Corte NRO 10. Cara snauzer cola pompon', 2, 3, '2025-10-08 16:05:15', NULL, '2025-10-08 16:05:15'),
(57, 71, '2025-10-07', '09:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 2, 3, '2025-10-08 16:06:12', NULL, '2025-10-08 16:06:12'),
(58, 77, '2025-10-08', '16:51:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 'Antiparasitario 15\nAntipulgas 30', 2, 3, '2025-10-08 16:52:52', NULL, '2025-10-08 16:52:52'),
(59, 78, '2025-10-08', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 'Baño 25\nAntiparasitario 10\nAntipulgas 30', 2, 3, '2025-10-08 17:08:59', NULL, '2025-10-08 17:08:59'),
(60, 79, '2025-10-08', '12:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 'Baño 25 \nAntiparasitario 10 \nAntipulgas 30', 2, 3, '2025-10-08 17:10:11', 3, '2025-10-26 19:16:24'),
(62, 43, '2025-11-28', '20:24:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 'aqui estaba marcado como 25/11/11', 1, 3, '2025-11-07 15:25:17', 3, '2025-11-28 19:07:48'),
(63, 48, '2025-12-03', '15:18:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, NULL, 1, 3, '2025-11-25 15:18:43', 3, '2025-12-02 13:10:57'),
(64, 149, '2025-11-30', '17:07:00', NULL, '2025-12-02 14:26:20', 4, 'asd', 2, 3, '2025-11-29 13:07:35', 3, '2025-12-02 14:31:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `cliente` varchar(255) NOT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(9) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `cliente`, `dni`, `email`, `telefono`, `direccion`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(315, 'Nayely Huacaychuco', NULL, 'alessia@gmail.com', '978936059', 'virgen del carmen\n952252080', 3, '2025-09-01 18:55:35', 3, '2025-11-26 09:49:30'),
(317, 'Martin García', '06145630', NULL, '914787715', 'Virgen del Carmen', 3, '2025-09-24 13:57:04', 3, '2025-10-10 12:06:41'),
(318, 'Enrique Valera', '46182276', NULL, '960276798', 'Parroquia Padre Enrique', 3, '2025-09-24 14:03:01', 3, '2025-10-10 12:35:35'),
(320, 'Rocio Calixto', '4625816', NULL, '946367005', 'Virgen del Carmen', 3, '2025-09-24 14:04:56', 3, '2025-10-10 12:35:02'),
(321, 'Sandra Mendoza', '46187732', NULL, NULL, 'Virgen del Carmen', 3, '2025-09-24 14:10:31', 3, '2025-10-10 12:32:59'),
(322, 'Jenny Samame', '15237646', NULL, '980981524', NULL, 3, '2025-09-24 14:11:31', 3, '2025-10-10 12:32:43'),
(323, 'Nayeli', '78561345', NULL, NULL, 'Virgen del carmen', 3, '2025-09-24 14:12:14', 3, '2025-10-10 12:32:30'),
(324, 'Nataly', '23568915', NULL, '949564591', NULL, 3, '2025-09-24 14:13:40', 3, '2025-10-10 12:32:20'),
(325, 'Livia Guerrero', '56892316', NULL, '933184591', NULL, 3, '2025-09-24 14:14:30', 3, '2025-10-10 12:32:11'),
(327, 'Lourdes Diestra', '48236194', NULL, '994857401', 'Virgen del Carmen', 3, '2025-09-24 14:16:02', 3, '2025-10-10 12:31:57'),
(328, 'Yely', '48162376', NULL, '910207041', 'Virgen del Carmen', 3, '2025-09-24 14:26:27', 3, '2025-10-10 12:31:27'),
(329, 'Mambito', '94612375', NULL, NULL, 'Cascadas de Javier Prado', 3, '2025-09-24 14:28:02', 3, '2025-10-10 12:30:59'),
(330, 'Mayra', '45162873', NULL, NULL, 'Virgen del Carmen', 3, '2025-09-24 14:28:35', 3, '2025-10-10 12:30:39'),
(331, 'Juan Torres', '43162297', NULL, '924052298', 'Virgen del Carmen Mz K', 3, '2025-09-25 14:08:04', 3, '2025-10-10 12:30:22'),
(332, 'Carlos Bertilda Vásquez', '46137746', NULL, '964137447', 'Los Angeles', 3, '2025-09-25 14:09:06', 3, '2025-10-10 12:30:03'),
(333, 'Elvis Castillo', NULL, NULL, '980031632', 'Virgen del Carmen Mz I', 3, '2025-09-25 14:10:11', 3, '2025-11-14 16:59:20'),
(334, 'Rosario Palomino', '05134628', NULL, '944224811', 'Virgen del Carmen', 3, '2025-09-25 14:12:00', 3, '2025-10-10 12:28:20'),
(335, 'Saúl', '45791623', NULL, '972154843', 'Virgen del Carmen Mz I', 3, '2025-09-25 14:12:53', 3, '2025-10-10 12:31:46'),
(336, 'Frank Yumpo', NULL, NULL, '953819693', 'Virgen del Carmen Mz B Lote 41', 3, '2025-09-25 14:14:09', 3, '2025-11-14 17:03:42'),
(339, 'Alexander Sandoval', '40162879', NULL, '984622770', 'Villa Láctea Sol de Vitarte', 3, '2025-09-27 18:06:54', 3, '2025-10-10 12:27:13'),
(340, 'Alexa Tueros', NULL, NULL, '426279567', 'Virgen del Carmen Mz D', 3, '2025-09-29 11:44:07', 3, '2025-10-10 12:26:53'),
(341, 'Keyla Laurente', NULL, NULL, '936434532', 'Virgen del Carmen', 3, '2025-09-29 12:02:06', 3, '2025-10-10 12:26:34'),
(342, 'Erick Quesquén', NULL, NULL, '939687411', NULL, 3, '2025-09-29 12:06:43', 3, '2025-11-14 17:01:06'),
(343, 'Irene Tapia', NULL, NULL, '948915987', 'Virgen del Carmen Mz D', 3, '2025-09-29 12:12:49', 3, '2025-10-10 12:26:12'),
(345, 'Milagros', NULL, NULL, '989692757', 'Virgen del Carmen', 3, '2025-09-29 12:36:16', 3, '2025-10-10 12:25:47'),
(346, 'Martin', NULL, NULL, '914787715', 'Virgen del Carmen', 3, '2025-09-29 12:39:13', 3, '2025-10-10 12:25:32'),
(347, 'Jubelly Jhosep Gutiérrez', NULL, NULL, '970827307', NULL, 3, '2025-09-29 12:40:34', 3, '2025-10-10 12:25:14'),
(348, 'Juan Torres', NULL, NULL, '924052298', NULL, 3, '2025-09-29 12:44:10', 3, '2025-10-10 12:24:29'),
(349, 'Nelly', NULL, NULL, NULL, NULL, 3, '2025-09-29 12:48:22', 3, '2025-10-10 12:25:01'),
(351, 'Kety Corrales', NULL, NULL, '944446793', 'Virgen del Carmen', 3, '2025-09-29 12:56:11', 3, '2025-10-10 12:23:51'),
(352, 'Judith Arrea', NULL, NULL, '943543306', 'Virgen del Carmen Mz E', 3, '2025-09-29 14:46:39', 3, '2025-10-10 12:23:42'),
(353, 'Kiara Velita', NULL, NULL, '934275833', NULL, 3, '2025-09-29 15:01:19', 3, '2025-10-10 12:23:25'),
(354, 'Erick Gonzalo Rojas', NULL, NULL, '907733622', NULL, 3, '2025-09-29 15:08:57', 3, '2025-10-10 12:21:41'),
(355, 'Denis Mateo', NULL, NULL, '973796331', 'Virgen del Carmen\nkatherine Blancos  960654373', 3, '2025-09-29 15:23:08', 3, '2025-11-14 15:47:34'),
(356, 'Daniel Lázaro', NULL, NULL, '954689474', 'Virgen del Carmen Mz D', 3, '2025-09-29 16:11:13', 3, '2025-10-10 12:21:23'),
(357, 'Rosario Palomino', NULL, NULL, '944224811', 'Virgen del Carmen', 3, '2025-09-29 16:14:16', 3, '2025-10-10 12:21:12'),
(358, 'Saúl Bellido', NULL, NULL, '972154843', 'Virgen del Carmen', 3, '2025-09-29 16:48:27', 3, '2025-10-10 12:20:44'),
(359, 'Alexia Casachagua', NULL, NULL, '918185047', 'Virgen del Carmen', 3, '2025-09-29 17:01:40', 3, '2025-10-10 12:19:56'),
(360, 'Zoila Gonzales', NULL, NULL, '981944503', NULL, 3, '2025-09-29 17:08:10', 3, '2025-10-10 12:19:42'),
(361, 'Jenny Caballero', NULL, NULL, '958047629', 'Virgen del Carmen Mz A', 3, '2025-09-29 17:12:12', 3, '2025-10-10 12:19:25'),
(362, 'Erick Almeida', NULL, NULL, '981262345', 'Virgen del Carmen', 3, '2025-09-29 17:15:29', 3, '2025-10-10 12:19:12'),
(363, 'Brigith Poves Vilcahuaman', NULL, NULL, '935719752', NULL, 3, '2025-09-29 17:23:03', 3, '2025-10-10 12:19:02'),
(364, 'Camila Guevara', NULL, NULL, '902700219', 'Virgen del Carmen', 3, '2025-09-29 18:24:24', 3, '2025-10-10 12:18:54'),
(365, 'Jazmin Adrianzen', NULL, NULL, '946891842', 'Virgen del Carmen Mz A', 3, '2025-09-29 18:38:01', 3, '2025-10-10 12:18:44'),
(366, 'Milagros Westreicher', NULL, NULL, '959711492', NULL, 3, '2025-09-29 18:54:48', 3, '2025-10-10 12:18:34'),
(367, 'Guisella Quispe', NULL, NULL, '997294053', 'Virgen del Carmen  Mz K', 3, '2025-09-29 19:09:33', 3, '2025-10-10 12:17:33'),
(368, 'Karina Zurita', NULL, NULL, '975012195', NULL, 3, '2025-09-29 19:18:59', 3, '2025-10-10 12:17:13'),
(369, 'Maria Torres', NULL, NULL, '996319004', 'Virgen del Carmen mz F lte 14', 3, '2025-09-29 19:33:02', 3, '2025-11-14 15:19:49'),
(370, 'Rocío Suarez', NULL, NULL, '988168022', NULL, 3, '2025-09-29 19:36:51', 3, '2025-10-10 12:16:50'),
(371, 'Mayra Mayta', NULL, NULL, '986789157', NULL, 3, '2025-09-29 19:41:01', 3, '2025-10-10 12:16:42'),
(372, 'Roberto Ayala Luyo', NULL, NULL, '997391414', 'Cascadas de Javier Prado', 3, '2025-09-29 19:49:38', 3, '2025-10-10 12:13:42'),
(373, 'Ulises Julca', NULL, NULL, '946341580', 'Virgen del Carmen Mz B', 3, '2025-10-01 09:49:53', 3, '2025-10-10 12:13:28'),
(374, 'Renee Sánchez', NULL, NULL, '983872698', 'Cascadas de Javier Prado Mz E', 3, '2025-10-01 09:54:22', 3, '2025-10-10 12:12:31'),
(375, 'Yojana Zurita', NULL, NULL, '995653777', 'Virgen del Carmen Mz K', 3, '2025-10-02 16:19:39', 3, '2025-10-10 12:13:05'),
(377, 'Betty Ruiz', NULL, NULL, '985074521', 'Virgen del Carmen', 3, '2025-10-02 18:02:40', 3, '2025-10-10 12:12:11'),
(378, 'Eddy Mena', NULL, NULL, '998859264', 'Virgen del Carmen Mz G', 3, '2025-10-02 18:08:08', 3, '2025-10-10 12:11:40'),
(379, 'Nataly  Palomino', NULL, NULL, '930984399', 'Virgen del Carmen', 3, '2025-10-04 18:16:02', 3, '2025-10-10 12:09:58'),
(381, 'Paula Blanco', NULL, NULL, '921882134', 'Virgen del Carmen', 3, '2025-10-05 11:00:44', 3, '2025-10-10 12:09:13'),
(382, 'Elizabeth Quispe', NULL, NULL, '993927845', NULL, 3, '2025-10-06 12:30:55', 3, '2025-10-10 12:09:05'),
(384, 'Andrea Cantoral', NULL, NULL, '969787598', NULL, 3, '2025-10-06 12:33:30', 3, '2025-10-10 12:08:49'),
(386, 'Ana Vega', NULL, NULL, '912861064', 'Virgen del Carmen Mz B Lote 32', 3, '2025-10-06 18:59:30', 3, '2025-10-14 16:33:27'),
(387, 'Nan Nan', NULL, NULL, NULL, 'Virgen del Carmen', 3, '2025-10-07 14:06:26', 3, '2025-10-10 12:08:15'),
(388, 'Luzmila Laura', NULL, NULL, '994943911', NULL, 3, '2025-10-08 16:15:25', 3, '2025-10-10 12:08:03'),
(389, 'Sadith Santillan', NULL, NULL, '977850439', NULL, 3, '2025-10-08 17:04:00', 3, '2025-10-10 12:07:32'),
(390, 'Victor Corao', NULL, NULL, '956201082', NULL, 3, '2025-10-10 12:07:03', NULL, '2025-10-10 12:07:03'),
(391, 'Carmen Avila', NULL, NULL, '971119403', NULL, 3, '2025-10-10 12:07:15', NULL, '2025-10-10 12:07:15'),
(392, 'Raquel Herrera', NULL, NULL, '999352602', 'Viques', 3, '2025-10-10 18:06:38', NULL, '2025-10-10 18:06:38'),
(393, 'Vanessa Varilla', NULL, NULL, '947783937', NULL, 3, '2025-10-14 16:50:08', NULL, '2025-10-14 16:50:08'),
(394, 'Sharon Gabriela Inche', NULL, NULL, '964052420', NULL, 3, '2025-10-20 15:01:27', 3, '2025-10-22 15:51:03'),
(395, 'Hassan Ramos', NULL, NULL, '912826290', 'Virgen del Carmen mz O lte 20', 3, '2025-10-21 09:47:58', 3, '2025-10-21 10:48:40'),
(396, 'Gloria Mendoza', NULL, NULL, '949345835', 'virgen del  Carmen', 3, '2025-10-22 15:50:34', NULL, '2025-10-22 15:50:34'),
(397, 'Liliana Quispe', NULL, NULL, '997014778', 'VC mz A lte 5 \nJeremy Quispe 947333958', 3, '2025-10-22 15:59:35', NULL, '2025-10-22 15:59:35'),
(398, 'Elizabeth', NULL, NULL, '937502257', NULL, 3, '2025-10-22 16:25:19', NULL, '2025-10-22 16:25:19'),
(399, 'Jessica Sotacuro', NULL, NULL, '976521861', NULL, 3, '2025-10-22 16:34:56', NULL, '2025-10-22 16:34:56'),
(400, 'Rebeca Ricse', NULL, NULL, '972544491', NULL, 3, '2025-10-22 17:07:34', NULL, '2025-10-22 17:07:34'),
(401, 'Luz Maria Pena', NULL, NULL, '984341236', NULL, 3, '2025-10-22 17:40:20', NULL, '2025-10-22 17:40:20'),
(402, 'Carla Ayala', NULL, NULL, '945080985', 'cascadas  de Javier Prado', 3, '2025-10-22 19:07:39', NULL, '2025-10-22 19:07:39'),
(403, 'Rayda Ramirez', NULL, NULL, '959974266', 'asociación Viques', 3, '2025-10-22 19:17:16', NULL, '2025-10-22 19:17:16'),
(404, 'Gianmarco de Lidia', NULL, NULL, '982511121', 'virgen del carmen mz A', 3, '2025-10-22 19:41:25', NULL, '2025-10-22 19:41:25'),
(405, 'Roberto', NULL, NULL, '945099746', NULL, 3, '2025-10-22 19:59:10', NULL, '2025-10-22 19:59:10'),
(406, 'Naomy Retto Palacios', NULL, NULL, '970621001', 'virgen del carmen', 3, '2025-10-22 20:06:09', NULL, '2025-10-22 20:06:09'),
(407, 'Celia Malpartida', NULL, NULL, NULL, 'Virgen del carmen', 3, '2025-10-23 18:50:26', NULL, '2025-10-23 18:50:26'),
(408, 'Victor Flores', NULL, NULL, '970322850', 'Virgen del Carmen mz K', 3, '2025-10-25 18:11:31', NULL, '2025-10-25 18:11:31'),
(409, 'Thalia alcantara', NULL, NULL, '954133214', 'Virgen del Carmen', 3, '2025-10-25 18:21:10', NULL, '2025-10-25 18:21:10'),
(410, 'Angela Yauri', NULL, NULL, '993896530', 'Virgen del Carmen', 3, '2025-10-25 18:21:50', NULL, '2025-10-25 18:21:50'),
(411, 'Juana Anselmo', NULL, NULL, '956461533', 'Virgen del Carmen', 3, '2025-10-28 11:19:02', NULL, '2025-10-28 11:19:02'),
(412, 'Ivan Quilca', NULL, NULL, '967165320', NULL, 3, '2025-10-28 12:34:48', NULL, '2025-10-28 12:34:48'),
(413, 'Jennifer Burgos', NULL, NULL, NULL, 'Vírgen del Carmen', 3, '2025-10-28 14:07:24', NULL, '2025-10-28 14:07:24'),
(414, 'Rosario huacahuire , sra Magda', NULL, NULL, '936841713', 'Virgen del Carmen', 3, '2025-10-28 19:20:43', NULL, '2025-10-28 19:20:43'),
(415, 'Rene Nuñez', NULL, NULL, '910449094', 'Señor de las cortinas del mercado', 3, '2025-11-06 15:41:27', NULL, '2025-11-06 15:41:27'),
(416, 'Deyse Sandoval', NULL, NULL, '923057315', NULL, 3, '2025-11-06 15:41:55', NULL, '2025-11-06 15:41:55'),
(417, 'Carmen Fernández', NULL, NULL, '948420652', 'Esposa de Hower', 3, '2025-11-06 15:42:42', NULL, '2025-11-06 15:42:42'),
(419, 'Marisol Salvador', NULL, NULL, '993794683', NULL, 3, '2025-11-06 15:45:44', NULL, '2025-11-06 15:45:44'),
(420, 'Jesus Enyerber yusty', NULL, NULL, '992438219', NULL, 3, '2025-11-06 15:46:37', NULL, '2025-11-06 15:46:37'),
(421, 'Cesar Ollero', NULL, NULL, '967283750', NULL, 3, '2025-11-06 15:49:53', NULL, '2025-11-06 15:49:53'),
(422, 'Geraldine Hinostroza', NULL, NULL, '989073652', NULL, 3, '2025-11-06 15:52:04', NULL, '2025-11-06 15:52:04'),
(423, 'Anabella Paredes', NULL, NULL, '931570662', NULL, 3, '2025-11-06 15:55:39', NULL, '2025-11-06 15:55:39'),
(424, 'Trevor Quicha', NULL, NULL, '936313615', NULL, 3, '2025-11-06 15:56:23', NULL, '2025-11-06 15:56:23'),
(425, 'Aracely Vargas', NULL, NULL, '917596128', NULL, 3, '2025-11-06 15:58:24', NULL, '2025-11-06 15:58:24'),
(426, 'Jaime López', NULL, NULL, '992300262', 'Iris López 916475873', 3, '2025-11-06 16:01:27', NULL, '2025-11-06 16:01:27'),
(427, 'Abigail Bautista', NULL, NULL, '956763651', NULL, 3, '2025-11-07 14:50:58', NULL, '2025-11-07 14:50:58'),
(428, 'Henry Luna', NULL, NULL, '991839906', 'Virgen del carmen', 3, '2025-11-07 14:54:48', NULL, '2025-11-07 14:54:48'),
(430, 'katherine Sucasaire', NULL, NULL, NULL, NULL, 3, '2025-11-14 11:28:31', NULL, '2025-11-14 11:28:31'),
(431, 'Sandra Ramirez', NULL, NULL, '938257441', NULL, 3, '2025-11-14 16:18:05', NULL, '2025-11-14 16:18:05'),
(432, 'Ariana Arellano', NULL, NULL, '986432740', 'Virgen del Carmen', 3, '2025-11-14 16:32:26', NULL, '2025-11-14 16:32:26'),
(433, 'Karen Tineo', NULL, NULL, '981877110', 'virgen del carmen mz L lte 34', 3, '2025-11-14 16:33:35', 3, '2025-11-14 16:52:26'),
(434, 'Shirla Lorena C.', NULL, NULL, '944501862', NULL, 3, '2025-11-15 13:22:51', NULL, '2025-11-15 13:22:51'),
(435, 'Bianca Zevallos', NULL, NULL, '981080547', 'Virgen del Carmen mz', 3, '2025-11-15 13:24:09', NULL, '2025-11-15 13:24:09'),
(436, 'Alberto', NULL, NULL, NULL, NULL, 3, '2025-11-26 09:41:42', NULL, '2025-11-26 09:41:42'),
(437, 'Gaby Jara Quispe', NULL, NULL, '993620598', 'virgen del carmen mz K lte', 3, '2025-11-26 10:07:37', NULL, '2025-11-26 10:07:37'),
(438, 'Jhairo Ramos', NULL, NULL, NULL, 'virgen del carmen, cantina', 3, '2025-11-26 10:17:23', NULL, '2025-11-26 10:17:23'),
(439, 'Raúl Espiritú', NULL, NULL, '961924984', NULL, 3, '2025-11-26 10:47:02', NULL, '2025-11-26 10:47:02'),
(440, 'Anderson Palpan', NULL, NULL, '960408145', NULL, 3, '2025-11-26 11:27:56', NULL, '2025-11-26 11:27:56'),
(441, 'Eymy  (Niel)  Alegria', NULL, NULL, '920271162', 'virgen del carmen', 3, '2025-11-26 11:41:06', NULL, '2025-11-26 11:41:06'),
(442, 'Lucero Tupac Romeo', NULL, NULL, '935576809', 'virgen del carmen mz M  lote 13', 3, '2025-11-26 12:10:24', NULL, '2025-11-26 12:10:24'),
(443, 'Alejandro Altuve', NULL, NULL, '917022723', 'por la DINOES', 3, '2025-11-27 13:54:57', 3, '2025-11-27 18:39:52'),
(444, 'Gianfranco', '12312312', NULL, '989872779', 'Cliente para pruebas', 3, '2025-11-29 13:06:22', 3, '2025-11-29 18:15:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `database_history`
--

CREATE TABLE `database_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `action` enum('import','export') NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `database_history`
--

INSERT INTO `database_history` (`id`, `action`, `filename`, `user_id`, `ip_address`, `created_at`) VALUES
(1, 'export', 'backup-veterinaria-2025-11-24_10-30-44.sql', 3, '127.0.0.1', '2025-11-24 22:30:44'),
(2, 'export', 'backup-veterinaria-2025-11-24_10-30-45.sql', 3, '127.0.0.1', '2025-11-24 22:30:45'),
(3, 'export', 'backup-veterinaria-2025-11-24_10-30-45.sql', 3, '127.0.0.1', '2025-11-24 22:30:45'),
(4, 'export', 'backup-veterinaria-2025-11-24_10-30-46.sql', 3, '127.0.0.1', '2025-11-24 22:30:46'),
(5, 'export', 'backup-veterinaria-2025-11-24_10-30-46.sql', 3, '127.0.0.1', '2025-11-24 22:30:46'),
(6, 'export', 'backup-veterinaria-2025-11-24_10-30-47.sql', 3, '127.0.0.1', '2025-11-24 22:30:47'),
(7, 'export', 'backup-veterinaria-2025-11-24_10-30-48.sql', 3, '127.0.0.1', '2025-11-24 22:30:48'),
(8, 'export', 'backup-veterinaria-2025-11-24_10-30-48.sql', 3, '127.0.0.1', '2025-11-24 22:30:48'),
(9, 'import', 'backup-veterinaria-2025-11-24_10-31-51.sql', 3, '127.0.0.1', '2025-11-24 22:32:53'),
(10, 'export', 'backup-veterinaria-2025-11-24_10-35-32.sql', 3, '127.0.0.1', '2025-11-25 03:35:32'),
(11, 'export', 'backup-veterinaria-2025-11-24_16-40-02.sql', 3, '127.0.0.1', '2025-11-25 09:40:02'),
(12, 'export', 'backup-veterinaria-2025-11-24_16-44-18.sql', 3, '127.0.0.1', '2025-11-25 09:44:18'),
(13, 'import', 'backup-veterinaria-2025-11-24_16-45-10.sql', 3, '181.66.102.228', '2025-11-25 09:45:23'),
(14, 'export', 'backup-veterinaria-2025-11-26_11-49-24.sql', 3, '201.240.146.66', '2025-11-26 22:49:24'),
(15, 'import', 'backup-veterinaria-2025-11-27_18-36-13.sql', 3, '127.0.0.1', '2025-11-28 05:36:26'),
(16, 'export', 'backup-veterinaria-2025-11-28_18-22-29.sql', 3, '127.0.0.1', '2025-11-29 05:22:29'),
(17, 'import', 'backup-veterinaria-2025-11-29_18-14-23.sql', 3, '190.42.137.139', '2025-11-30 05:14:51'),
(18, 'import', 'backup-veterinaria-2025-11-30_13-31-29.sql', 3, '127.0.0.1', '2025-11-30 18:31:41'),
(19, 'export', 'backup-veterinaria-2025-11-30_13-33-51.sql', 3, '127.0.0.1', '2025-11-30 18:33:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especie`
--

CREATE TABLE `especie` (
  `id_especie` int(11) NOT NULL,
  `especie` varchar(100) NOT NULL,
  `creater_id` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updater_id` bigint(20) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especie`
--

INSERT INTO `especie` (`id_especie`, `especie`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 'Canino', NULL, NULL, 3, '2025-11-27 18:41:18'),
(2, 'Felino', NULL, NULL, NULL, NULL),
(3, 'Conejo', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_cita`
--

CREATE TABLE `estado_cita` (
  `id_estado_cita` int(11) NOT NULL,
  `estado_cita` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_cita`
--

INSERT INTO `estado_cita` (`id_estado_cita`, `estado_cita`) VALUES
(1, 'PENDIENTE'),
(2, 'ATENDIDO'),
(3, 'CANCELADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_historia_clinica`
--

CREATE TABLE `estado_historia_clinica` (
  `id_estado_historia_clinica` int(11) NOT NULL,
  `estado_historia_clinica` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_historia_clinica`
--

INSERT INTO `estado_historia_clinica` (`id_estado_historia_clinica`, `estado_historia_clinica`, `descripcion`) VALUES
(1, 'ABIERTO', 'Caso activo en tratamiento o seguimiento'),
(2, 'EN OBSERVACIÓN', 'Caso en espera de evolución o estudios'),
(3, 'REFERIDO', 'Caso derivado a otro especialista o clínica'),
(4, 'CERRADO', 'Caso finalizado y sin seguimiento pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_mascota`
--

CREATE TABLE `estado_mascota` (
  `id_estado_mascota` int(11) NOT NULL,
  `estado_mascota` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_mascota`
--

INSERT INTO `estado_mascota` (`id_estado_mascota`, `estado_mascota`) VALUES
(1, 'SANO'),
(2, 'ENFERMO'),
(3, 'TRATAMIENTO'),
(4, 'FALLECIDO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica`
--

CREATE TABLE `historia_clinica` (
  `id_historia_clinica` int(11) NOT NULL,
  `id_mascota` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_motivo_historia_clinica` int(11) DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_estado_historia_clinica` int(11) NOT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica`
--

INSERT INTO `historia_clinica` (`id_historia_clinica`, `id_mascota`, `fecha`, `id_motivo_historia_clinica`, `detalle`, `observaciones`, `id_estado_historia_clinica`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(14, 3, '2025-09-26', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-26 11:52:58', NULL, '2025-10-09 11:52:58'),
(15, 2, '2025-09-20', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-20 12:14:58', 3, '2025-10-09 12:15:02'),
(16, 2, '2025-09-25', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-25 12:17:01', NULL, '2025-10-09 12:17:01'),
(17, 7, '2025-09-27', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-27 14:26:32', 3, '2025-10-09 14:27:10'),
(18, 8, '2025-09-28', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-28 14:27:49', 3, '2025-10-09 14:28:39'),
(19, 4, '2025-09-27', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-27 14:29:27', NULL, '2025-10-09 14:29:27'),
(20, 9, '2025-09-25', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-25 14:30:32', NULL, '2025-10-09 14:30:32'),
(21, 13, '2025-09-23', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-23 14:31:35', NULL, '2025-10-09 14:31:35'),
(22, 1, '2025-09-21', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-21 14:34:34', NULL, '2025-10-09 14:34:34'),
(23, 18, '2025-09-21', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-21 14:35:46', NULL, '2025-10-09 14:35:46'),
(24, 19, '2025-09-21', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-21 14:38:12', NULL, '2025-10-09 14:38:12'),
(25, 20, '2025-09-21', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-21 14:40:00', NULL, '2025-10-09 14:40:00'),
(26, 21, '2025-09-21', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-21 14:41:51', NULL, '2025-10-09 14:41:51'),
(27, 2, '2025-09-20', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-20 14:43:45', NULL, '2025-10-09 14:43:45'),
(28, 25, '2025-09-19', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-19 14:45:39', NULL, '2025-10-09 14:45:39'),
(29, 26, '2025-09-19', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-19 14:46:43', NULL, '2025-10-09 14:46:43'),
(30, 27, '2025-09-20', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-20 14:48:04', NULL, '2025-10-09 14:48:04'),
(31, 28, '2025-09-20', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-20 14:49:46', NULL, '2025-10-09 14:49:46'),
(32, 29, '2025-09-19', 4, NULL, 'Nada', 4, 3, '2025-09-19 14:51:28', NULL, '2025-10-09 14:51:28'),
(33, 30, '2025-09-19', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-19 14:52:16', NULL, '2025-10-09 14:52:16'),
(34, 31, '2025-09-18', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-18 14:52:56', NULL, '2025-10-09 14:52:56'),
(35, 32, '2025-09-18', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-18 14:53:29', NULL, '2025-10-09 14:53:29'),
(36, 33, '2025-09-18', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-18 14:54:26', NULL, '2025-10-09 14:54:26'),
(37, 34, '2025-09-17', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-17 14:55:40', NULL, '2025-10-09 14:55:40'),
(38, 22, '2025-09-16', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-16 14:58:33', NULL, '2025-10-09 14:58:33'),
(39, 23, '2025-09-17', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-17 15:00:25', NULL, '2025-10-09 15:00:25'),
(40, 35, '2025-09-14', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-14 15:02:17', NULL, '2025-10-09 15:02:17'),
(41, 36, '2025-09-14', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-14 15:03:11', NULL, '2025-10-09 15:03:11'),
(42, 37, '2025-09-13', 2, 'Baño y corte', 'Nada', 4, 3, '2025-09-13 15:05:37', 3, '2025-10-09 15:06:18'),
(43, 40, '2025-09-13', 4, NULL, 'Nada', 1, 3, '2025-09-13 15:07:18', NULL, '2025-10-09 15:07:18'),
(44, 44, '2025-09-11', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-11 15:12:39', 3, '2025-11-26 09:52:36'),
(45, 48, '2025-09-05', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-05 15:14:54', NULL, '2025-10-09 15:14:54'),
(46, 49, '2025-09-05', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-05 15:16:00', NULL, '2025-10-09 15:16:00'),
(47, 50, '2025-09-04', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-04 15:18:05', NULL, '2025-10-09 15:18:05'),
(48, 51, '2025-09-04', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-04 15:19:46', NULL, '2025-10-09 15:19:46'),
(49, 52, '2025-09-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-03 15:21:10', NULL, '2025-10-09 15:21:10'),
(50, 53, '2025-09-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-03 15:22:20', NULL, '2025-10-09 15:22:20'),
(51, 54, '2025-09-28', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-28 15:23:01', NULL, '2025-10-09 15:23:01'),
(52, 55, '2025-09-28', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-28 15:23:49', NULL, '2025-10-09 15:23:49'),
(53, 56, '2025-09-28', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-28 15:24:54', NULL, '2025-10-09 15:24:54'),
(54, 58, '2025-09-30', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-30 15:27:43', NULL, '2025-10-09 15:27:43'),
(55, 59, '2025-09-29', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-29 15:29:45', NULL, '2025-10-09 15:29:45'),
(56, 60, '2025-09-29', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-29 15:30:44', NULL, '2025-10-09 15:30:44'),
(57, 61, '2025-09-29', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-09-29 15:32:52', NULL, '2025-10-09 15:32:52'),
(58, 62, '2025-10-01', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-01 15:33:45', NULL, '2025-10-09 15:33:45'),
(59, 57, '2025-10-02', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-02 15:34:19', NULL, '2025-10-09 15:34:19'),
(60, 68, '2025-10-02', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-02 15:35:16', NULL, '2025-10-09 15:35:16'),
(61, 64, '2025-10-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-03 15:36:33', NULL, '2025-10-09 15:36:33'),
(62, 65, '2025-10-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-03 15:37:09', NULL, '2025-10-09 15:37:09'),
(63, 66, '2025-10-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-03 15:37:56', NULL, '2025-10-09 15:37:56'),
(64, 67, '2025-10-03', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-03 15:38:54', NULL, '2025-10-09 15:38:54'),
(65, 70, '2025-10-04', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-04 15:39:42', NULL, '2025-10-09 15:39:42'),
(66, 49, '2025-10-02', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-02 15:42:05', NULL, '2025-10-09 15:42:05'),
(67, 48, '2025-10-04', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-04 15:45:58', NULL, '2025-10-09 15:45:58'),
(68, 73, '2025-10-07', 2, 'Baño y corte', 'Nada', 4, 3, '2025-10-07 15:47:24', NULL, '2025-10-09 15:47:24'),
(69, 72, '2025-10-07', 2, 'Baño y corte', 'Nada', 4, 3, '2025-10-07 15:48:20', NULL, '2025-10-09 15:48:20'),
(70, 71, '2025-10-07', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-07 15:49:08', NULL, '2025-10-09 15:49:08'),
(71, 77, '2025-10-08', 2, 'Baño y aseo', 'Nada', 4, 3, '2025-10-08 15:49:48', NULL, '2025-10-09 15:49:48'),
(72, 78, '2025-10-08', 2, 'Baño y aseo', 'Nada', 1, 3, '2025-10-08 16:10:08', 3, '2025-10-10 14:55:55'),
(73, 46, '2025-10-07', 50, 'PRUEBA', 'historia para pruebas del sistema', 3, 3, '2025-10-10 19:17:06', 3, '2025-10-11 19:16:27'),
(74, 1, '2025-09-02', 1, 'Herida abierta', NULL, 1, 3, '2025-10-11 16:44:17', NULL, '2025-10-11 16:44:17'),
(75, 5, '2025-09-25', 1, 'Accidente motocicleta', NULL, 1, 3, '2025-10-11 17:33:36', NULL, '2025-10-11 17:33:36'),
(76, 6, '2025-09-26', 1, 'Herida por mordedura de perro', NULL, 1, 3, '2025-10-11 17:41:19', 3, '2025-10-11 18:34:12'),
(77, 25, '2025-09-18', 24, 'Se rasca mucho , tiene heridas en el lomo, orejas irritadas y escamosas', NULL, 1, 3, '2025-10-11 17:50:38', NULL, '2025-10-11 17:50:38'),
(78, 39, '2025-09-12', 24, 'Se  rasca mucho el lomo y cerca a su cola, presencia de pulgas', NULL, 1, 3, '2025-10-11 18:27:57', NULL, '2025-10-11 18:27:57'),
(79, 40, '2025-09-12', 4, 'Esterilización', NULL, 1, 3, '2025-10-11 18:39:02', NULL, '2025-10-11 18:39:02'),
(80, 41, '2025-09-12', 24, 'Se rasca demasiado y tiene lesiones en el lomo, hay presencia de pulgas', NULL, 4, 3, '2025-10-11 18:52:13', NULL, '2025-10-11 18:52:13'),
(81, 42, '2025-09-12', 24, 'Se rasca y lame mucho la pata derecha, no tiene pulgas , tiene collar seresto recién hace 20 días lo ha comprado, a la oscultación vemos entre sus dedos de la pata que se lame tiene herida,', NULL, 4, 3, '2025-10-11 18:55:59', NULL, '2025-10-11 18:55:59'),
(82, 45, '2025-09-09', 24, 'Escosor y enrojecimiento de oreja derecha', 'se realiza hisopado del oído derecho.\nse recomienda dos días de tratamiento en inyectable\nmeloxisan y enropro\nhisopado:\ncoritcoide\nanalgesico:', 2, 3, '2025-10-11 19:01:03', NULL, '2025-10-11 19:01:03'),
(83, 47, '2025-09-07', 24, 'Problema de piel', NULL, 4, 3, '2025-10-11 19:01:49', NULL, '2025-10-11 19:01:49'),
(84, 57, '2025-09-30', 10, 'Tiene diarrea y vómito desde el día anterior, se diagnosticó enterocolitis', NULL, 2, 3, '2025-10-11 19:04:54', NULL, '2025-10-11 19:04:54'),
(85, 69, '2025-10-04', 1, 'Abertura de piel, parte ventral del cuello ocasionado por mordedura de perro.', NULL, 2, 3, '2025-10-11 19:06:59', NULL, '2025-10-11 19:06:59'),
(86, 70, '2025-10-05', 1, 'Herida por mordedura craneal debajo del ojo izquierda', 'Dueño solo aplica la medicación y se le realiza una limpieza.', 1, 3, '2025-10-11 19:09:54', 3, '2025-10-11 19:10:09'),
(87, 82, '2025-10-10', 9, 'Perrita tiene arcadas, tipo tos, ganglios inflamados', NULL, 2, 3, '2025-10-14 16:40:13', NULL, '2025-10-14 16:40:13'),
(88, 78, '2025-10-09', 10, 'Perrito tiene diarrea hace una semana y vomito recién en el dia', 'Perrito lo compró por internet hace una semana, persona que le vendió dice q le ha puesto la primera vacuna', 4, 3, '2025-10-16 17:15:27', 3, '2025-10-22 15:44:37'),
(89, 68, '2025-10-20', 50, 'vino', NULL, 1, 3, '2025-10-20 15:18:46', NULL, '2025-10-20 15:18:46'),
(90, 86, '2025-10-10', 2, 'cuchilla nro 10', NULL, 4, 3, '2025-10-20 15:47:06', NULL, '2025-10-20 15:47:06'),
(91, 74, '2025-10-07', 4, 'esterilización', NULL, 1, 3, '2025-10-20 16:49:33', NULL, '2025-10-20 16:49:33'),
(92, 75, '2025-10-08', 2, 'baño', 'por el corte de uña utilizamos anestésico', 4, 3, '2025-10-20 17:13:28', 3, '2025-10-20 17:15:00'),
(93, 85, '2025-10-09', 50, 'cojea de la parte trasera , pata derecha', NULL, 2, 3, '2025-10-20 17:21:03', 3, '2025-10-20 18:33:24'),
(94, 81, '2025-10-09', 18, 'herida en la pata trasera, con pus', 'se realiza limpieza y tratamiento con inyectable', 1, 3, '2025-10-20 17:25:12', 3, '2025-10-20 18:31:32'),
(95, 85, '2025-10-11', 51, 'corte nro 3 1/4', NULL, 4, 3, '2025-10-20 18:34:17', 3, '2025-10-20 18:35:19'),
(96, 80, '2025-10-09', 51, 'corte snauzer', NULL, 4, 3, '2025-10-20 18:36:22', NULL, '2025-10-20 18:36:22'),
(97, 87, '2025-10-21', 2, 'Cachorra encontrada', NULL, 1, 3, '2025-10-21 09:49:53', 3, '2025-10-21 10:53:40'),
(98, 88, '2025-10-11', 51, NULL, NULL, 4, 3, '2025-10-22 15:53:44', 3, '2025-10-22 15:55:51'),
(99, 89, '2025-10-11', 2, NULL, NULL, 4, 3, '2025-10-22 15:56:25', NULL, '2025-10-22 15:56:25'),
(100, 90, '2025-10-13', 50, 'mascota viene vomitando, se presume que ha comido veneno en el parque', NULL, 1, 3, '2025-10-22 16:02:49', 3, '2025-10-22 16:22:35'),
(101, 91, '2025-10-13', 4, 'otohematoma', 'oreja inflamada', 1, 3, '2025-10-22 16:30:50', NULL, '2025-10-22 16:30:50'),
(102, 92, '2025-10-13', 5, 'triple felina y desparasitación', NULL, 4, 3, '2025-10-22 16:37:43', NULL, '2025-10-22 16:37:43'),
(103, 93, '2025-10-13', 5, 'triple felina, desparasitación y castración', NULL, 1, 3, '2025-10-22 17:03:30', NULL, '2025-10-22 17:03:30'),
(104, 94, '2025-10-13', 1, 'choque de auto', 'heridas,', 1, 3, '2025-10-22 17:09:41', NULL, '2025-10-22 17:09:41'),
(105, 95, '2025-10-14', 2, 'Baño', 'tiene problema de piel', 4, 3, '2025-10-22 18:24:19', 3, '2025-10-22 18:25:38'),
(106, 50, '2025-10-17', 2, 'baño', NULL, 4, 3, '2025-10-22 19:04:24', NULL, '2025-10-22 19:04:24'),
(107, 51, '2025-10-17', 2, 'baño', NULL, 4, 3, '2025-10-22 19:05:31', NULL, '2025-10-22 19:05:31'),
(108, 96, '2025-10-18', 51, 'baño', NULL, 4, 3, '2025-10-22 19:10:20', NULL, '2025-10-22 19:10:20'),
(109, 97, '2025-10-18', 2, 'baño', NULL, 4, 3, '2025-10-22 19:11:32', NULL, '2025-10-22 19:11:32'),
(110, 53, '2025-10-18', 2, 'baño', NULL, 4, 3, '2025-10-22 19:12:39', NULL, '2025-10-22 19:12:39'),
(111, 98, '2025-10-18', 51, 'baño y corte nro 10', NULL, 4, 3, '2025-10-22 19:19:09', NULL, '2025-10-22 19:19:09'),
(112, 38, '2025-09-13', 51, 'corte a tijera', NULL, 4, 3, '2025-10-22 19:34:18', NULL, '2025-10-22 19:34:18'),
(113, 38, '2025-10-18', 51, 'corte a tijera', 'tiene alopecia', 4, 3, '2025-10-22 19:38:58', NULL, '2025-10-22 19:38:58'),
(114, 99, '2025-10-18', 2, 'baño y corte de parte trasera', NULL, 4, 3, '2025-10-22 19:43:04', NULL, '2025-10-22 19:43:04'),
(115, 1, '2025-10-18', 2, 'baño', 'tiene tumores mamarios, tumor debajo del año', 4, 3, '2025-10-22 19:45:18', NULL, '2025-10-22 19:45:18'),
(116, 100, '2025-10-19', 2, 'baño', NULL, 4, 3, '2025-10-22 19:49:53', NULL, '2025-10-22 19:49:53'),
(117, 36, '2025-10-19', 51, 'corte 5f', NULL, 4, 3, '2025-10-22 19:53:06', NULL, '2025-10-22 19:53:06'),
(118, 35, '2025-10-19', 2, 'baño', NULL, 4, 3, '2025-10-22 19:54:26', NULL, '2025-10-22 19:54:26'),
(119, 101, '2025-10-19', 4, 'esterilización', NULL, 4, 3, '2025-10-22 20:00:39', NULL, '2025-10-22 20:00:39'),
(120, 4, '2025-10-21', 24, 'corticoide', NULL, 4, 3, '2025-10-22 20:04:37', NULL, '2025-10-22 20:04:37'),
(121, 102, '2025-10-22', 6, 'telopar', NULL, 4, 3, '2025-10-22 20:07:55', NULL, '2025-10-22 20:07:55'),
(122, 103, '2025-10-23', 51, 'Corte NRO 7f, cabeza redonda', NULL, 4, 3, '2025-10-23 18:52:48', NULL, '2025-10-23 18:52:48'),
(123, 57, '2025-10-25', 2, 'Baño y antipulgas', NULL, 4, 3, '2025-10-25 18:07:34', NULL, '2025-10-25 18:07:34'),
(124, 38, '2025-10-25', 4, 'Esterilización', NULL, 1, 3, '2025-10-25 18:23:54', NULL, '2025-10-25 18:23:54'),
(125, 104, '2025-10-25', 2, 'Baño', NULL, 4, 3, '2025-10-25 18:32:01', NULL, '2025-10-25 18:32:01'),
(126, 105, '2025-10-25', 51, 'Baño y corte y antipulga', NULL, 4, 3, '2025-10-25 18:33:43', NULL, '2025-10-25 18:33:43'),
(127, 92, '2025-10-25', 1, 'Felino se cayó saltando. No tiene fracturas. Tiene herida en la encias', NULL, 1, 3, '2025-10-25 18:36:24', NULL, '2025-10-25 18:36:24'),
(128, 86, '2025-10-25', 2, 'Baño y antipulga', NULL, 4, 3, '2025-10-25 18:38:44', 3, '2025-10-26 19:10:27'),
(129, 9, '2025-10-26', 2, 'Baño y antipulga y antiparasitario cortesía', NULL, 4, 3, '2025-10-28 10:50:24', NULL, '2025-10-28 10:50:24'),
(130, 107, '2025-10-27', 8, 'Perro vivió en la calle y los vecinos lo alimentaban, ahora va a vivir en casa, está bajo de peso, ojos lagañosos, se rasca mucho. El 25 le pusieron nexgard', NULL, 1, 3, '2025-10-28 12:28:10', NULL, '2025-10-28 12:28:10'),
(131, 55, '2025-10-27', 2, 'Baño y antipulga', 'Antipulga promoción 30', 4, 3, '2025-10-28 12:31:43', NULL, '2025-10-28 12:31:43'),
(132, 56, '2025-10-27', 2, 'Baño y antipulgas', 'Antipulgas promoción 30', 4, 3, '2025-10-28 12:33:28', NULL, '2025-10-28 12:33:28'),
(133, 108, '2025-10-27', 51, 'Corte nro10; tiene muchas motas, ojos saltones, el ojo derecho desorbitado, posible enuclasion, así está hace 1 año', NULL, 4, 3, '2025-10-28 12:38:56', NULL, '2025-10-28 12:38:56'),
(134, 109, '2025-10-19', 8, 'Viene por dolor muscular, cojea para delantera derecha', NULL, 1, 3, '2025-10-28 14:10:30', NULL, '2025-10-28 14:10:30'),
(135, 110, '2025-10-28', 8, 'No come hace dos días, han visto en su arenero parásitos', NULL, 1, 3, '2025-10-28 19:24:05', NULL, '2025-10-28 19:24:05'),
(136, 23, '2025-10-28', 51, 'Cuchilla NRO 5f', NULL, 4, 3, '2025-10-28 19:27:59', NULL, '2025-10-28 19:27:59'),
(137, 111, '2025-10-30', 51, 'Baño y corte', NULL, 1, 3, '2025-11-07 14:57:39', NULL, '2025-11-07 14:57:39'),
(138, 112, '2025-10-30', 51, 'NRO 7f', NULL, 1, 3, '2025-11-07 14:59:38', NULL, '2025-11-07 14:59:38'),
(139, 113, '2025-10-30', 51, 'Solo corte', NULL, 1, 3, '2025-11-07 15:03:24', NULL, '2025-11-07 15:03:24'),
(140, 114, '2025-10-30', 51, 'Solo corte', NULL, 1, 3, '2025-11-07 15:04:21', NULL, '2025-11-07 15:04:21'),
(141, 115, '2025-10-30', 51, 'Corte 5F', NULL, 1, 3, '2025-11-07 15:05:37', NULL, '2025-11-07 15:05:37'),
(142, 2, '2025-10-30', 2, 'Baño de limpieza', NULL, 1, 3, '2025-11-07 15:07:02', NULL, '2025-11-07 15:07:02'),
(143, 116, '2025-10-30', 51, 'Corte cuchilla NRO 10', NULL, 1, 3, '2025-11-07 15:08:29', NULL, '2025-11-07 15:08:29'),
(144, 20, '2025-10-31', 51, 'Corte cuchilla NRO 5F', NULL, 1, 3, '2025-11-07 15:09:55', NULL, '2025-11-07 15:09:55'),
(145, 21, '2025-10-31', 2, 'Baño de limpieza', NULL, 1, 3, '2025-11-07 15:11:13', NULL, '2025-11-07 15:11:13'),
(146, 4, '2025-10-31', 2, 'Baño de limpieza', NULL, 1, 3, '2025-11-07 15:13:44', NULL, '2025-11-07 15:13:44'),
(147, 3, '2025-10-31', 51, 'Baño de limpieza y corte', NULL, 1, 3, '2025-11-07 16:40:10', NULL, '2025-11-07 16:40:10'),
(148, 32, '2025-10-31', 51, 'Corte cuerpo 5f patas poodles, poca barba', NULL, 1, 3, '2025-11-07 16:43:08', NULL, '2025-11-07 16:43:08'),
(149, 7, '2025-11-03', 2, 'Baño de limpieza', NULL, 1, 3, '2025-11-07 16:48:36', NULL, '2025-11-07 16:48:36'),
(150, 41, '2025-11-03', 51, 'Corte NRO 10', NULL, 1, 3, '2025-11-07 16:51:21', NULL, '2025-11-07 16:51:21'),
(151, 117, '2025-11-03', 2, 'Corte de pelaje, corte de uña, vacuna sextuple con rabia', NULL, 1, 3, '2025-11-07 16:55:47', NULL, '2025-11-07 16:55:47'),
(152, 118, '2025-11-03', 51, 'Corte NRO 7f', NULL, 1, 3, '2025-11-07 17:30:19', NULL, '2025-11-07 17:30:19'),
(153, 119, '2025-11-03', 6, 'Desparasitante', NULL, 1, 3, '2025-11-07 18:22:28', NULL, '2025-11-07 18:22:28'),
(154, 120, '2025-11-03', 40, 'Se rasca mucho, perdida de pelaje,', NULL, 1, 3, '2025-11-07 18:26:38', NULL, '2025-11-07 18:26:38'),
(155, 121, '2025-11-03', 1, 'perro atropellado, peso 6.6 kg', NULL, 1, 3, '2025-11-10 16:51:56', NULL, '2025-11-10 16:51:56'),
(156, 122, '2025-11-04', 2, 'baño de limpieza', NULL, 1, 3, '2025-11-14 10:57:12', NULL, '2025-11-14 10:57:12'),
(157, 123, '2025-11-04', 51, 'corte nro 7f', NULL, 1, 3, '2025-11-14 11:02:33', NULL, '2025-11-14 11:02:33'),
(158, 57, '2025-11-05', 51, 'corte nro 7f por verano, tiene muchas pulgas', '6.40 kg', 1, 3, '2025-11-14 11:06:42', 3, '2025-11-14 11:09:10'),
(159, 124, '2025-11-05', 51, 'corte con cuchilla nro10', NULL, 1, 3, '2025-11-14 11:10:11', NULL, '2025-11-14 11:10:11'),
(160, 125, '2025-11-05', 2, 'baño y antipulga', 'peso 4.6', 1, 3, '2025-11-14 11:12:16', 3, '2025-11-14 11:14:19'),
(161, 60, '2025-11-05', 51, 'corte nro 5f', NULL, 1, 3, '2025-11-14 11:15:23', NULL, '2025-11-14 11:15:23'),
(162, 61, '2025-11-05', 51, NULL, NULL, 1, 3, '2025-11-14 11:19:54', NULL, '2025-11-14 11:19:54'),
(163, 126, '2025-11-07', 8, 'problema de piel, tiene escozor, calvicie  en el lomo', '35 kg, 8 meses', 1, 3, '2025-11-14 15:12:08', NULL, '2025-11-14 15:12:08'),
(164, 48, '2025-11-08', 2, 'baño medicado y antiparasito interno', NULL, 1, 3, '2025-11-14 15:26:57', NULL, '2025-11-14 15:26:57'),
(165, 49, '2025-11-08', 2, 'baño de limpieza y antiparasitario interno', NULL, 1, 3, '2025-11-14 15:30:34', NULL, '2025-11-14 15:30:34'),
(166, 67, '2025-11-08', 2, 'baño de limpieza', NULL, 1, 3, '2025-11-14 15:33:18', NULL, '2025-11-14 15:33:18'),
(167, 127, '2025-11-08', 2, 'solo corte', NULL, 1, 3, '2025-11-14 15:37:05', NULL, '2025-11-14 15:37:05'),
(168, 128, '2025-11-08', 5, 'cuádruple', NULL, 1, 3, '2025-11-14 15:44:09', NULL, '2025-11-14 15:44:09'),
(169, 129, '2025-11-09', 4, 'castración', NULL, 1, 3, '2025-11-14 15:51:40', NULL, '2025-11-14 15:51:40'),
(170, 30, '2025-11-09', 51, 'baño de limpieza, corte snauzer', NULL, 1, 3, '2025-11-14 15:57:13', NULL, '2025-11-14 15:57:13'),
(171, 66, '2025-11-09', 2, 'baño medicado y desparasitación interna', NULL, 1, 3, '2025-11-14 15:59:18', NULL, '2025-11-14 15:59:18'),
(172, 65, '2025-11-09', 2, 'baño medicado y antiparasitario interno', NULL, 1, 3, '2025-11-14 16:02:08', NULL, '2025-11-14 16:02:08'),
(173, 130, '2025-11-10', 51, 'baño de limpieza corte nro 5f', NULL, 1, 3, '2025-11-14 16:06:30', NULL, '2025-11-14 16:06:30'),
(174, 107, '2025-11-11', 8, 'mascota desapareció 15 dias,', '13.2 kg', 1, 3, '2025-11-14 16:11:30', NULL, '2025-11-14 16:11:30'),
(175, 131, '2025-11-11', 51, 'baño de limpieza, corte 5f', NULL, 1, 3, '2025-11-14 16:16:01', NULL, '2025-11-14 16:16:01'),
(176, 132, '2025-11-11', 51, 'baño de limpieza, corte nro 10', 'tiiene problemaa de piel y escozor', 1, 3, '2025-11-14 16:26:27', 3, '2025-11-14 16:27:44'),
(177, 70, '2025-11-13', 51, 'baño y corte , antipulgas, tiene alergia DAPP', 'PESO 10.6', 1, 3, '2025-11-14 16:29:02', 3, '2025-11-14 16:31:02'),
(178, 133, '2025-11-14', 51, 'baño de limpieza, corte 10 todo el cuerpo', 'tiene problemas de piel', 1, 3, '2025-11-14 16:39:31', NULL, '2025-11-14 16:39:31'),
(179, 134, '2025-11-14', 8, 'felina a tenido crías hace 20 días, la felina esta débil, tiene como calambres HIPOCALCEMIA-ECLAMPSIA', NULL, 1, 3, '2025-11-14 16:47:37', NULL, '2025-11-14 16:47:37'),
(180, 135, '2025-11-15', 2, 'Baño de limpieza y retoque cara', NULL, 1, 3, '2025-11-15 13:30:44', NULL, '2025-11-15 13:30:44'),
(181, 136, '2025-11-15', 10, 'Perrito está con diarrea', NULL, 1, 3, '2025-11-15 13:39:13', 3, '2025-11-24 16:36:49'),
(184, 137, '2025-11-15', 5, 'primer cuádruple', NULL, 1, 3, '2025-11-26 09:44:11', NULL, '2025-11-26 09:44:11'),
(185, 44, '2025-11-15', 51, NULL, NULL, 1, 3, '2025-11-26 09:56:24', NULL, '2025-11-26 09:56:24'),
(186, 69, '2025-11-16', 51, NULL, NULL, 1, 3, '2025-11-26 09:57:43', NULL, '2025-11-26 09:57:43'),
(187, 138, '2025-11-16', 51, NULL, NULL, 1, 3, '2025-11-26 10:01:49', NULL, '2025-11-26 10:01:49'),
(188, 136, '2025-11-16', 51, NULL, NULL, 1, 3, '2025-11-26 10:03:37', NULL, '2025-11-26 10:03:37'),
(189, 140, '2025-11-17', 8, NULL, NULL, 1, 3, '2025-11-26 10:13:43', NULL, '2025-11-26 10:13:43'),
(190, 139, '2025-11-17', 8, NULL, NULL, 1, 3, '2025-11-26 10:15:59', NULL, '2025-11-26 10:15:59'),
(191, 141, '2025-11-19', 1, 'caída del tercer piso, no tiene heridas, pero si  presenta dolor parte de la cruz y lomo, si ´puede caminar, no ha vomitado ni defecado, a orinado pero normal', NULL, 1, 3, '2025-11-26 10:20:52', 3, '2025-11-26 10:33:19'),
(192, 31, '2025-11-19', 2, 'baño de limpieza', NULL, 1, 3, '2025-11-26 10:36:58', NULL, '2025-11-26 10:36:58'),
(193, 142, '2025-11-19', 8, 'perrita  hace 10 días esta inapetente, le han visto que ha estado con mucosidad en la nariz, esta en su periodo de celo', NULL, 1, 3, '2025-11-26 10:50:52', NULL, '2025-11-26 10:50:52'),
(194, 59, '2025-11-20', 2, 'baño medicado', NULL, 1, 3, '2025-11-26 11:19:48', NULL, '2025-11-26 11:19:48'),
(195, 58, '2025-11-20', 2, 'baño medicado', NULL, 1, 3, '2025-11-26 11:21:25', NULL, '2025-11-26 11:21:25'),
(196, 7, '2025-11-20', 2, NULL, NULL, 1, 3, '2025-11-26 11:23:00', NULL, '2025-11-26 11:23:00'),
(197, 20, '2025-11-20', 2, NULL, NULL, 1, 3, '2025-11-26 11:24:02', NULL, '2025-11-26 11:24:02'),
(198, 21, '2025-11-20', 2, NULL, NULL, 1, 3, '2025-11-26 11:25:07', NULL, '2025-11-26 11:25:07'),
(199, 143, '2025-11-22', 51, 'corte 5f , baño de limpieza', NULL, 1, 3, '2025-11-26 11:31:01', NULL, '2025-11-26 11:31:01'),
(200, 4, '2025-11-22', 51, 'corte 5f, baño de limpieza', 'peso 10.2', 1, 3, '2025-11-26 11:32:07', 3, '2025-11-26 11:33:17'),
(201, 3, '2025-11-22', 2, NULL, NULL, 1, 3, '2025-11-26 11:33:37', NULL, '2025-11-26 11:33:37'),
(202, 64, '2025-11-22', 51, 'peso 6.2', NULL, 1, 3, '2025-11-26 11:35:41', NULL, '2025-11-26 11:35:41'),
(203, 37, '2025-11-22', 2, 'baño de limpieza', 'peso 5.10', 1, 3, '2025-11-26 11:37:27', 3, '2025-11-26 11:38:58'),
(204, 144, '2025-11-22', 8, 'viene por escosor por dermatitis alérgica por picadura de pulga', NULL, 1, 3, '2025-11-26 11:52:31', NULL, '2025-11-26 11:52:31'),
(205, 23, '2025-11-23', 2, 'baño', NULL, 1, 3, '2025-11-26 11:56:26', NULL, '2025-11-26 11:56:26'),
(206, 97, '2025-11-23', 10, 'diarrea con sangre (MELENA),', NULL, 1, 3, '2025-11-26 12:00:07', NULL, '2025-11-26 12:00:07'),
(207, 145, '2025-11-24', 51, 'corte 5f , baño de limpieza', NULL, 1, 3, '2025-11-26 12:13:29', NULL, '2025-11-26 12:13:29'),
(208, 9, '2025-11-24', 2, 'baño de limpieza, antipulga y antiparasitario', NULL, 1, 3, '2025-11-26 12:14:42', NULL, '2025-11-26 12:14:42'),
(209, 48, '2025-11-25', 2, 'baño y antiparasitario', NULL, 1, 3, '2025-11-26 12:18:17', NULL, '2025-11-26 12:18:17'),
(210, 49, '2025-11-25', 2, 'baño de limpieza y antiparasitario  interno', NULL, 1, 3, '2025-11-26 12:19:30', NULL, '2025-11-26 12:19:30'),
(211, 146, '2025-11-26', 51, 'corte nro 10, baño de limpieza', NULL, 1, 3, '2025-11-27 13:59:33', NULL, '2025-11-27 13:59:33'),
(212, 147, '2025-11-26', 51, 'corte nro 10, baño de limpieza', NULL, 1, 3, '2025-11-27 14:00:41', NULL, '2025-11-27 14:00:41'),
(213, 148, '2025-11-27', 18, 'hace 10 días aprox., tuvo un corte en la parte trasera, la herida se llenó de pus, la cual reventó, ahora no tiene pus, pero el animal siente dolor, la herida está cerrando por segunda intención, se le recomienda antibiótico y antiinflamatorio el tratamiento por dos días', NULL, 1, 3, '2025-11-27 14:05:12', NULL, '2025-11-27 14:05:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica_anamnesis`
--

CREATE TABLE `historia_clinica_anamnesis` (
  `id_historia_clinica_anamnesis` int(11) NOT NULL,
  `id_historia_clinica` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `temperatura` float NOT NULL,
  `frecuencia_cardiaca` float DEFAULT NULL,
  `frecuencia_respiratoria` int(11) DEFAULT NULL,
  `tiempo_llenado_capilar` float DEFAULT NULL,
  `peso` float DEFAULT NULL,
  `archivo` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica_anamnesis`
--

INSERT INTO `historia_clinica_anamnesis` (`id_historia_clinica_anamnesis`, `id_historia_clinica`, `fecha`, `hora`, `temperatura`, `frecuencia_cardiaca`, `frecuencia_respiratoria`, `tiempo_llenado_capilar`, `peso`, `archivo`, `observaciones`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 73, '2025-10-11', '12:34:56', 2, 3, 4, 5, 0, '', NULL, 3, '2025-10-10 21:15:46', NULL, '2025-10-11 20:09:46'),
(2, 73, '2025-10-12', NULL, 1, 2, 3, 4, 0, '', NULL, 3, '2025-10-11 20:13:22', NULL, '2025-10-11 20:13:22'),
(3, 87, '2025-10-10', '10:30:00', 38.6, NULL, NULL, NULL, 0, '', NULL, 3, '2025-10-14 16:42:09', NULL, '2025-10-14 16:42:09'),
(4, 134, '2025-10-28', '14:22:00', 38.6, 60, 120, 2, 0, '', NULL, 3, '2025-10-28 14:22:31', NULL, '2025-10-28 14:22:31'),
(5, 135, '2025-10-28', '15:40:00', 38.6, NULL, NULL, NULL, 0, '', NULL, 3, '2025-10-28 19:26:44', NULL, '2025-10-28 19:26:44'),
(6, 155, '2025-11-03', '20:30:00', 38.7, 125, 55, 2, 0, '', NULL, 3, '2025-11-10 16:59:20', NULL, '2025-11-10 16:59:20'),
(7, 181, '2025-11-15', '23:22:00', 391, 115, 70, 2, 0, '', NULL, 3, '2025-11-15 13:41:07', NULL, '2025-11-15 13:41:07'),
(8, 193, '2025-11-19', '12:35:00', 38.7, 115, 55, 2, 2.6, '', NULL, 3, '2025-11-26 10:52:12', NULL, '2025-11-26 10:52:12'),
(9, 206, '2025-11-23', '12:04:00', 39.6, 120, 60, 2, 15.6, '', NULL, 3, '2025-11-26 12:01:27', NULL, '2025-11-26 12:01:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica_medicamento`
--

CREATE TABLE `historia_clinica_medicamento` (
  `id_historia_clinica_medicamento` int(11) NOT NULL,
  `id_historia_clinica` int(11) NOT NULL,
  `id_medicamento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `precio` float NOT NULL,
  `duracion` varchar(50) DEFAULT NULL,
  `archivo` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica_medicamento`
--

INSERT INTO `historia_clinica_medicamento` (`id_historia_clinica_medicamento`, `id_historia_clinica`, `id_medicamento`, `fecha`, `dosis`, `precio`, `duracion`, `archivo`, `observaciones`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(6, 73, 61, '2025-10-11', '100 ml', 0, NULL, '0', NULL, 3, '2025-10-10 19:37:28', NULL, '2025-10-11 19:29:48'),
(7, 77, 55, '2025-09-18', NULL, 40, NULL, '0', NULL, 3, '2025-10-11 17:58:39', NULL, '2025-10-11 17:58:39'),
(8, 77, 56, '2025-09-18', NULL, 30, NULL, '0', NULL, 3, '2025-10-11 18:00:29', NULL, '2025-10-11 18:00:29'),
(9, 78, 55, '2025-09-12', NULL, 50, NULL, '0', NULL, 3, '2025-10-11 18:28:15', NULL, '2025-10-11 18:28:15'),
(10, 78, 57, '2025-09-12', NULL, 20, NULL, '0', NULL, 3, '2025-10-11 18:33:35', NULL, '2025-10-11 18:33:35'),
(11, 80, 55, '2025-09-12', NULL, 40, NULL, '0', NULL, 3, '2025-10-11 18:53:19', NULL, '2025-10-11 18:53:19'),
(12, 80, 58, '2025-09-12', NULL, 38, NULL, '0', NULL, 3, '2025-10-11 18:55:10', NULL, '2025-10-11 18:55:10'),
(13, 81, 55, '2025-09-12', NULL, 40, NULL, '0', NULL, 3, '2025-10-11 18:57:23', NULL, '2025-10-11 18:57:23'),
(14, 81, 58, '2025-09-12', NULL, 38, NULL, '0', NULL, 3, '2025-10-11 18:58:06', NULL, '2025-10-11 18:58:06'),
(15, 81, 59, '2025-09-12', NULL, 25, NULL, '0', NULL, 3, '2025-10-11 18:59:35', NULL, '2025-10-11 18:59:35'),
(16, 83, 55, '2025-09-07', NULL, 40, NULL, '0', NULL, 3, '2025-10-11 19:02:05', NULL, '2025-10-11 19:02:05'),
(17, 83, 60, '2025-09-07', NULL, 30, NULL, '0', NULL, 3, '2025-10-11 19:03:48', NULL, '2025-10-11 19:03:48'),
(18, 85, 61, '2025-10-06', NULL, 40, NULL, '0', NULL, 3, '2025-10-11 19:08:36', NULL, '2025-10-11 19:08:36'),
(19, 87, 61, '2025-10-10', 'Broncomax 1/4 pastilla', 88, NULL, '0', NULL, 3, '2025-10-14 16:46:05', NULL, '2025-10-14 16:46:05'),
(20, 89, 57, '2025-10-20', '0.2/04/2', 12, NULL, '0', NULL, 3, '2025-10-20 15:26:51', NULL, '2025-10-20 15:26:51'),
(21, 93, 62, '2025-10-09', NULL, 40, NULL, '0', NULL, 3, '2025-10-20 17:22:32', NULL, '2025-10-20 17:22:32'),
(22, 94, 61, '2025-10-09', NULL, 0, NULL, '0', NULL, 3, '2025-10-20 18:28:27', NULL, '2025-10-20 18:28:27'),
(23, 93, 61, '2025-10-10', NULL, 40, NULL, '0', NULL, 3, '2025-10-20 18:33:08', NULL, '2025-10-20 18:33:08'),
(24, 100, 61, '2025-10-13', 'atropina 0.4 dexa 0.2 histaprov 0.3', 50, NULL, '0', NULL, 3, '2025-10-22 16:17:15', NULL, '2025-10-22 16:19:56'),
(25, 104, 62, '2025-10-13', 'melox', 50, NULL, '0', NULL, 3, '2025-10-22 17:14:11', NULL, '2025-10-22 17:14:11'),
(26, 104, 62, '2025-10-15', 'melox', 50, NULL, '0', NULL, 3, '2025-10-22 17:25:20', NULL, '2025-10-22 17:25:20'),
(27, 100, 62, '2025-10-14', 'hepatin', 50, NULL, '0', NULL, 3, '2025-10-22 19:03:30', NULL, '2025-10-22 19:03:30'),
(28, 112, 61, '2025-09-13', 'enrofloxacina', 40, NULL, '0', NULL, 3, '2025-10-22 19:35:47', NULL, '2025-10-22 19:35:47'),
(29, 120, 55, '2025-10-21', 'tricortimax', 50, NULL, '0', NULL, 3, '2025-10-22 20:05:13', NULL, '2025-10-22 20:05:13'),
(30, 121, 57, '2025-10-22', 'telopar', 15, NULL, '0', NULL, 3, '2025-10-22 20:08:27', NULL, '2025-10-22 20:08:56'),
(31, 127, 62, '2025-10-25', 'Melox 0.1', 30, NULL, '0', NULL, 3, '2025-10-25 18:37:11', NULL, '2025-10-25 18:37:11'),
(32, 134, 62, '2025-10-19', 'Melox', 0, NULL, '0', NULL, 3, '2025-10-28 14:14:38', NULL, '2025-10-28 14:14:38'),
(35, 154, 55, '2025-11-03', '0.6', 50, NULL, '0', NULL, 3, '2025-11-07 18:27:58', NULL, '2025-11-07 18:27:58'),
(36, 155, 67, '2025-11-03', '0.4', 20, NULL, '0', NULL, 3, '2025-11-13 16:02:17', 3, '2025-11-13 16:12:48'),
(37, 155, 62, '2025-11-03', '0.3', 20, NULL, '0', NULL, 3, '2025-11-13 16:02:18', NULL, '2025-11-13 16:02:18'),
(38, 155, 69, '2025-11-03', '0.3', 10, NULL, '0', NULL, 3, '2025-11-13 16:03:52', NULL, '2025-11-13 16:03:52'),
(39, 155, 62, '2025-11-05', '0.3', 20, NULL, '0', NULL, 3, '2025-11-14 09:53:46', NULL, '2025-11-14 09:53:46'),
(40, 155, 67, '2025-11-05', '0.4', 20, NULL, '0', NULL, 3, '2025-11-14 09:54:30', NULL, '2025-11-14 09:54:30'),
(41, 155, 69, '2025-11-05', '0.3', 10, NULL, '0', NULL, 3, '2025-11-14 09:57:22', NULL, '2025-11-14 09:57:22'),
(42, 155, 83, '2025-11-10', '0.3', 40, NULL, '0', NULL, 3, '2025-11-14 10:42:56', NULL, '2025-11-14 10:42:56'),
(43, 155, 67, '2025-11-10', '0.3', 20, NULL, '0', NULL, 3, '2025-11-14 10:43:39', NULL, '2025-11-14 10:43:39'),
(44, 155, 69, '2025-11-10', '0.3', 10, NULL, '0', NULL, 3, '2025-11-14 10:47:42', NULL, '2025-11-14 10:47:42'),
(45, 163, 55, '2025-11-07', '0.8', 50, NULL, '0', NULL, 3, '2025-11-14 15:14:57', NULL, '2025-11-14 15:14:57'),
(46, 163, 56, '2025-11-08', 'power ultra', 50, NULL, '0', NULL, 3, '2025-11-14 15:16:31', NULL, '2025-11-14 15:16:31'),
(47, 83, 55, '2025-11-08', '0.3', 40, NULL, '0', NULL, 3, '2025-11-14 15:24:22', NULL, '2025-11-14 15:24:22'),
(48, 83, 69, '2025-11-08', '0.3', 30, NULL, '0', NULL, 3, '2025-11-14 15:25:05', NULL, '2025-11-14 15:25:05'),
(49, 164, 57, '2025-11-08', '3 ml', 10, NULL, '0', NULL, 3, '2025-11-14 15:29:11', NULL, '2025-11-14 15:29:11'),
(50, 165, 57, '2025-11-08', '2ml', 10, NULL, '0', NULL, 3, '2025-11-14 15:32:01', NULL, '2025-11-14 15:32:01'),
(51, 169, 83, '2025-11-09', '0.1', 0, NULL, '0', NULL, 3, '2025-11-14 15:53:27', NULL, '2025-11-14 15:53:27'),
(52, 169, 62, '2025-11-09', '0.1', 0, NULL, '0', NULL, 3, '2025-11-14 15:54:09', NULL, '2025-11-14 15:54:09'),
(53, 171, 57, '2025-11-09', 'antiparasitario interno', 20, NULL, '0', NULL, 3, '2025-11-14 16:00:57', NULL, '2025-11-14 16:00:57'),
(54, 172, 57, '2025-11-09', '2ml', 20, NULL, '0', NULL, 3, '2025-11-14 16:03:52', NULL, '2025-11-14 16:03:52'),
(55, 174, 79, '2025-11-11', '2  ml', 40, NULL, '0', NULL, 3, '2025-11-14 16:13:50', NULL, '2025-11-14 16:13:50'),
(56, 177, 56, '2025-11-13', 'power  ultra', 40, NULL, '0', NULL, 3, '2025-11-14 16:30:42', NULL, '2025-11-14 16:30:42'),
(57, 179, 74, '2025-11-14', '0.3', 20, NULL, '0', NULL, 3, '2025-11-14 16:49:06', NULL, '2025-11-14 16:49:06'),
(58, 179, 79, '2025-11-14', '0.2', 20, NULL, '0', NULL, 3, '2025-11-14 16:49:58', NULL, '2025-11-14 16:49:58'),
(59, 179, 74, '2025-11-15', '0.3', 20, NULL, '0', NULL, 3, '2025-11-15 13:48:48', NULL, '2025-11-15 13:48:48'),
(60, 179, 79, '2025-11-15', '0.2', 20, NULL, '0', NULL, 3, '2025-11-15 13:49:33', NULL, '2025-11-15 13:49:33'),
(61, 181, 83, '2025-11-15', '0.3', 15, NULL, '0', NULL, 3, '2025-11-26 09:26:19', NULL, '2025-11-26 09:26:19'),
(62, 181, 62, '2025-11-15', '0.2', 15, NULL, '0', NULL, 3, '2025-11-26 09:26:50', NULL, '2025-11-26 09:26:50'),
(63, 181, 81, '2025-11-15', '1', 15, NULL, '0', NULL, 3, '2025-11-26 09:27:14', NULL, '2025-11-26 09:27:14'),
(64, 181, 78, '2025-11-15', '0.2', 15, NULL, '0', NULL, 3, '2025-11-26 09:27:40', NULL, '2025-11-26 09:27:40'),
(65, 181, 68, '2025-11-15', '1', 10, NULL, '0', NULL, 3, '2025-11-26 09:28:01', NULL, '2025-11-26 09:28:01'),
(66, 191, 62, '2025-11-19', '0.3', 15, NULL, '0', NULL, 3, '2025-11-26 10:34:28', NULL, '2025-11-26 10:34:28'),
(67, 191, 67, '2025-11-19', '0.4', 15, NULL, '0', NULL, 3, '2025-11-26 10:34:56', NULL, '2025-11-26 10:34:56'),
(68, 191, 69, '2025-11-19', '0.3', 10, NULL, '0', NULL, 3, '2025-11-26 10:35:19', NULL, '2025-11-26 10:35:19'),
(69, 193, 83, '2025-11-19', '0.2', 20, NULL, '0', NULL, 3, '2025-11-26 10:52:54', NULL, '2025-11-26 10:52:54'),
(70, 193, 81, '2025-11-19', '0.2', 10, NULL, '0', NULL, 3, '2025-11-26 11:15:03', NULL, '2025-11-26 11:15:03'),
(71, 193, 67, '2025-11-19', '0.1', 10, NULL, '0', NULL, 3, '2025-11-26 11:16:04', NULL, '2025-11-26 11:16:04'),
(72, 193, 69, '2025-11-19', '0.2', 10, NULL, '0', NULL, 3, '2025-11-26 11:16:46', NULL, '2025-11-26 11:16:46'),
(73, 206, 76, '2025-11-23', '2  ml', 30, NULL, '0', NULL, 3, '2025-11-26 12:03:02', NULL, '2025-11-26 12:03:02'),
(74, 206, 83, '2025-11-23', '1.5', 30, NULL, '0', NULL, 3, '2025-11-26 12:03:27', NULL, '2025-11-26 12:03:27'),
(75, 206, 67, '2025-11-23', '0.5', 20, NULL, '0', NULL, 3, '2025-11-26 12:03:51', NULL, '2025-11-26 12:03:51'),
(76, 206, 83, '2025-11-24', '1.5', 30, NULL, '0', NULL, 3, '2025-11-26 12:04:37', NULL, '2025-11-26 12:04:37'),
(77, 206, 76, '2025-11-24', '0.2', 30, NULL, '0', NULL, 3, '2025-11-26 12:05:09', NULL, '2025-11-26 12:05:09'),
(78, 206, 67, '2025-11-24', '1.5', 20, NULL, '0', NULL, 3, '2025-11-26 12:05:34', NULL, '2025-11-26 12:05:34'),
(79, 206, 83, '2025-11-25', '1.5', 30, NULL, '0', NULL, 3, '2025-11-26 12:07:49', NULL, '2025-11-26 12:07:49'),
(80, 206, 76, '2025-11-25', '0.2', 30, NULL, '0', NULL, 3, '2025-11-26 12:08:14', NULL, '2025-11-26 12:08:14'),
(81, 206, 67, '2025-11-25', '0.5', 20, NULL, '0', NULL, 3, '2025-11-26 12:08:42', NULL, '2025-11-26 12:08:42'),
(82, 213, 83, '2025-11-27', '0.1', 30, NULL, '82.pdf', NULL, 3, '2025-11-27 14:05:43', 3, '2025-11-30 14:18:06'),
(83, 213, 62, '2025-11-27', '0.1', 20, NULL, '0', NULL, 3, '2025-11-27 14:06:26', NULL, '2025-11-27 14:06:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica_procedimiento`
--

CREATE TABLE `historia_clinica_procedimiento` (
  `id_historia_clinica_procedimiento` int(11) NOT NULL,
  `id_historia_clinica` int(11) NOT NULL,
  `id_procedimiento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `precio` float NOT NULL,
  `detalle` text DEFAULT NULL,
  `archivo` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica_procedimiento`
--

INSERT INTO `historia_clinica_procedimiento` (`id_historia_clinica_procedimiento`, `id_historia_clinica`, `id_procedimiento`, `fecha`, `precio`, `detalle`, `archivo`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(5, 14, 2, '2025-09-26', 40, NULL, NULL, 3, '2025-09-26 12:12:27', NULL, '2025-10-09 12:12:27'),
(6, 16, 2, '2025-09-25', 50, NULL, NULL, 3, '2025-09-25 12:17:44', NULL, '2025-10-09 12:17:44'),
(14, 15, 2, '2025-09-20', 45, NULL, NULL, 3, '2025-09-20 14:24:28', NULL, '2025-10-09 14:25:01'),
(15, 17, 2, '2025-09-27', 50, NULL, NULL, 3, '2025-09-27 14:26:55', NULL, '2025-10-09 14:26:55'),
(16, 18, 2, '2025-09-27', 40, NULL, NULL, 3, '2025-09-27 14:28:20', NULL, '2025-10-09 14:28:20'),
(17, 19, 2, '2025-09-26', 30, NULL, NULL, 3, '2025-09-26 14:29:48', NULL, '2025-10-09 14:29:48'),
(18, 20, 2, '2025-09-24', 65, NULL, NULL, 3, '2025-09-24 14:30:50', NULL, '2025-10-09 14:30:50'),
(19, 21, 2, '2025-09-22', 50, NULL, NULL, 3, '2025-09-22 14:31:47', NULL, '2025-10-09 14:31:47'),
(20, 22, 2, '2025-09-20', 45, NULL, NULL, 3, '2025-09-20 14:34:47', NULL, '2025-10-09 14:34:47'),
(21, 23, 2, '2025-09-20', 30, NULL, NULL, 3, '2025-09-20 14:35:59', NULL, '2025-10-09 14:35:59'),
(22, 24, 2, '2025-09-20', 35, NULL, NULL, 3, '2025-09-20 14:38:28', NULL, '2025-10-09 14:38:28'),
(23, 25, 2, '2025-09-20', 30, NULL, NULL, 3, '2025-09-20 14:40:13', NULL, '2025-10-09 14:40:13'),
(24, 26, 2, '2025-09-20', 40, NULL, NULL, 3, '2025-09-20 14:42:21', NULL, '2025-10-09 14:42:21'),
(25, 27, 2, '2025-09-20', 55, NULL, NULL, 3, '2025-09-20 14:44:25', NULL, '2025-10-09 14:44:25'),
(26, 28, 2, '2025-09-18', 40, NULL, NULL, 3, '2025-09-18 14:45:51', NULL, '2025-10-09 14:45:51'),
(27, 29, 2, '2025-09-18', 40, NULL, NULL, 3, '2025-09-18 14:46:55', NULL, '2025-10-09 14:46:55'),
(28, 30, 2, '2025-09-19', 50, NULL, NULL, 3, '2025-09-19 14:48:16', NULL, '2025-10-09 14:48:16'),
(29, 31, 2, '2025-09-19', 45, NULL, NULL, 3, '2025-09-19 14:49:59', NULL, '2025-10-09 14:49:59'),
(30, 32, 8, '2025-09-18', 250, NULL, NULL, 3, '2025-09-18 14:51:44', NULL, '2025-10-09 14:51:44'),
(31, 33, 2, '2025-09-18', 40, NULL, NULL, 3, '2025-09-18 14:52:27', NULL, '2025-10-09 14:52:27'),
(32, 34, 2, '2025-09-17', 40, NULL, NULL, 3, '2025-09-17 14:53:06', NULL, '2025-10-09 14:53:06'),
(33, 35, 2, '2025-09-17', 50, NULL, NULL, 3, '2025-09-17 14:53:39', NULL, '2025-10-09 14:53:39'),
(34, 36, 2, '2025-09-17', 30, NULL, NULL, 3, '2025-09-17 14:55:03', NULL, '2025-10-09 14:55:03'),
(35, 37, 2, '2025-09-16', 30, NULL, NULL, 3, '2025-09-16 14:56:25', NULL, '2025-10-09 14:56:25'),
(36, 38, 2, '2025-09-15', 60, NULL, NULL, 3, '2025-09-15 14:59:23', NULL, '2025-10-09 14:59:23'),
(37, 39, 2, '2025-09-16', 40, NULL, NULL, 3, '2025-09-16 15:00:40', NULL, '2025-10-09 15:00:40'),
(38, 40, 2, '2025-09-13', 30, NULL, NULL, 3, '2025-09-13 15:02:28', NULL, '2025-10-09 15:02:28'),
(39, 41, 2, '2025-09-13', 30, NULL, NULL, 3, '2025-09-13 15:03:23', NULL, '2025-10-09 15:03:23'),
(40, 42, 2, '2025-09-12', 50, NULL, NULL, 3, '2025-09-12 15:05:58', NULL, '2025-10-09 15:05:58'),
(41, 44, 2, '2025-09-10', 30, NULL, NULL, 3, '2025-09-10 15:12:53', NULL, '2025-10-09 15:12:53'),
(42, 45, 2, '2025-09-05', 35, NULL, NULL, 3, '2025-09-05 15:15:18', NULL, '2025-10-09 15:15:18'),
(43, 45, 5, '2025-10-04', 12.5, NULL, NULL, 3, '2025-10-04 15:15:32', NULL, '2025-10-09 15:15:32'),
(44, 46, 2, '2025-09-04', 30, NULL, NULL, 3, '2025-09-04 15:17:09', NULL, '2025-10-09 15:17:09'),
(45, 47, 2, '2025-09-04', 25, NULL, NULL, 3, '2025-09-04 15:18:14', NULL, '2025-10-09 15:18:14'),
(46, 48, 2, '2025-09-04', 30, NULL, NULL, 3, '2025-09-04 15:19:58', NULL, '2025-10-09 15:19:58'),
(47, 49, 2, '2025-09-03', 50, NULL, NULL, 3, '2025-09-03 15:21:25', NULL, '2025-10-09 15:21:25'),
(48, 50, 2, '2025-09-03', 60, NULL, NULL, 3, '2025-09-03 15:22:33', NULL, '2025-10-09 15:22:33'),
(49, 51, 2, '2025-09-28', 70, NULL, NULL, 3, '2025-09-28 15:23:20', NULL, '2025-10-09 15:23:20'),
(50, 52, 2, '2025-09-29', 40, NULL, NULL, 3, '2025-09-29 15:24:02', NULL, '2025-10-09 15:24:02'),
(51, 53, 2, '2025-09-28', 30, NULL, NULL, 3, '2025-09-28 15:25:05', NULL, '2025-10-09 15:25:05'),
(52, 54, 2, '2025-09-30', 40, NULL, NULL, 3, '2025-09-30 15:28:12', NULL, '2025-10-09 15:28:12'),
(53, 55, 2, '2025-09-29', 40, NULL, NULL, 3, '2025-09-29 15:30:05', NULL, '2025-10-09 15:30:05'),
(54, 56, 2, '2025-09-29', 40, NULL, NULL, 3, '2025-09-29 15:31:00', NULL, '2025-10-09 15:31:00'),
(55, 57, 2, '2025-09-29', 50, NULL, NULL, 3, '2025-09-29 15:33:10', NULL, '2025-10-09 15:33:17'),
(56, 58, 2, '2025-10-01', 40, NULL, NULL, 3, '2025-10-01 15:33:55', NULL, '2025-10-09 15:33:55'),
(57, 59, 2, '2025-10-02', 70, NULL, NULL, 3, '2025-10-02 15:34:39', NULL, '2025-10-09 15:34:39'),
(58, 60, 2, '2025-10-02', 50, NULL, NULL, 3, '2025-10-02 15:35:26', NULL, '2025-10-09 15:35:26'),
(59, 61, 2, '2025-10-03', 50, NULL, NULL, 3, '2025-10-03 15:36:43', NULL, '2025-10-09 15:36:43'),
(60, 62, 2, '2025-10-03', 50, NULL, NULL, 3, '2025-10-03 15:37:23', NULL, '2025-10-09 15:37:23'),
(61, 63, 2, '2025-10-03', 50, NULL, NULL, 3, '2025-10-03 15:38:18', NULL, '2025-10-09 15:38:18'),
(62, 64, 2, '2025-10-03', 50, NULL, NULL, 3, '2025-10-03 15:39:05', NULL, '2025-10-09 15:39:05'),
(63, 65, 2, '2025-10-04', 30, NULL, NULL, 3, '2025-10-04 15:39:58', NULL, '2025-10-09 15:39:58'),
(64, 66, 2, '2025-10-02', 50, NULL, NULL, 3, '2025-10-02 15:42:33', NULL, '2025-10-09 15:42:33'),
(65, 67, 2, '2025-10-04', 50, NULL, NULL, 3, '2025-10-04 15:46:08', NULL, '2025-10-09 15:46:08'),
(66, 68, 2, '2025-10-07', 60, NULL, NULL, 3, '2025-10-07 15:47:35', NULL, '2025-10-09 15:47:35'),
(67, 69, 2, '2025-10-07', 60, NULL, NULL, 3, '2025-10-07 15:48:36', NULL, '2025-10-09 15:48:36'),
(68, 70, 2, '2025-10-07', 40, NULL, NULL, 3, '2025-10-07 15:49:16', NULL, '2025-10-09 15:49:16'),
(69, 71, 5, '2025-10-08', 45, 'desparasitación interna y externa', NULL, 3, '2025-10-08 15:50:20', NULL, '2025-10-20 17:17:35'),
(70, 72, 2, '2025-10-08', 25, NULL, NULL, 3, '2025-10-08 16:10:19', NULL, '2025-10-09 16:10:19'),
(71, 72, 5, '2025-10-08', 10, NULL, NULL, 3, '2025-10-08 16:10:46', NULL, '2025-10-09 16:10:46'),
(72, 72, 4, '2025-10-08', 30, NULL, NULL, 3, '2025-10-08 16:11:02', NULL, '2025-10-09 16:11:02'),
(73, 73, 2, '2025-10-11', 0, 'detalle', NULL, 3, '2025-10-10 21:14:42', NULL, '2025-10-11 19:16:18'),
(74, 75, 8, '2025-09-25', 180, 'Sutura', NULL, 3, '2025-10-11 17:35:52', NULL, '2025-10-11 17:35:52'),
(75, 75, 18, '2025-09-25', 80, 'Internamiento', NULL, 3, '2025-10-11 17:36:21', NULL, '2025-10-11 17:36:21'),
(76, 80, 2, '2025-09-12', 10, NULL, NULL, 3, '2025-10-11 18:53:36', NULL, '2025-10-11 18:53:36'),
(77, 85, 18, '2025-10-04', 0, 'Se internó por 1 día', NULL, 3, '2025-10-11 19:07:30', NULL, '2025-10-11 19:07:42'),
(78, 73, 3, '2025-10-12', 0, '1', NULL, 3, '2025-10-11 20:15:30', NULL, '2025-10-11 20:15:30'),
(79, 91, 8, '2025-10-07', 160, 'ESTERILIZACION', NULL, 3, '2025-10-20 16:57:49', NULL, '2025-10-20 16:57:49'),
(80, 90, 19, '2025-10-10', 40, 'cuchilla nro 10, shampoo de limpieza', NULL, 3, '2025-10-20 17:11:40', NULL, '2025-10-20 17:11:40'),
(81, 92, 2, '2025-10-08', 120, 'se utiliza anestésico, para cortar uñas', NULL, 3, '2025-10-20 17:14:26', NULL, '2025-10-20 17:14:26'),
(82, 94, 17, '2025-10-09', 70, 'limpieza de herida,', NULL, 3, '2025-10-20 18:27:01', NULL, '2025-10-20 18:27:01'),
(83, 94, 17, '2025-10-10', 70, 'limpieza, tratamiento, aluspray', NULL, 3, '2025-10-20 18:29:51', NULL, '2025-10-20 18:29:51'),
(84, 94, 17, '2025-10-11', 70, 'limpieza, antibiotico, antiinflamatorio aluspray', NULL, 3, '2025-10-20 18:31:01', NULL, '2025-10-20 18:31:01'),
(85, 95, 19, '2025-10-11', 70, 'corte 3 1/4', NULL, 3, '2025-10-20 18:35:11', NULL, '2025-10-20 18:35:11'),
(86, 96, 19, '2025-10-09', 40, 'corte snauzer', NULL, 3, '2025-10-20 18:36:54', NULL, '2025-10-20 18:36:54'),
(87, 88, 1, '2025-10-09', 60, 'diarrefin, midapet', NULL, 3, '2025-10-20 18:40:55', NULL, '2025-10-20 18:40:55'),
(88, 97, 2, '2025-10-21', 70, 'Baño, antiparasitario, antipulgas 30+10+30', NULL, 3, '2025-10-21 10:51:43', NULL, '2025-10-21 10:51:43'),
(89, 98, 19, '2025-10-11', 85, 'baño y corte cuchilla 7f, antipulga: 50+35', NULL, 3, '2025-10-22 15:55:35', NULL, '2025-10-22 15:55:35'),
(90, 99, 2, '2025-10-11', 65, 'baño y antipulga 30+35', NULL, 3, '2025-10-22 15:57:11', NULL, '2025-10-22 15:57:11'),
(91, 101, 8, '2025-10-13', 180, 'otohematoma', NULL, 3, '2025-10-22 16:31:35', NULL, '2025-10-22 16:31:35'),
(92, 102, 6, '2025-10-13', 65, 'triple felina 50, desparasitación 15', NULL, 3, '2025-10-22 17:02:17', NULL, '2025-10-22 17:02:17'),
(93, 103, 6, '2025-10-13', 215, 'triple felina 50, antiparasitario 15, castración 150', NULL, 3, '2025-10-22 17:06:04', NULL, '2025-10-22 17:06:04'),
(94, 104, 17, '2025-10-13', 50, 'tiene heridas, no profundas, tratamiento manejo del dolor, se recomienda 3 días', NULL, 3, '2025-10-22 17:11:29', NULL, '2025-10-22 17:11:29'),
(95, 104, 17, '2025-10-16', 130, 'anestesia y limpieza, herida no profunda cicatriza por segunda intención, tiene raspones no profundos y partes enrojecidas producto del golpe, anestesia 80, cicatrex spray tópico 40, pasilla hepatiopet 10', NULL, 3, '2025-10-22 17:28:22', NULL, '2025-10-22 17:30:25'),
(96, 105, 2, '2025-10-14', 40, 'baño shampoo glicerina', NULL, 3, '2025-10-22 18:25:16', NULL, '2025-10-22 18:25:16'),
(97, 106, 2, '2025-10-17', 25, NULL, NULL, 3, '2025-10-22 19:04:48', NULL, '2025-10-22 19:04:48'),
(98, 107, 2, '2025-10-17', 30, 'baño', NULL, 3, '2025-10-22 19:05:59', NULL, '2025-10-22 19:05:59'),
(99, 108, 2, '2025-10-18', 45, 'baño medicado, shampoo avena', NULL, 3, '2025-10-22 19:11:02', NULL, '2025-10-22 19:11:02'),
(100, 109, 2, '2025-10-18', 30, 'baño', NULL, 3, '2025-10-22 19:12:05', NULL, '2025-10-22 19:12:05'),
(101, 110, 2, '2025-10-18', 60, 'baño', NULL, 3, '2025-10-22 19:13:18', NULL, '2025-10-22 19:13:18'),
(102, 111, 19, '2025-10-18', 50, 'corte nro 10 todo el cuerpo, cara mascara, no pompon en cola', NULL, 3, '2025-10-22 19:19:55', NULL, '2025-10-22 19:19:55'),
(103, 112, 19, '2025-09-13', 50, 'corte a tijera', NULL, 3, '2025-10-22 19:35:15', NULL, '2025-10-22 19:35:15'),
(104, 113, 19, '2025-10-18', 50, 'corte a tijera', NULL, 3, '2025-10-22 19:39:26', NULL, '2025-10-22 19:39:26'),
(105, 114, 2, '2025-10-18', 30, 'corte parte trasera', NULL, 3, '2025-10-22 19:43:39', NULL, '2025-10-22 19:43:39'),
(106, 115, 2, '2025-10-18', 45, 'baño', NULL, 3, '2025-10-22 19:45:49', NULL, '2025-10-22 19:45:49'),
(107, 116, 2, '2025-10-19', 40, 'baño', NULL, 3, '2025-10-22 19:52:21', NULL, '2025-10-22 19:52:21'),
(108, 117, 19, '2025-10-19', 50, 'corte 5f todo el cuerpo', NULL, 3, '2025-10-22 19:53:40', NULL, '2025-10-22 19:53:40'),
(109, 118, 2, '2025-10-19', 30, 'baño', NULL, 3, '2025-10-22 19:54:56', NULL, '2025-10-22 19:54:56'),
(110, 119, 7, '2025-10-19', 220, 'esterilización 180, baño y corte 40', NULL, 3, '2025-10-22 20:01:49', NULL, '2025-10-22 20:01:49'),
(111, 122, 19, '2025-10-23', 50, 'Corte nro 7f, cabeza redonda', NULL, 3, '2025-10-23 18:53:38', NULL, '2025-10-23 18:53:38'),
(112, 123, 2, '2025-10-25', 50, 'Baño y antipulgas', NULL, 3, '2025-10-25 18:08:09', NULL, '2025-10-25 18:08:09'),
(113, 124, 8, '2025-10-25', 180, 'Esterilización', NULL, 3, '2025-10-25 18:25:18', NULL, '2025-10-25 18:25:18'),
(114, 125, 2, '2025-10-25', 40, 'Baño y desparasitante 30+10', NULL, 3, '2025-10-25 18:32:45', NULL, '2025-10-25 18:32:45'),
(115, 126, 19, '2025-10-25', 90, 'NRO 7f, antipulgas 50+40', NULL, 3, '2025-10-25 18:34:21', NULL, '2025-10-25 18:34:21'),
(116, 128, 2, '2025-10-25', 70, 'Baño y antipulga 30+40', NULL, 3, '2025-10-25 18:39:21', NULL, '2025-10-25 18:39:21'),
(117, 129, 2, '2025-10-26', 105, 'Baño medicado, antipulgas antiparasitario (cortesía): 65+40', NULL, 3, '2025-10-28 10:52:05', NULL, '2025-10-28 10:52:05'),
(118, 130, 1, '2025-10-27', 90, 'Corticoides vitamina 50+40', NULL, 3, '2025-10-28 12:30:37', NULL, '2025-10-28 12:30:37'),
(119, 131, 2, '2025-10-27', 70, 'Baño, antipulgas 40+30', NULL, 3, '2025-10-28 12:32:21', NULL, '2025-10-28 12:32:21'),
(120, 132, 2, '2025-10-27', 60, 'Baño antipulgas 30+30', NULL, 3, '2025-10-28 12:33:59', NULL, '2025-10-28 12:33:59'),
(121, 133, 19, '2025-10-27', 50, 'Corte NRO 10… porq tiene muchas motas', NULL, 3, '2025-10-28 12:39:29', NULL, '2025-10-28 12:39:29'),
(122, 134, 1, '2025-10-19', 40, 'Dolor muscular para delantera derecha', NULL, 3, '2025-10-28 14:14:04', NULL, '2025-10-28 14:14:04'),
(123, 134, 1, '2025-10-28', 34, 'Lleva 3 meloxivet pastilla para tratamiento de 6 días/ 10 artrin pastillas tto por 10 dias', NULL, 3, '2025-10-28 14:17:56', NULL, '2025-10-28 14:17:56'),
(124, 135, 1, '2025-10-28', 55, 'Desparasitante, vitaminas inyectable 15+30', NULL, 3, '2025-10-28 19:25:55', NULL, '2025-10-28 19:25:55'),
(125, 136, 19, '2025-10-28', 50, 'Corte NRO 5f', NULL, 3, '2025-10-28 19:28:27', 3, '2025-11-07 09:27:48'),
(126, 137, 19, '2025-10-30', 50, 'NRO 5F', NULL, 3, '2025-11-07 14:58:38', NULL, '2025-11-07 14:58:38'),
(127, 138, 19, '2025-10-30', 50, 'Cuchilla NRO 7f', NULL, 3, '2025-11-07 15:00:10', NULL, '2025-11-07 15:00:10'),
(128, 139, 3, '2025-10-30', 30, 'Cuchilla NRO 7f', NULL, 3, '2025-11-07 15:03:52', NULL, '2025-11-07 15:03:52'),
(129, 140, 3, '2025-10-30', 30, 'Cuchilla 7F', NULL, 3, '2025-11-07 15:04:48', NULL, '2025-11-07 15:04:48'),
(130, 141, 19, '2025-10-30', 50, 'Corte cuchilla 5F', NULL, 3, '2025-11-07 15:06:10', NULL, '2025-11-07 15:06:10'),
(131, 142, 2, '2025-10-30', 40, 'Baño de limpieza', NULL, 3, '2025-11-07 15:07:31', NULL, '2025-11-07 15:07:31'),
(132, 143, 19, '2025-10-30', 50, 'Corte cuchilla NRO 10', NULL, 3, '2025-11-07 15:08:59', NULL, '2025-11-07 15:08:59'),
(133, 144, 19, '2025-10-31', 40, 'Baño de limpieza, corte NRO 5F', NULL, 3, '2025-11-07 15:10:30', 3, '2025-11-10 17:03:44'),
(134, 145, 2, '2025-10-31', 30, 'Baño de limpieza', NULL, 3, '2025-11-07 15:11:42', NULL, '2025-11-07 15:11:42'),
(135, 146, 2, '2025-10-31', 30, 'Baño de limpieza', NULL, 3, '2025-11-07 15:14:17', NULL, '2025-11-07 15:14:17'),
(136, 147, 19, '2025-10-31', 50, 'Baño de limpieza corte cuerpo 5f patas  y hocico de poodles, cabeza pompón', NULL, 3, '2025-11-07 16:41:45', NULL, '2025-11-07 16:41:45'),
(137, 148, 19, '2025-10-31', 50, 'Baño de limpieza, corte cuerpo 5f', NULL, 3, '2025-11-07 16:47:04', NULL, '2025-11-07 16:47:04'),
(138, 149, 2, '2025-11-03', 30, 'Baño de limpieza', NULL, 3, '2025-11-07 16:49:02', NULL, '2025-11-07 16:49:02'),
(139, 150, 19, '2025-11-03', 50, 'Baño de limpieza,corte NRO 10', NULL, 3, '2025-11-07 16:52:15', NULL, '2025-11-07 16:52:15'),
(140, 150, 4, '2025-11-03', 15, 'Spray antipulgas', NULL, 3, '2025-11-07 16:52:56', NULL, '2025-11-07 16:52:56'),
(141, 151, 3, '2025-11-03', 30, 'Corte NRO 10, cara tipo snauzer', NULL, 3, '2025-11-07 17:01:30', NULL, '2025-11-07 17:01:30'),
(142, 151, 1, '2025-11-03', 50, 'Sedación', NULL, 3, '2025-11-07 17:28:49', NULL, '2025-11-07 17:28:49'),
(143, 151, 1, '2025-11-03', 80, 'Vacuna sextuple con rabia', NULL, 3, '2025-11-07 17:29:26', NULL, '2025-11-07 17:29:26'),
(144, 152, 3, '2025-11-03', 30, 'Cuchilla NRO 7f', NULL, 3, '2025-11-07 17:30:44', NULL, '2025-11-07 17:30:44'),
(145, 153, 5, '2025-11-03', 20, NULL, NULL, 3, '2025-11-07 18:25:02', NULL, '2025-11-07 18:25:02'),
(146, 155, 1, '2025-11-03', 0, 'Peso 6.6 kg., viene por atropello, no hay trauma presente, se le recomienda llevar TTO para el manejo del dolor y posteriormente ecografía para ver si hay daño interno,', NULL, 3, '2025-11-13 16:07:48', NULL, '2025-11-13 16:07:48'),
(147, 155, 1, '2025-11-05', 0, 'se le procede a aplicar medicamento para el manejo del dolor, no come muy bien, se le recomienda pasarle suero', NULL, 3, '2025-11-14 09:59:12', NULL, '2025-11-14 09:59:12'),
(148, 155, 20, '2025-11-06', 80, 'se le coloca tambien vitaminas (aminoplex)', NULL, 3, '2025-11-14 10:31:18', NULL, '2025-11-14 10:31:18'),
(149, 155, 21, '2025-11-06', 60, 'potenza, es complemento alimenticio', NULL, 3, '2025-11-14 10:32:51', NULL, '2025-11-14 10:32:51'),
(150, 155, 22, '2025-11-10', 220, 'esplenomegalia (bazo agrandado), riñones se encuentran en la zona caudal, coágulos de sangre en la vejiga. Se le recomienda medicación por tres días', NULL, 3, '2025-11-14 10:40:05', 3, '2025-11-14 10:48:44'),
(151, 155, 1, '2025-11-11', 70, 'continua medicación, enropro, dexalan, histaprov', NULL, 3, '2025-11-14 10:50:09', NULL, '2025-11-14 10:50:09'),
(152, 155, 1, '2025-11-12', 70, 'último tratamiento en inyectable, enropro, dexalan, histaprov. continua tratamiento en pastillas', NULL, 3, '2025-11-14 10:51:33', NULL, '2025-11-14 10:51:33'),
(153, 155, 21, '2025-11-12', 24, 'lleva pastillas tratamiento para 7 dias, para continuar tratamiento, amoxitab 5 pastillas, hepatiobet 7 pastillas', NULL, 3, '2025-11-14 10:53:31', NULL, '2025-11-14 10:53:31'),
(154, 156, 2, '2025-11-04', 30, 'baño de limpieza', NULL, 3, '2025-11-14 11:01:10', NULL, '2025-11-14 11:01:10'),
(155, 157, 19, '2025-11-04', 40, 'baño de limpieza y corte nro 7f', NULL, 3, '2025-11-14 11:03:56', NULL, '2025-11-14 11:03:56'),
(156, 158, 19, '2025-11-05', 40, 'baño de limpieza corte nro 7f por verano, tiene muchas pulgas', NULL, 3, '2025-11-14 11:07:44', NULL, '2025-11-14 11:07:44'),
(157, 158, 21, '2025-11-05', 120, 'proteggo, antipulgas en pastilla protección ´por 3 meses', NULL, 3, '2025-11-14 11:08:45', NULL, '2025-11-14 11:08:45'),
(158, 159, 19, '2025-11-05', 50, 'baño de limpieza, corte nro 10', NULL, 3, '2025-11-14 11:11:07', NULL, '2025-11-14 11:11:07'),
(159, 160, 2, '2025-11-05', 30, 'baño de limpieza', NULL, 3, '2025-11-14 11:13:09', NULL, '2025-11-14 11:13:09'),
(160, 160, 5, '2025-11-05', 35, 'antipulga power ultra', NULL, 3, '2025-11-14 11:13:50', NULL, '2025-11-14 11:13:50'),
(161, 161, 19, '2025-11-05', 40, 'baño de limpieza, corte nro 5f', NULL, 3, '2025-11-14 11:16:17', NULL, '2025-11-14 11:16:17'),
(162, 162, 19, '2025-11-05', 50, 'baño de limpieza, corte de raza', NULL, 3, '2025-11-14 11:20:42', NULL, '2025-11-14 11:20:42'),
(163, 163, 1, '2025-11-07', 0, 'tiene escozor y calvicie en el lomo, se le recomienda aplicarle corticoide, antipulgas y baño medicado', NULL, 3, '2025-11-14 15:14:07', NULL, '2025-11-14 15:14:07'),
(164, 163, 2, '2025-11-08', 50, 'baño medicado', NULL, 3, '2025-11-14 15:15:38', NULL, '2025-11-14 15:15:38'),
(165, 164, 2, '2025-11-08', 35, 'baño medicado', NULL, 3, '2025-11-14 15:28:20', NULL, '2025-11-14 15:28:20'),
(166, 165, 2, '2025-11-08', 30, 'baño de limpieza', NULL, 3, '2025-11-14 15:31:15', NULL, '2025-11-14 15:31:15'),
(167, 166, 2, '2025-11-08', 40, 'baño de limpieza', NULL, 3, '2025-11-14 15:34:06', NULL, '2025-11-14 15:34:06'),
(168, 167, 3, '2025-11-08', 30, 'corte de pelo 5f', NULL, 3, '2025-11-14 15:38:19', NULL, '2025-11-14 15:38:19'),
(169, 168, 6, '2025-11-08', 50, 'cuádruple', NULL, 3, '2025-11-14 15:45:17', NULL, '2025-11-14 15:45:17'),
(170, 169, 8, '2025-11-09', 180, 'castración', NULL, 3, '2025-11-14 15:52:34', NULL, '2025-11-14 15:52:34'),
(171, 170, 19, '2025-11-09', 40, 'corte snauzer', NULL, 3, '2025-11-14 15:58:06', NULL, '2025-11-14 15:58:06'),
(172, 171, 2, '2025-11-09', 40, 'baño medicado', NULL, 3, '2025-11-14 16:00:02', NULL, '2025-11-14 16:00:02'),
(173, 172, 2, '2025-11-09', 40, 'baño  medicado', NULL, 3, '2025-11-14 16:03:01', NULL, '2025-11-14 16:03:01'),
(174, 173, 19, '2025-11-10', 50, 'baño de limpieza corte nro 5f', NULL, 3, '2025-11-14 16:07:33', NULL, '2025-11-14 16:07:33'),
(175, 174, 2, '2025-11-11', 35, 'baño de limpieza', NULL, 3, '2025-11-14 16:12:56', NULL, '2025-11-14 16:12:56'),
(176, 174, 21, '2025-11-11', 5, '2 pastillas artrim por la composición de glucosamina', NULL, 3, '2025-11-14 16:14:54', NULL, '2025-11-14 16:14:54'),
(177, 175, 19, '2025-11-11', 50, 'baño de limpieza, corte 5f', NULL, 3, '2025-11-14 16:16:51', NULL, '2025-11-14 16:16:51'),
(178, 176, 19, '2025-11-11', 50, 'baño de limpieza, corte nro 10', NULL, 3, '2025-11-14 16:27:16', NULL, '2025-11-14 16:27:16'),
(179, 177, 19, '2025-11-13', 50, 'Baño de limpieza y corte nro 5 f', NULL, 3, '2025-11-14 16:29:58', NULL, '2025-11-14 16:29:58'),
(180, 178, 19, '2025-11-14', 50, 'baño de limpieza, corte nro 10 todo el cuerpo , tiene herida y problema de piel,', NULL, 3, '2025-11-14 16:41:16', NULL, '2025-11-14 16:41:16'),
(181, 178, 21, '2025-11-14', 6, '3 pastillas alerdog', NULL, 3, '2025-11-14 16:42:27', NULL, '2025-11-14 16:42:27'),
(182, 179, 21, '2025-11-14', 60, 'POTENZA CATS- suplemento vitamínico vía oral', NULL, 3, '2025-11-14 16:51:16', NULL, '2025-11-14 16:51:16'),
(183, 180, 2, '2025-11-15', 35, 'Baño de limpieza y retoque carita', NULL, 3, '2025-11-15 13:32:12', NULL, '2025-11-15 13:32:12'),
(184, 179, 21, '2025-11-15', 6, 'Paté para gatos', NULL, 3, '2025-11-15 13:50:19', NULL, '2025-11-15 13:50:19'),
(185, 124, 21, '2025-11-15', 45, 'lleva 15 pastillas DERMATAB, precio unidad 3 soles, tratamiento por 15 dias', NULL, 3, '2025-11-26 09:35:43', NULL, '2025-11-26 09:35:43'),
(186, 184, 6, '2025-11-15', 50, 'primera cuádruple', NULL, 3, '2025-11-26 09:44:49', NULL, '2025-11-26 09:44:49'),
(187, 185, 19, '2025-11-15', 50, 'cuchilla 5f, baño de aseo', NULL, 3, '2025-11-26 09:57:02', NULL, '2025-11-26 09:57:02'),
(188, 186, 19, '2025-11-16', 50, 'corte 5f, baño de limpieza', NULL, 3, '2025-11-26 09:58:14', NULL, '2025-11-26 09:58:14'),
(189, 187, 19, '2025-11-16', 50, 'corte 5f, baño de limpieza', NULL, 3, '2025-11-26 10:02:25', NULL, '2025-11-26 10:02:25'),
(190, 188, 19, '2025-11-16', 50, 'corte 5f, baño de limpieza', NULL, 3, '2025-11-26 10:04:11', NULL, '2025-11-26 10:04:11'),
(191, 189, 5, '2025-11-17', 10, 'telopar', NULL, 3, '2025-11-26 10:14:16', NULL, '2025-11-26 10:14:16'),
(192, 189, 4, '2025-11-18', 65, 'proteggo 3 meses', NULL, 3, '2025-11-26 10:15:08', NULL, '2025-11-26 10:15:08'),
(193, 190, 5, '2025-11-17', 10, 'telopar', NULL, 3, '2025-11-26 10:16:19', NULL, '2025-11-26 10:16:19'),
(194, 190, 4, '2025-11-18', 65, 'proteggo 3 meses', NULL, 3, '2025-11-26 10:16:44', NULL, '2025-11-26 10:16:44'),
(195, 192, 2, '2025-11-19', 40, 'baño de  limpieza', NULL, 3, '2025-11-26 10:37:31', NULL, '2025-11-26 10:37:31'),
(196, 194, 2, '2025-11-20', 35, 'baño medicado', NULL, 3, '2025-11-26 11:20:12', NULL, '2025-11-26 11:20:12'),
(197, 194, 4, '2025-11-20', 20, 'peluchin', NULL, 3, '2025-11-26 11:20:35', NULL, '2025-11-26 11:20:35'),
(198, 195, 2, '2025-11-20', 35, 'baño medicado', NULL, 3, '2025-11-26 11:21:45', NULL, '2025-11-26 11:21:45'),
(199, 195, 4, '2025-11-20', 20, 'peluchin', NULL, 3, '2025-11-26 11:22:05', NULL, '2025-11-26 11:22:05'),
(200, 195, 21, '2025-11-20', 40, 'gingivet', NULL, 3, '2025-11-26 11:22:30', NULL, '2025-11-26 11:22:30'),
(201, 196, 2, '2025-11-20', 30, 'baño limpieza, despejar un poco los ojos', NULL, 3, '2025-11-26 11:23:31', NULL, '2025-11-26 11:23:31'),
(202, 197, 2, '2025-11-20', 30, 'baño de limpieza', NULL, 3, '2025-11-26 11:24:22', NULL, '2025-11-26 11:24:22'),
(203, 197, 5, '2025-11-20', 10, 'telopar', NULL, 3, '2025-11-26 11:24:43', NULL, '2025-11-26 11:24:43'),
(204, 198, 2, '2025-11-20', 30, 'baño de limpieza', NULL, 3, '2025-11-26 11:25:31', NULL, '2025-11-26 11:25:31'),
(205, 198, 5, '2025-11-20', 10, 'telopar', NULL, 3, '2025-11-26 11:25:50', NULL, '2025-11-26 11:25:50'),
(206, 199, 19, '2025-11-22', 50, 'corte 5f, baño de limpieza', NULL, 3, '2025-11-26 11:31:30', NULL, '2025-11-26 11:31:30'),
(207, 200, 19, '2025-11-22', 40, 'corte 5f, baño de limpieza', NULL, 3, '2025-11-26 11:32:37', NULL, '2025-11-26 11:32:37'),
(208, 200, 4, '2025-11-22', 40, 'power ultra', NULL, 3, '2025-11-26 11:33:14', NULL, '2025-11-26 11:33:14'),
(209, 201, 2, '2025-11-22', 30, 'baño de limpieza', NULL, 3, '2025-11-26 11:34:00', NULL, '2025-11-26 11:34:00'),
(210, 201, 4, '2025-11-22', 40, 'power ultra', NULL, 3, '2025-11-26 11:34:25', NULL, '2025-11-26 11:34:25'),
(211, 202, 19, '2025-11-22', 50, 'baño de limpieza, corte 4f', NULL, 3, '2025-11-26 11:36:27', NULL, '2025-11-26 11:36:27'),
(212, 202, 21, '2025-11-22', 120, 'proteggo por 3 meses', NULL, 3, '2025-11-26 11:36:52', NULL, '2025-11-26 11:36:52'),
(213, 203, 2, '2025-11-22', 30, 'baño de limpieza', NULL, 3, '2025-11-26 11:37:50', NULL, '2025-11-26 11:37:50'),
(214, 203, 21, '2025-11-22', 80, 'vitalderm pote', NULL, 3, '2025-11-26 11:38:45', NULL, '2025-11-26 11:38:45'),
(215, 204, 4, '2025-11-22', 40, 'power ultra', NULL, 3, '2025-11-26 11:55:40', NULL, '2025-11-26 11:55:40'),
(216, 204, 5, '2025-11-22', 20, 'telopar', NULL, 3, '2025-11-26 11:55:59', NULL, '2025-11-26 11:55:59'),
(217, 205, 2, '2025-11-23', 30, 'baño de limpieza', NULL, 3, '2025-11-26 11:56:53', NULL, '2025-11-26 11:56:53'),
(218, 205, 21, '2025-11-25', 260, 'seresto, antipulga por 7 meses', NULL, 3, '2025-11-26 11:57:35', NULL, '2025-11-26 11:57:35'),
(219, 207, 19, '2025-11-24', 50, 'corte 5f, baño de limpíeza', NULL, 3, '2025-11-26 12:14:00', NULL, '2025-11-26 12:14:00'),
(220, 208, 2, '2025-11-24', 65, 'baño de limpieza', NULL, 3, '2025-11-26 12:15:11', NULL, '2025-11-26 12:15:11'),
(221, 208, 4, '2025-11-24', 40, NULL, NULL, 3, '2025-11-26 12:15:30', NULL, '2025-11-26 12:15:30'),
(222, 209, 2, '2025-11-25', 35, 'baño medicado', NULL, 3, '2025-11-26 12:18:35', NULL, '2025-11-26 12:18:35'),
(223, 209, 5, '2025-11-25', 10, 'telopar', NULL, 3, '2025-11-26 12:18:54', NULL, '2025-11-26 12:18:54'),
(224, 210, 2, '2025-11-25', 30, 'baño de limpieza', NULL, 3, '2025-11-26 12:19:51', NULL, '2025-11-26 12:19:51'),
(225, 210, 5, '2025-11-25', 10, 'telopar', NULL, 3, '2025-11-26 12:20:11', NULL, '2025-11-26 12:20:11'),
(226, 211, 19, '2025-11-26', 50, 'corte nro 10, baño de limpieza', NULL, 3, '2025-11-27 14:00:05', NULL, '2025-11-27 14:00:05'),
(227, 212, 19, '2025-11-26', 50, 'corte nro 10, baño de limpieza', NULL, 3, '2025-11-27 14:01:22', NULL, '2025-11-27 14:01:22'),
(228, 213, 2, '2025-11-30', 555, 'asd', '228.jpg', 3, '2025-11-30 13:34:37', 3, '2025-12-07 18:59:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historia_clinica_seguimiento`
--

CREATE TABLE `historia_clinica_seguimiento` (
  `id_historia_clinica_seguimiento` int(11) NOT NULL,
  `id_historia_clinica` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `detalle` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `archivo` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historia_clinica_seguimiento`
--

INSERT INTO `historia_clinica_seguimiento` (`id_historia_clinica_seguimiento`, `id_historia_clinica`, `fecha`, `detalle`, `observaciones`, `archivo`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(27, 16, '2025-09-28', 'no trajo a mascota para continuar con su medicación', NULL, NULL, 3, '2025-10-09 12:17:18', NULL, '2025-10-09 12:17:18'),
(33, 15, '2025-09-27', 'No regresa para continuar con el tratamiento de antiiflamatorio y antibiótico', NULL, NULL, 3, '2025-10-09 14:25:14', NULL, '2025-10-09 14:25:14'),
(34, 73, '2025-10-12', 'detalle', 'observaciones', NULL, 3, '2025-10-10 21:16:57', NULL, '2025-10-10 21:16:57'),
(35, 74, '2025-09-20', 'Dia de alta', 'Lleva pastilla para continuar tratamiento en casa', NULL, 3, '2025-10-11 16:48:39', NULL, '2025-10-11 16:48:39'),
(36, 74, '2025-09-28', 'Mediante llamada y mensaje muestra herida al parecer abierta, se le sugiere que la traiga para examinar y determinar si necesita puntos o podrá cicatrizar por segunda intención, mediante llamada se le recomienda que tome pastillas para posible infección', 'No confirma traer a la mascota', NULL, 3, '2025-10-11 16:51:33', NULL, '2025-10-11 16:51:33'),
(38, 75, '2025-09-27', 'No regresa para continuar con el tratamiento de antiiflamatorio y antibiótico', NULL, NULL, 3, '2025-10-11 17:38:44', NULL, '2025-10-11 17:38:44'),
(39, 76, '2025-09-28', 'No trajo a mascota para continuar con su medicación', NULL, NULL, 3, '2025-10-11 17:42:00', NULL, '2025-10-11 17:42:00'),
(40, 79, '2025-09-20', 'Mediante llamada telefónica dice que hace tres días la herida esta como inflamada, se le recomienda que la traiga para revisarla, no pueden traerla, los puntos están completos, se le recomienda darle por tres días pastilla meloxisan 1, que es antiinflamatorio', NULL, NULL, 3, '2025-10-11 18:50:26', NULL, '2025-10-11 18:50:32'),
(41, 79, '2025-09-14', 'Sale de alta, herida y puntos correctos', NULL, NULL, 3, '2025-10-11 18:50:55', NULL, '2025-10-11 18:50:55'),
(42, 84, '2025-09-30', 'No darle comida en el día, que tenga agua limpia, el tratamiento continúa dependiendo estado de salud', NULL, NULL, 3, '2025-10-11 19:05:22', NULL, '2025-10-11 19:05:56'),
(43, 85, '2025-10-06', 'Dia de alta', 'Herida seca', NULL, 3, '2025-10-11 19:08:49', NULL, '2025-10-11 19:08:49'),
(44, 88, '2025-10-11', 'dejo tratamiento por un día, continua con tratamiento , sigue con diarrea y vomito, esta inapetente', 'colocar suero y medicamento', NULL, 3, '2025-10-20 18:44:25', NULL, '2025-10-20 18:44:25'),
(45, 88, '2025-10-12', 'en la madrugada hace diarrea con sangre, sigue con vómitos, se le coloca antibiótico, suero', 'mascota fallece al medio día por un paro cardiaco', NULL, 3, '2025-10-22 15:44:20', NULL, '2025-10-22 15:44:20'),
(46, 100, '2025-10-13', 'atropina 0.4/ dexa 0.2/ histaprov 0.3/hepatin0.3/ hepatone0.4', 'queda en observación hasta las 5pm en la veterinaria', NULL, 3, '2025-10-22 16:22:01', NULL, '2025-10-22 16:22:01'),
(47, 100, '2025-10-13', 'sale de alta a las 5:30 pm', NULL, NULL, 3, '2025-10-22 16:22:30', NULL, '2025-10-22 16:22:30'),
(50, 104, '2025-10-15', 'sigue con dolor, come poco', 'se le aplica antiinflamatorio', NULL, 3, '2025-10-22 17:24:57', NULL, '2025-10-22 17:24:57'),
(51, 104, '2025-10-16', 'dueño dice que se mueve ´poco y que le vio otras heridas, se le recomida colocarle anestésico para poder revisarla mejor', NULL, NULL, 3, '2025-10-22 17:26:32', NULL, '2025-10-22 17:26:32'),
(52, 100, '2025-10-14', 'perrita ya está mas estable', 'va a llevar segundo tratamiento', NULL, 3, '2025-10-22 19:02:45', NULL, '2025-10-22 19:02:45'),
(53, 119, '2025-10-20', 'herida de cirugía seca y limpia', 'sale de alta', NULL, 3, '2025-10-22 20:02:49', NULL, '2025-10-22 20:02:49'),
(54, 134, '2025-10-28', 'Sigue con dolor y cojeo de la pata delantera derecha', 'Se le recomienda no hacer juegos bruscos, pastilla y vitamina', NULL, 3, '2025-10-28 14:16:14', NULL, '2025-10-28 14:16:14'),
(55, 155, '2025-11-05', 'No ha habido sangrado , toma poca agua y comida', 'Le han sacado placa radiográfica, aparentemente no hay fractura. Se le sigue recomendando sacarle una ecografía. Lleva tto para el dolor', NULL, 3, '2025-11-13 16:11:59', 3, '2025-11-13 17:13:12'),
(56, 155, '2025-11-06', 'choca sigue decaido, ha orinado, no hay sangrado, se va a proceder a pasarle suero y venta de potenza , vitamina en gel para q tome todos los dias', NULL, NULL, 3, '2025-11-14 10:01:10', NULL, '2025-11-14 10:01:10'),
(57, 83, '2025-11-08', 'regresa por su problema de piel, alergia y escozor', 'piel grasosa, se le recomienda medicación, baño medicado y antipulga', NULL, 3, '2025-11-14 15:23:19', NULL, '2025-11-14 15:23:19'),
(58, 169, '2025-11-10', 'cirugía correcta, herida seca, sale de alta', 'debe regresar dentro de 15 días para retiro de puntos', NULL, 3, '2025-11-14 15:55:56', NULL, '2025-11-14 15:55:56'),
(59, 179, '2025-11-15', 'Sigue en recuperación,  tiene todavía sus calambres', 'Continúa tratamiento', NULL, 3, '2025-11-15 13:47:42', NULL, '2025-11-15 13:47:42'),
(61, 181, '2025-11-16', 'La perrita ya no tiene diarrea ni vomito, se procede a darle de alta', 'se le recomienda seguir observándola y con dieta blanda', NULL, 3, '2025-11-26 09:29:15', NULL, '2025-11-26 09:29:15'),
(62, 124, '2025-11-15', 'retiro de puntos, herida y puntos totalmente seco y cerrado se procede a retirar puntos.', 'corregir el problema de piel que tiene', NULL, 3, '2025-11-26 09:34:27', NULL, '2025-11-26 09:34:27'),
(63, 179, '2025-11-18', 'gatita ya esta mas recuperada en el sentido de la eclampsia, ahora como no da de lactar a sus cachorros, sus pezones se están llenando de leche, posible mastitis, se le recomienda hacerle masajes con crema.', NULL, NULL, 3, '2025-11-26 09:41:05', NULL, '2025-11-26 09:41:05'),
(64, 206, '2025-11-24', 'perro esta mejor, sigue con diarrea pero ya sin sangre, come y bebe agua normal', NULL, NULL, 3, '2025-11-26 12:06:21', NULL, '2025-11-26 12:06:21'),
(65, 206, '2025-11-25', 'perro se encuentra mejor, ya no tiene diarrea, continua ultimo tratamiento, y sale de alta. seguir en observación en casa', NULL, NULL, 3, '2025-11-26 12:07:30', NULL, '2025-11-26 12:07:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id_mascota` int(11) NOT NULL,
  `mascota` varchar(255) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_raza` int(11) DEFAULT NULL,
  `id_sexo` int(11) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `id_estado_mascota` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `archivo` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`id_mascota`, `mascota`, `id_cliente`, `id_raza`, `id_sexo`, `edad`, `color`, `peso`, `id_estado_mascota`, `observaciones`, `archivo`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 'Milett', 333, 5, 2, 108, 'Crema', 18.00, 1, 'zxc', '1.jpg', 3, '2025-09-01 18:58:24', 3, '2025-12-07 15:27:25'),
(2, 'Peluchina', 320, 5, 2, 84, 'Plomo', 23.00, 1, NULL, NULL, 3, '2025-09-28 20:12:06', 3, '2025-10-10 11:42:43'),
(3, 'Canela', 321, 3, 2, 72, 'Blanco', 7.00, 1, '', NULL, 3, '2025-09-28 20:13:02', NULL, '2025-09-28 20:13:02'),
(4, 'Pucchi', 321, 5, 1, 36, 'Castaño', 8.00, 1, '', NULL, 3, '2025-09-28 20:13:36', NULL, '2025-09-28 20:13:36'),
(5, 'Maya', 339, 5, 2, 36, 'Marrón claro', 31.00, 1, NULL, NULL, 3, '2025-09-28 20:14:44', 3, '2025-10-10 18:18:41'),
(6, 'Tobby', 340, 5, 1, 96, 'Blanco con crema', 7.10, 1, NULL, NULL, 3, '2025-09-29 11:53:32', 3, '2025-10-10 11:41:34'),
(7, 'Blacky', 341, 5, 1, 12, 'Negro', 5.00, 1, NULL, NULL, 3, '2025-09-29 12:03:38', 3, '2025-10-10 11:41:42'),
(8, 'Kuky', 342, 3, 2, NULL, 'Blanco', 12.70, 1, NULL, NULL, 3, '2025-09-29 12:07:39', 3, '2025-10-10 11:41:19'),
(9, 'Rey', 343, 5, 1, 84, 'Marrón claro', 25.80, 1, NULL, NULL, 3, '2025-09-29 12:23:02', 3, '2025-10-10 11:41:52'),
(10, 'Aslan', 318, 5, 1, NULL, 'Marrón', 4.80, 1, NULL, NULL, 3, '2025-09-29 12:27:08', 3, '2025-10-10 11:42:08'),
(11, 'Locky', 318, 5, 1, NULL, 'Negro', 4.20, 1, NULL, NULL, 3, '2025-09-29 12:28:29', 3, '2025-10-10 11:42:24'),
(12, 'Gasper', 318, 5, 1, NULL, 'Blanco', 5.30, 1, NULL, NULL, 3, '2025-09-29 12:29:10', 3, '2025-10-10 11:42:34'),
(13, 'Rick', 345, 5, 1, 108, 'Blanco', 4.70, 1, NULL, NULL, 3, '2025-09-29 12:37:30', 3, '2025-10-10 11:55:33'),
(14, 'Lety', 346, 5, 2, NULL, NULL, NULL, 1, '', NULL, 3, '2025-09-29 12:39:51', NULL, '2025-09-29 12:39:51'),
(15, 'Polo', 347, 5, 1, NULL, 'Blanco', 15.90, 1, NULL, NULL, 3, '2025-09-29 12:41:28', 3, '2025-10-10 11:55:44'),
(16, 'Oddy', 347, 5, 1, NULL, 'Negro', 7.40, 1, NULL, NULL, 3, '2025-09-29 12:42:13', 3, '2025-10-10 11:56:17'),
(17, 'Nina', 348, 3, 2, NULL, 'Blanco', 4.70, 1, NULL, NULL, 3, '2025-09-29 12:44:57', 3, '2025-10-10 11:55:52'),
(18, 'Pili', 349, 5, 2, 48, 'Blanco', 4.20, 1, NULL, NULL, 3, '2025-09-29 12:50:18', 3, '2025-10-10 11:40:44'),
(19, 'Max', 332, 5, 1, NULL, 'Marrón', 14.60, 1, NULL, NULL, 3, '2025-09-29 12:53:35', 3, '2025-10-10 11:56:03'),
(20, 'Colmillo', 351, 5, 1, 84, 'Plomo', 6.40, 1, NULL, NULL, 3, '2025-09-29 12:57:11', 3, '2025-10-10 11:56:28'),
(21, 'Kira', 351, 5, 2, 132, 'Blanco con crema', 6.90, 1, NULL, NULL, 3, '2025-09-29 12:58:16', 3, '2025-10-10 11:56:43'),
(22, 'Pocket', 336, 5, 1, 36, 'Blanco con negro', 46.20, 1, NULL, NULL, 3, '2025-09-29 14:34:57', 3, '2025-10-10 11:56:52'),
(23, 'J o a n', 336, 5, 1, 36, 'Blanco con crema', 13.40, 1, NULL, NULL, 3, '2025-09-29 14:36:36', 3, '2025-11-06 14:44:12'),
(24, 'Peluchina', 320, 5, 2, 84, 'Ceniza', 18.40, 1, NULL, NULL, 3, '2025-09-29 14:41:56', 3, '2025-10-10 11:57:21'),
(25, 'Chiquita', 352, 5, 2, 12, 'Plomo', 5.40, 1, NULL, NULL, 3, '2025-09-29 14:52:01', 3, '2025-10-10 11:57:12'),
(26, 'Negrita', 352, 5, 2, 36, 'Negro', 6.70, 1, NULL, NULL, 3, '2025-09-29 14:52:58', 3, '2025-10-10 11:57:39'),
(27, 'Nala', 353, 5, 2, 48, 'Crema', 6.30, 1, NULL, NULL, 3, '2025-09-29 15:02:10', 3, '2025-10-10 11:57:31'),
(28, 'Lolito', 353, 5, 1, 36, 'Blanco con manchas marrón', 17.80, 1, NULL, NULL, 3, '2025-09-29 15:03:18', 3, '2025-10-10 11:40:26'),
(29, 'Lulu', 354, 5, 2, 48, 'Negro', 19.00, 1, NULL, NULL, 3, '2025-09-29 15:09:58', 3, '2025-10-10 11:40:14'),
(30, 'Laya', 355, 5, 2, 12, 'Plomo cenizo', 7.60, 1, NULL, NULL, 3, '2025-09-29 15:31:15', 3, '2025-10-10 11:39:54'),
(31, 'Candela', 356, 5, 1, 108, 'Marrón y negro', 15.40, 1, NULL, NULL, 3, '2025-09-29 16:12:27', 3, '2025-10-10 11:39:39'),
(32, 'Giordy', 334, 5, 1, 108, 'Marrón', 5.30, 1, NULL, NULL, 3, '2025-09-29 16:42:33', 3, '2025-10-10 11:39:25'),
(33, 'Maylo', 334, 5, 1, 72, 'Blanco con manchas marrón', 5.30, 1, NULL, NULL, 3, '2025-09-29 16:45:23', 3, '2025-10-10 11:39:13'),
(34, 'Raknar', 358, 5, 1, 48, 'Azul y fuego', 3.60, 1, NULL, NULL, 3, '2025-09-29 16:51:37', 3, '2025-10-10 11:39:03'),
(35, 'Peter', 359, 5, 1, 36, 'Marrón', 3.60, 1, NULL, NULL, 3, '2025-09-29 17:03:01', 3, '2025-10-10 11:38:44'),
(36, 'Oddy', 359, 5, 1, 120, 'Blanco', 7.60, 1, NULL, NULL, 3, '2025-09-29 17:03:59', 3, '2025-10-10 11:38:28'),
(37, 'Nala', 360, 5, 2, 60, NULL, 4.70, 1, '', NULL, 3, '2025-09-29 17:09:07', NULL, '2025-09-29 17:09:07'),
(38, 'Morocha', 361, 5, 2, 96, 'Negro', 10.40, 1, NULL, NULL, 3, '2025-09-29 17:13:31', 3, '2025-10-22 19:32:58'),
(39, 'Oriana', 362, 5, 2, 120, 'Blanco', 16.10, 1, NULL, NULL, 3, '2025-09-29 17:17:00', 3, '2025-10-10 11:37:21'),
(40, 'Canela', 363, 5, 2, 48, 'Marrón', 12.30, 1, NULL, NULL, 3, '2025-09-29 17:23:54', 3, '2025-10-10 11:37:13'),
(41, 'Choco', 364, 5, 1, 96, 'Crema', 13.80, 1, NULL, NULL, 3, '2025-09-29 18:25:50', 3, '2025-10-10 11:37:03'),
(42, 'Boby', 365, 5, 1, 36, 'Blanco', 12.50, 1, NULL, NULL, 3, '2025-09-29 18:38:50', 3, '2025-10-10 11:36:47'),
(43, 'Abby', 366, 5, 2, 60, 'Blanco', 12.50, 1, NULL, NULL, 3, '2025-09-29 18:56:13', 3, '2025-10-10 11:36:10'),
(44, 'Ruffo', 315, 5, 1, 48, 'Blanco con crema', 7.60, 1, NULL, NULL, 3, '2025-09-29 19:06:57', 3, '2025-10-10 11:36:37'),
(45, 'Zeus', 367, 5, 1, 96, 'Negro con marrón', 35.00, 1, NULL, NULL, 3, '2025-09-29 19:13:08', 3, '2025-10-10 11:35:42'),
(46, 'Chocolate', 368, 5, 1, 72, 'Marrón', 4.50, 1, NULL, NULL, 3, '2025-09-29 19:19:58', 3, '2025-10-10 11:35:24'),
(47, 'Rocco', 369, 5, 1, NULL, NULL, 16.50, 1, NULL, NULL, 3, '2025-09-29 19:33:47', 3, '2025-11-14 15:18:30'),
(48, 'Jake', 370, 5, 1, 168, 'Cenizo', 15.60, 1, NULL, NULL, 3, '2025-09-29 19:37:58', 3, '2025-10-10 11:35:01'),
(49, 'Bardock', 351, 5, 1, 84, 'Plomo', 14.50, 1, NULL, NULL, 3, '2025-09-29 19:38:45', 3, '2025-10-10 11:34:52'),
(50, 'Dulce', 371, 5, 2, 12, 'Marrón', 1.50, 1, NULL, NULL, 3, '2025-09-29 19:41:59', 3, '2025-10-10 11:34:43'),
(51, 'Princesa', 371, 6, 2, 24, 'Negro', 3.50, 1, NULL, NULL, 3, '2025-09-29 19:42:50', 3, '2025-10-10 11:34:33'),
(52, 'Hachy', 330, 5, 2, 36, 'Blanco con manchas marrón', 5.60, 1, NULL, NULL, 3, '2025-09-29 19:47:16', 3, '2025-10-10 18:28:38'),
(53, 'Rex', 372, 5, 1, 24, 'Crema', 34.30, 1, NULL, NULL, 3, '2025-09-29 19:50:28', 3, '2025-10-10 18:28:29'),
(54, 'Jack', 375, 5, 1, 36, 'Marrón claro', 16.70, 1, NULL, NULL, 3, '2025-10-02 17:44:12', 3, '2025-10-10 18:28:19'),
(55, 'Coco', 373, 5, 1, 72, 'Blanco con manchas negras', 34.60, 1, NULL, NULL, 3, '2025-10-02 17:50:57', 3, '2025-10-10 18:28:09'),
(56, 'Chiquita', 373, 5, 2, 48, 'Crema', 12.30, 1, NULL, NULL, 3, '2025-10-02 17:51:45', 3, '2025-10-10 18:27:57'),
(57, 'Campanita', 374, 5, 2, 144, 'Marrón', 6.10, 1, NULL, NULL, 3, '2025-10-02 17:55:10', 3, '2025-10-10 18:27:49'),
(58, 'Felipe', 377, 5, 1, 84, 'Blanco', 12.30, 1, NULL, NULL, 3, '2025-10-02 18:03:41', 3, '2025-10-10 18:27:23'),
(59, 'Chatita', 377, 5, 2, 108, 'Blanco', 11.20, 1, NULL, NULL, 3, '2025-10-02 18:04:28', 3, '2025-10-10 18:27:08'),
(60, 'Cooper', 378, 5, 1, 48, 'Blanco y marrón', 5.60, 1, NULL, NULL, 3, '2025-10-02 18:11:08', 3, '2025-10-10 18:26:52'),
(61, 'Calvin', 378, 3, 1, 24, 'Crema', 3.60, 1, NULL, NULL, 3, '2025-10-02 18:12:00', 3, '2025-10-10 11:33:25'),
(62, 'Oso', 368, 5, 1, 48, 'Marrón', 8.70, 1, 'Es un perro de la calle', NULL, 3, '2025-10-03 19:10:11', 3, '2025-10-10 18:26:30'),
(64, 'Peluchin', 327, 8, 1, 36, 'Blanco', 5.90, 1, 'es tipo Shitzu', NULL, 3, '2025-10-06 12:36:08', 3, '2025-10-10 11:33:17'),
(65, 'Benito', 382, 9, 1, 36, 'Negro cenizo', 12.60, 1, NULL, NULL, 3, '2025-10-06 12:38:41', 3, '2025-10-10 11:33:12'),
(66, 'Blanca', 382, 5, 2, 36, 'verde con rojo', 12.50, 3, NULL, NULL, 3, '2025-10-06 12:39:29', 3, '2025-11-22 21:05:59'),
(67, 'Tyrion', 384, 5, 1, 144, 'Blanco', 14.80, 1, NULL, NULL, 3, '2025-10-06 12:46:12', 3, '2025-10-10 18:26:08'),
(68, 'Albus', 379, 5, 1, 84, 'Blanco', 35.00, 1, NULL, NULL, 3, '2025-10-06 12:49:48', 3, '2025-10-10 18:25:55'),
(69, 'Aria', 381, 8, 2, 108, 'Blanco con caramelo', 6.20, 1, NULL, NULL, 3, '2025-10-06 13:01:15', 3, '2025-10-10 11:32:40'),
(70, 'Osito', 384, 5, 1, 48, 'Blanco', 8.60, 1, NULL, NULL, 3, '2025-10-06 14:40:24', NULL, '2025-10-06 14:40:24'),
(71, 'Romeo', 387, 5, 1, 108, 'Marrón', 22.60, 1, NULL, NULL, 3, '2025-10-07 14:07:41', 3, '2025-10-10 18:25:22'),
(72, 'Negrita', 387, 5, 2, 108, 'Plomo', 19.60, 1, NULL, NULL, 3, '2025-10-07 14:08:33', 3, '2025-10-10 18:25:00'),
(73, 'Laydi Celia', 387, 5, 2, 108, 'Blanco', 22.40, 1, NULL, NULL, 3, '2025-10-07 14:09:23', NULL, '2025-10-07 14:09:23'),
(74, 'Pandora', 388, 8, 2, 96, 'Beige', 6.50, 1, NULL, NULL, 3, '2025-10-08 16:16:30', NULL, '2025-10-08 16:16:30'),
(75, 'Tyson', 352, 11, 1, 48, 'Acero', 27.30, 1, NULL, NULL, 3, '2025-10-08 16:22:04', NULL, '2025-10-08 16:22:04'),
(77, 'Rosita', 382, 10, 2, 6, 'Blanco', 2.80, 1, NULL, NULL, 3, '2025-10-08 16:51:18', NULL, '2025-10-08 16:51:18'),
(78, 'Siberian Husky hembra', 389, 12, 2, 3, 'Marrón claro con blanco', 4.90, 1, NULL, NULL, 3, '2025-10-08 17:06:15', 3, '2025-10-16 17:10:23'),
(79, 'Siberian Husky', 389, 12, 1, 3, 'Negro', 4.90, 1, NULL, NULL, 3, '2025-10-08 17:07:12', 3, '2025-10-10 12:37:29'),
(80, 'Lila', 390, 9, 2, 24, 'Negro ceniza', 12.80, 1, NULL, NULL, 3, '2025-10-10 18:03:58', NULL, '2025-10-10 18:03:58'),
(81, 'Leo', 391, 14, 1, 36, 'Marrón claro', 4.90, 1, NULL, NULL, 3, '2025-10-10 18:05:06', 3, '2025-10-14 16:56:53'),
(82, 'Sira', 392, 13, 2, 12, 'Negro dorado', 4.00, 1, NULL, NULL, 3, '2025-10-10 18:08:29', NULL, '2025-10-10 18:08:29'),
(84, 'Mateo', 393, 5, 1, 24, 'Blanco', 8.30, 1, NULL, NULL, 3, '2025-10-14 16:51:27', NULL, '2025-10-14 16:51:27'),
(85, 'Genaro', 386, 10, 1, 12, 'Naranja', 4.60, 1, NULL, NULL, 3, '2025-10-16 16:53:23', NULL, '2025-10-16 16:53:23'),
(86, 'Frida', 394, 5, 2, 36, 'marrón', 6.70, 1, NULL, NULL, 3, '2025-10-20 15:03:04', NULL, '2025-10-20 15:03:04'),
(87, 'Blanca', 395, 5, 1, 2, 'Blanco', 3.50, 1, NULL, NULL, 3, '2025-10-21 09:48:57', 3, '2025-10-21 10:49:34'),
(88, 'Kenia', 396, 5, 2, 72, 'blanco -plomo', 9.80, 1, NULL, NULL, 3, '2025-10-22 15:52:19', NULL, '2025-10-22 15:52:19'),
(89, 'Joaquin', 396, 5, 1, 10, 'marrón', 7.80, 1, NULL, NULL, 3, '2025-10-22 15:53:06', NULL, '2025-10-22 15:53:06'),
(90, 'Ethel', 397, 5, 2, 24, 'marrón', 5.70, 1, NULL, NULL, 3, '2025-10-22 16:01:09', NULL, '2025-10-22 16:01:09'),
(91, 'BOBBY', 398, 15, 1, 132, 'amarillo', 24.00, 1, NULL, NULL, 3, '2025-10-22 16:29:48', NULL, '2025-10-22 16:29:48'),
(92, 'Samantha', 399, 14, 2, 4, NULL, NULL, 1, NULL, NULL, 3, '2025-10-22 16:35:57', NULL, '2025-10-22 16:35:57'),
(93, 'Tom', 399, 14, 1, 12, NULL, 4.00, 1, NULL, NULL, 3, '2025-10-22 16:36:47', NULL, '2025-10-22 16:36:47'),
(94, 'peque', 400, 9, 2, 84, 'cenizo', 5.70, 1, NULL, NULL, 3, '2025-10-22 17:08:43', NULL, '2025-10-22 17:08:43'),
(95, 'Rocco', 401, 16, 1, 36, 'marrón', 15.80, 1, NULL, NULL, 3, '2025-10-22 17:43:03', NULL, '2025-10-22 17:43:03'),
(96, 'Estrella', 402, 5, 2, 72, 'BLANCO', 14.70, 1, NULL, NULL, 3, '2025-10-22 19:08:47', NULL, '2025-10-22 19:08:47'),
(97, 'Panda', 402, 5, 2, 48, 'negro-marrón', 9.50, 1, NULL, NULL, 3, '2025-10-22 19:09:41', NULL, '2025-10-22 19:09:41'),
(98, 'Rocky', 403, 5, 1, 72, 'marrón-blanco', 5.70, 1, NULL, NULL, 3, '2025-10-22 19:18:23', NULL, '2025-10-22 19:18:23'),
(99, 'Martha', 404, 5, 2, 24, 'negro', 4.60, 1, NULL, NULL, 3, '2025-10-22 19:42:16', NULL, '2025-10-22 19:42:16'),
(100, 'Alu', 359, 5, 2, 24, 'marrón', 15.80, 1, NULL, NULL, 3, '2025-10-22 19:49:02', NULL, '2025-10-22 19:49:02'),
(101, 'hacko', 405, 5, 2, 24, 'crema', 6.10, 1, NULL, NULL, 3, '2025-10-22 20:00:00', NULL, '2025-10-22 20:00:00'),
(102, 'Felina', 406, 14, 2, 3, 'plomo atrigado', 1.80, 1, NULL, NULL, 3, '2025-10-22 20:07:15', NULL, '2025-10-22 20:07:15'),
(103, 'Bayro', 407, 5, 1, 5, 'Blanco', 9.50, 1, NULL, NULL, 3, '2025-10-23 18:51:38', NULL, '2025-10-23 18:51:38'),
(104, 'Hachy', 408, 5, 1, 36, 'Marrón', 7.60, 1, 'Tipo Pekinés', NULL, 3, '2025-10-25 18:27:53', NULL, '2025-10-25 18:27:53'),
(105, 'Candy', 409, 5, 2, 24, 'Blanco, crema', 6.50, 1, NULL, NULL, 3, '2025-10-25 18:29:32', NULL, '2025-10-25 18:29:32'),
(106, 'Samantha', 410, 14, 2, 6, 'Plomo', 2.20, 1, NULL, NULL, 3, '2025-10-25 18:30:38', 3, '2025-11-22 13:00:28'),
(107, 'Marrón', 411, 5, 1, 120, 'Marrón', 15.30, 1, NULL, NULL, 3, '2025-10-28 11:21:25', NULL, '2025-10-28 11:21:25'),
(108, 'Chiqui', 412, 5, 2, 96, 'Crema', 4.30, 1, 'Mestizo tipo Pekinés', NULL, 3, '2025-10-28 12:36:09', NULL, '2025-10-28 12:36:09'),
(109, 'Toby', 413, 5, 1, 24, 'Ocre', 7.20, 1, NULL, NULL, 3, '2025-10-28 14:09:06', NULL, '2025-10-28 14:09:06'),
(110, 'Chanelo', 414, 14, 1, 7, NULL, 3.90, 1, NULL, NULL, 3, '2025-10-28 19:22:12', NULL, '2025-10-28 19:22:12'),
(111, 'Back', 415, 5, 1, 12, 'Blanco y negro', 5.60, 1, 'Tipo shitzu', NULL, 3, '2025-11-06 16:03:43', NULL, '2025-11-06 16:03:43'),
(112, 'Pulga', 416, 5, 1, 24, 'Marrón', 5.70, 1, NULL, NULL, 3, '2025-11-06 16:05:08', NULL, '2025-11-06 16:05:08'),
(113, 'Sparkie', 416, 5, 1, 12, 'Marrón', 5.30, 1, NULL, NULL, 3, '2025-11-06 16:06:04', NULL, '2025-11-06 16:06:04'),
(114, 'Laica', 416, 5, 2, 12, 'Marrón', 4.60, 1, NULL, NULL, 3, '2025-11-07 12:02:12', NULL, '2025-11-07 12:02:12'),
(115, 'Woddy', 417, 5, 1, 36, 'Blanco', 8.90, 1, NULL, NULL, 3, '2025-11-07 12:02:58', NULL, '2025-11-07 12:02:58'),
(116, 'Nico', 388, 5, 1, 36, 'Blanco', 4.80, 1, NULL, NULL, 3, '2025-11-07 12:04:08', NULL, '2025-11-07 12:04:08'),
(117, 'Valiente', 419, 9, 1, 60, 'Cenizo', 10.60, 1, NULL, NULL, 3, '2025-11-07 12:06:57', NULL, '2025-11-07 12:06:57'),
(118, 'Fiona', 420, 5, 2, 8, 'Blanco crema', 7.30, 1, NULL, NULL, 3, '2025-11-07 12:07:42', NULL, '2025-11-07 12:07:42'),
(119, 'Winnie', 421, 5, 2, 36, 'Blanco marrón', 27.80, 1, NULL, NULL, 3, '2025-11-07 12:08:33', NULL, '2025-11-07 12:08:33'),
(120, 'Choco', 422, 5, 1, 60, 'Marrón', 17.70, 1, NULL, NULL, 3, '2025-11-07 12:09:29', NULL, '2025-11-07 12:09:29'),
(121, 'Choca', 423, 5, 1, 84, 'Negro', 6.60, 1, NULL, NULL, 3, '2025-11-07 12:10:29', NULL, '2025-11-07 12:10:29'),
(122, 'Hachy', 424, 5, 1, 24, 'Blanco crema', 12.70, 1, NULL, NULL, 3, '2025-11-07 12:11:26', NULL, '2025-11-07 12:11:26'),
(123, 'Pandy', 425, 5, 1, 36, 'Negro', 7.30, 1, NULL, NULL, 3, '2025-11-07 12:13:09', NULL, '2025-11-07 12:13:09'),
(124, 'Pitufo', 426, 5, 1, 60, 'Blanco', 12.50, 1, NULL, NULL, 3, '2025-11-07 14:49:42', NULL, '2025-11-07 14:49:42'),
(125, 'Luna', 427, 5, 2, 7, 'Marrón claro', 4.80, 1, NULL, NULL, 3, '2025-11-07 14:52:14', NULL, '2025-11-07 14:52:14'),
(126, 'Conan', 428, 5, 1, 8, 'Marrón', 35.00, 1, NULL, '126.jpg', 3, '2025-11-07 14:56:04', 3, '2025-11-24 16:35:41'),
(127, 'Barba de oro', 423, 5, 1, 7, 'negro', 5.70, 1, NULL, NULL, 3, '2025-11-14 15:35:29', NULL, '2025-11-14 15:35:29'),
(128, 'Kiwi', 430, 5, 2, 3, 'marrón-cenizo', 3.80, 1, NULL, NULL, 3, '2025-11-14 15:42:05', NULL, '2025-11-14 15:42:05'),
(129, 'Camilo', 355, 14, 1, 24, 'negro y blanco', 3.70, 1, NULL, NULL, 3, '2025-11-14 15:49:48', NULL, '2025-11-14 15:49:48'),
(130, 'Romina', 417, 5, 2, 120, 'negro', 5.80, 1, NULL, NULL, 3, '2025-11-14 16:05:15', NULL, '2025-11-14 16:05:15'),
(131, 'Toffe', 411, 5, 1, 120, 'negro-marrón', 16.40, 1, NULL, NULL, 3, '2025-11-14 16:09:29', NULL, '2025-11-14 16:09:29'),
(132, 'Nala', 431, 5, 2, 60, 'negro', 9.00, 1, NULL, NULL, 3, '2025-11-14 16:19:43', NULL, '2025-11-14 16:19:43'),
(133, 'Peluchin', 432, 9, 1, 12, 'plomo', 15.80, 1, NULL, NULL, 3, '2025-11-14 16:35:53', NULL, '2025-11-14 16:35:53'),
(134, 'Princesa', 433, 14, 2, 12, 'blanco-marrón', 2.60, 1, NULL, NULL, 3, '2025-11-14 16:37:20', NULL, '2025-11-14 16:37:20'),
(135, 'Yoshy', 434, 5, 1, 24, 'Blanco', 10.80, 1, NULL, NULL, 3, '2025-11-15 13:26:24', NULL, '2025-11-15 13:26:24'),
(136, 'Lala', 435, 5, 2, 48, 'Blanco crema', 9.60, 1, 'Perrita esterilizada, el día de su cirugía le encontraron quistes', NULL, 3, '2025-11-15 13:28:25', 3, '2025-11-25 15:50:28'),
(137, 'max', 436, 5, 1, 3, 'vacío', 6.80, 1, NULL, NULL, 3, '2025-11-26 09:42:58', NULL, '2025-11-26 09:42:58'),
(138, 'zero', 381, 5, 1, 38, 'blanco', 4.50, 1, NULL, NULL, 3, '2025-11-26 10:00:05', NULL, '2025-11-26 10:00:05'),
(139, 'molly', 437, 8, 2, 50, 'cenizo', 4.10, 1, NULL, NULL, 3, '2025-11-26 10:10:13', NULL, '2025-11-26 10:10:13'),
(140, 'chocolate', 437, 8, 1, 75, 'marrón cenizo', 7.60, 1, NULL, NULL, 3, '2025-11-26 10:12:05', NULL, '2025-11-26 10:12:05'),
(141, 'Oso', 438, 5, 1, 5, 'marrón claro', 7.70, 1, NULL, NULL, 3, '2025-11-26 10:18:36', NULL, '2025-11-26 10:18:36'),
(142, 'Valentina', 439, 6, 2, 11, 'negro', 2.60, 1, NULL, NULL, 3, '2025-11-26 10:48:48', NULL, '2025-11-26 10:48:48'),
(143, 'Tasha', 440, 8, 2, 185, 'beige', 9.40, 1, NULL, NULL, 3, '2025-11-26 11:30:12', NULL, '2025-11-26 11:30:12'),
(144, 'Docky', 441, 5, 1, 68, 'blanco y negro', 10.10, 1, NULL, NULL, 3, '2025-11-26 11:50:09', NULL, '2025-11-26 11:50:09'),
(145, 'nina', 442, 5, 2, 144, 'crema', 9.30, 1, 'es un perrito tuerto', NULL, 3, '2025-11-26 12:12:17', NULL, '2025-11-26 12:12:17'),
(146, 'Luna', 443, 5, 2, 26, 'blanco con amarillo', 12.50, 1, NULL, NULL, 3, '2025-11-27 13:56:49', NULL, '2025-11-27 13:56:49'),
(147, 'Blanca', 443, 5, 2, 18, 'blanca', 12.40, 1, NULL, NULL, 3, '2025-11-27 13:57:37', NULL, '2025-11-27 13:57:37'),
(148, 'Silvestre', 417, 14, 1, 8, 'negro, patitas blancas', 3.60, 1, NULL, NULL, 3, '2025-11-27 13:58:47', NULL, '2025-11-27 13:58:47'),
(149, 'Mascota', 444, 11, 1, 123, 'Marrón', 12.00, 1, 'Mascota de pruebas', NULL, 3, '2025-11-29 13:07:13', 3, '2025-11-29 18:15:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `id_medicamento` int(11) NOT NULL,
  `medicamento` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`id_medicamento`, `medicamento`, `descripcion`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(55, 'Tricortrimax', 'Potente antiinflamatorio en casos de prurito en alergias de piel', 3, '2025-10-11 17:52:16', 3, '2025-11-10 16:49:31'),
(56, 'Antipulga', 'Controla y previene infestaciones de pulgas', 3, '2025-10-11 18:00:09', NULL, '2025-10-11 18:00:09'),
(57, 'Antiparasitario', 'Combate los parásitos o evita su aparición', 3, '2025-10-11 18:28:59', NULL, '2025-10-11 18:28:59'),
(58, 'Hipocloroso', 'Ácido débil y potente desinfectante', 3, '2025-10-11 18:54:50', NULL, '2025-10-11 18:54:50'),
(59, 'Collar isabelino', 'Accesorio veterinario en forma de cono que se coloca alrededor del cuello de una mascota para evitar que se lama, muerda o rasque heridas, puntos de sutura, vendajes o zonas irritadas.', 3, '2025-10-11 18:59:18', NULL, '2025-10-11 18:59:18'),
(60, 'Ivermectina', 'Se utiliza para tratar la ceguera de los ríos (oncocercosis), la infección intestinal causada por oxiuros (estrongiloidiasis) y otros tipos de infecciones por gusanos', 3, '2025-10-11 19:03:33', NULL, '2025-10-11 19:03:33'),
(61, 'Antibiótico', 'Es un medicamento que se usa para tratar infecciones causadas por bacterias, ya sea matándolas o impidiendo que se multipliquen', 3, '2025-10-11 19:08:17', NULL, '2025-10-11 19:08:17'),
(62, 'Meloxisan  pets inyectable', 'sustancia que reduce la inflamación, el dolor y la hinchazón del cuerpo', 3, '2025-10-20 17:00:21', 3, '2025-11-10 11:45:49'),
(63, 'vacuna cuádruple', 'protege a los perros contra cuatro enfermedades: moquillo (distemper), hepatitis contagiosa canina, parvovirus y parainfluenza canina', 3, '2025-10-20 17:02:01', NULL, '2025-10-20 17:02:01'),
(64, 'vacuna quíntuple', 'protege contra cinco enfermedades: Moquillo canino (Distemper), Adenovirus, Parainfluenza, Parvovirus y cuatro serovariedades de Leptospirosis', 3, '2025-10-20 17:03:02', NULL, '2025-10-20 17:03:02'),
(65, 'vacuna séxtuple con rabia', 'es una vacuna para perros que protege contra seis enfermedades graves: moquillo canino, hepatitis infecciosa canina (adenovirus tipo 1 y 2), parvovirus, parainfluenza y rabia', 3, '2025-10-20 17:04:09', NULL, '2025-10-20 17:04:09'),
(66, 'vacuna triple felina', 'protege a los gatos contra tres enfermedades virales: la rinotraqueítis (gripe felina), el calicivirus y la panleucopenia', 3, '2025-10-20 17:04:57', NULL, '2025-10-20 17:04:57'),
(67, 'Dexalan', NULL, 3, '2025-11-10 11:09:55', NULL, '2025-11-10 11:09:55'),
(68, 'DIARREFIN PLUS VIA ORAL', 'Infecciones intestinales, diarreas', 3, '2025-11-10 11:25:03', 3, '2025-11-10 11:32:18'),
(69, 'Histaprov', 'Antihistamínico. Manifestaciones alérgicas, intoxicaciones o ingestión de alimentos, dermatitis, urticaria,', 3, '2025-11-10 11:30:04', 3, '2025-11-10 11:31:40'),
(70, 'Zeus inyectable', 'Antiparasitario casos de sarna, infestacion de garrapatas', 3, '2025-11-10 11:33:22', NULL, '2025-11-10 11:33:22'),
(71, 'Biovalgina inyectable', 'Antipiretico, analgésico, antiespasmodico', 3, '2025-11-10 11:35:28', NULL, '2025-11-10 11:35:28'),
(72, 'Hepatone', 'Protector estimulante de la función hepática', 3, '2025-11-10 11:40:17', NULL, '2025-11-10 11:40:17'),
(73, 'Antalvet compuesto', 'Analgésico antipiretico antiespasmodico', 3, '2025-11-10 11:41:09', NULL, '2025-11-10 11:41:09'),
(74, 'Caloi-NF', 'Recalcificante, vitamínico, antianémico', 3, '2025-11-10 11:43:35', NULL, '2025-11-10 11:43:35'),
(75, 'Agrogenta', 'Antibiótico aminoglucosido', 3, '2025-11-10 11:44:07', NULL, '2025-11-10 11:44:07'),
(76, 'Sulfatrim', 'Antibiótico, sulfadoxina y trimetoprin, en casos de diarreas', 3, '2025-11-10 11:45:12', NULL, '2025-11-10 11:45:12'),
(77, 'Emicina', 'Antibiotico de amplio espectro contiene oxitetraciclina', 3, '2025-11-10 11:47:23', NULL, '2025-11-10 11:47:23'),
(78, 'Midapet', 'Antiemético de acción local y central', 3, '2025-11-10 11:48:30', NULL, '2025-11-10 11:48:30'),
(79, 'Aminoplex forte', 'Reconstituyente proteínico, electrolitos multivitamínado con 12 aminoacidos', 3, '2025-11-10 11:50:15', NULL, '2025-11-10 11:50:15'),
(80, 'Hematofos B12', 'Potente reconstituyente, estimulante multivitamínado, adicionado con Fósforo', 3, '2025-11-10 11:51:30', NULL, '2025-11-10 11:51:30'),
(81, 'Hepatin', 'Hepatopeotector dexintoxicante', 3, '2025-11-10 11:52:26', NULL, '2025-11-10 11:52:26'),
(82, 'Complex B', 'Reconstituyente vitamínico', 3, '2025-11-10 11:53:13', NULL, '2025-11-10 11:53:13'),
(83, 'Enropro 10%', 'Antibiótico, enrofloxacina', 3, '2025-11-10 11:54:01', NULL, '2025-11-10 11:54:01'),
(84, 'ZEUS 1% LA - IVERMECTINA', 'descripcion', 3, '2025-11-10 14:20:13', 3, '2025-11-10 14:31:22'),
(85, 'suero fisiológico-Lactato de Ringer', NULL, 3, '2025-11-14 10:03:00', NULL, '2025-11-14 10:03:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_04_09_161802_create_personal_access_tokens_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_cita`
--

CREATE TABLE `motivo_cita` (
  `id_motivo_cita` int(11) NOT NULL,
  `motivo_cita` varchar(60) NOT NULL,
  `lapso_tiempo` varchar(100) NOT NULL,
  `creater_id` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updater_id` bigint(20) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo_cita`
--

INSERT INTO `motivo_cita` (`id_motivo_cita`, `motivo_cita`, `lapso_tiempo`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 'CONSULTA GENERAL', '', NULL, NULL, NULL, NULL),
(2, 'VACUNACIÓN', '', NULL, NULL, NULL, NULL),
(3, 'DESPARASITACIÓN', '', NULL, NULL, NULL, NULL),
(4, 'BAÑO Y ASEO', '', NULL, NULL, NULL, NULL),
(5, 'EMERGENCIA', '', NULL, NULL, NULL, NULL),
(6, 'CONTROL POST-TRATAMIENTO', '', NULL, NULL, NULL, NULL),
(7, 'CIRUGÍA', '', NULL, NULL, NULL, NULL),
(8, 'BAÑO Y CORTE', '', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_historia_clinica`
--

CREATE TABLE `motivo_historia_clinica` (
  `id_motivo_historia_clinica` int(11) NOT NULL,
  `motivo_historia_clinica` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo_historia_clinica`
--

INSERT INTO `motivo_historia_clinica` (`id_motivo_historia_clinica`, `motivo_historia_clinica`) VALUES
(1, 'ACCIDENTE'),
(2, 'ASEO'),
(3, 'CORTE DE UÑAS'),
(4, 'CIRUGIA'),
(5, 'VACUNACION'),
(6, 'DESPARASITACION INTERNA'),
(7, 'DESPARASITACION EXTERNA'),
(8, 'CHEQUEO GENERAL'),
(9, 'ENFERMEDAD RESPIRATORIA'),
(10, 'ENFERMEDAD DIGESTIVA'),
(11, 'ENFERMEDAD CUTANEA'),
(12, 'ENFERMEDAD CARDIACA'),
(13, 'ENFERMEDAD RENAL'),
(14, 'ENFERMEDAD HEPATICA'),
(15, 'ENFERMEDAD NEUROLOGICA'),
(16, 'ENFERMEDAD OCULAR'),
(17, 'ENFERMEDAD ORAL/DENTAL'),
(18, 'TRATAMIENTO DE HERIDAS'),
(19, 'CONTROL DE PESO'),
(20, 'DIETA ESPECIAL'),
(21, 'CONTROL DE LACTANCIA'),
(22, 'PARTO / CONTROL OBSTETRICO'),
(23, 'GESTION DE INFECCIONES'),
(24, 'ALERGIA'),
(25, 'ENFERMEDAD METABOLICA'),
(26, 'EXAMEN PREQUIRURGICO'),
(27, 'EXAMEN POSTQUIRURGICO'),
(28, 'MONITOREO DE ANESTESIA'),
(29, 'REVISIÓN DE MEDICAMENTOS'),
(30, 'CONSULTA DE COMPORTAMIENTO'),
(31, 'EXAMEN DE PIEL Y PELUQUERIA'),
(32, 'REVISIÓN DE VACUNAS'),
(33, 'PREVENCIÓN PARASITARIA'),
(34, 'PROCEDIMIENTO LABORATORIO'),
(35, 'PROCEDIMIENTO IMAGENES'),
(36, 'PROCEDIMIENTO ENDOSCOPIA'),
(37, 'EVALUACIÓN DE FERIDAS CRONICAS'),
(38, 'CONTROL DE CONDICIONES CRÓNICAS'),
(39, 'TERAPIA FISICA / REHABILITACION'),
(40, 'TRATAMIENTO DERMATOLÓGICO'),
(41, 'TRATAMIENTO CARDIACO'),
(42, 'TRATAMIENTO RESPIRATORIO'),
(43, 'TRATAMIENTO DIGESTIVO'),
(44, 'TRATAMIENTO NEUROLOGICO'),
(45, 'TRATAMIENTO RENAL'),
(46, 'TRATAMIENTO HEPATICO'),
(47, 'TRATAMIENTO OCULAR'),
(48, 'TRATAMIENTO ORAL/DENTAL'),
(49, 'URGENCIA / EMERGENCIA'),
(50, 'OTROS'),
(51, 'Baño y corte');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `procedimiento`
--

CREATE TABLE `procedimiento` (
  `id_procedimiento` int(11) NOT NULL,
  `procedimiento` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `procedimiento`
--

INSERT INTO `procedimiento` (`id_procedimiento`, `procedimiento`, `descripcion`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 'Consulta general', 'Revisión general de la mascota', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(2, 'Aseo', 'Baño y aseo de la mascota', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(3, 'Corte de pelo', 'Corte y arreglo del pelaje', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(4, 'Desparasitación externa', 'Eliminación de parásitos externos', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(5, 'Desparasitación interna', 'Administración de antiparasitarios internos', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(6, 'Vacunación', 'Aplicación de vacunas obligatorias', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(7, 'Esterilización / castración', 'Procedimiento quirúrgico de esterilización', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(8, 'Cirugía menor', 'Procedimientos quirúrgicos sencillos', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(9, 'Cirugía mayor', 'Procedimientos quirúrgicos complejos', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(10, 'Limpieza dental', 'Profilaxis dental completa', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(11, 'Radiografía', 'Estudios radiográficos de la mascota', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(12, 'Ultrasonido', 'Estudios ecográficos de órganos', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(13, 'Laboratorio', 'Exámenes de sangre, orina o heces', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(14, 'Extracción de cuerpo extraño', 'Retiro de objetos ingeridos o alojados', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(15, 'Suturas / vendajes', 'Aplicación de suturas o vendajes', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(17, 'Tratamiento de heridas', 'Limpieza y cuidado de lesiones', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(18, 'Hospitalización', 'Cuidados intensivos durante ingreso hospitalario', 1, '2025-09-08 20:41:05', 1, '2025-09-08 20:41:05'),
(19, 'Baño y corte', 'doble acción aseo y corte de pelo', 3, '2025-10-20 17:10:39', NULL, '2025-10-20 17:10:39'),
(20, 'Hidratación-Lactato de Ringer', NULL, 3, '2025-11-14 10:07:20', NULL, '2025-11-14 10:07:20'),
(21, 'venta', NULL, 3, '2025-11-14 10:31:33', NULL, '2025-11-14 10:31:33'),
(22, 'Ecografía', 'examen para inspeccionar parte interna del animal', 3, '2025-11-14 10:35:09', NULL, '2025-11-14 10:35:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `raza`
--

CREATE TABLE `raza` (
  `id_raza` int(11) NOT NULL,
  `raza` varchar(100) NOT NULL,
  `id_especie` int(11) NOT NULL,
  `creater_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updater_id` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `raza`
--

INSERT INTO `raza` (`id_raza`, `raza`, `id_especie`, `creater_id`, `created_at`, `updater_id`, `updated_at`) VALUES
(1, 'Beagle', 1, 3, '2025-09-27 12:02:20', NULL, '2025-09-27 12:02:20'),
(3, 'Poodle', 1, 3, '2025-09-28 20:10:14', NULL, '2025-09-28 20:10:14'),
(4, 'Rex', 3, 3, '2025-09-28 20:10:40', NULL, '2025-09-28 20:10:40'),
(5, 'Mestizo', 1, 3, '2025-09-30 10:11:07', NULL, '2025-09-30 10:11:07'),
(6, 'Chihuahua', 1, 3, '2025-09-30 10:16:53', NULL, '2025-09-30 10:16:53'),
(8, 'Shitzu', 1, 3, '2025-10-06 12:34:47', 3, '2025-10-10 12:41:41'),
(9, 'Snauzer', 1, 3, '2025-10-06 12:37:07', NULL, '2025-10-06 12:37:07'),
(10, 'Persa', 2, 3, '2025-10-06 19:02:52', NULL, '2025-10-06 19:02:52'),
(11, 'American Bully', 1, 3, '2025-10-08 16:21:06', NULL, '2025-10-08 16:21:06'),
(12, 'Siberian Husky', 1, 3, '2025-10-08 17:04:47', NULL, '2025-10-08 17:04:47'),
(13, 'Yorkie', 1, 3, '2025-10-10 18:07:58', NULL, '2025-10-10 18:07:58'),
(14, 'Mestizo', 2, 3, '2025-10-14 16:56:14', NULL, '2025-10-14 16:56:14'),
(15, 'labrador', 1, 3, '2025-10-22 16:26:30', NULL, '2025-10-22 16:26:30'),
(16, 'sharpei', 1, 3, '2025-10-22 17:42:09', NULL, '2025-10-22 17:42:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('ARinVCAlko0Zvrzj7FFPFyt46iHtK3lqSMkqWSgy', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 OPR/124.0.0.0 (Edition std-2)', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoid1BLTGxlRXY3REVuYzZlcDlyR3IzYm5EWDZiQ01VMEtXRWdRQ2k1byI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo0MToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL21hc2NvdGEvZm9ybS9jcmVhdGUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1765300249),
('DkaPtWIflbStmsYzOlVJ80XLRK8VaVIyA2gOJnQa', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 OPR/124.0.0.0 (Edition std-2)', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiaFFmTDlBZDVSd0E0aXB4dDdwQ2RCQW9TbHd4STFRUk9PdUZGeUZGYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo1NDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2hpc3RvcmlhX2NsaW5pY2EvZm9ybS91cGRhdGUvMjEzIjt9fQ==', 1765152388),
('I3CpXgFiBWPtO3IyM9E4ToO2jDpWy4brJiqztHEc', 3, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 OPR/124.0.0.0 (Edition std-2)', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVFBlejFpOXhjTW9pSlBrdEwwNTRMdmJoYURKU0wzWE9JQ2pWVFp1diI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MztzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czoyOToiaHR0cDovLzEyNy4wLjAuMTo4MDAwL21hc2NvdGEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1765328121);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sexo`
--

CREATE TABLE `sexo` (
  `id_sexo` int(11) NOT NULL,
  `sexo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sexo`
--

INSERT INTO `sexo` (`id_sexo`, `sexo`) VALUES
(1, 'Macho'),
(2, 'Hembra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_tiempo`
--

CREATE TABLE `unidad_tiempo` (
  `id_unidad_tiempo` int(11) NOT NULL,
  `unidad_tiempo` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidad_tiempo`
--

INSERT INTO `unidad_tiempo` (`id_unidad_tiempo`, `unidad_tiempo`) VALUES
(1, 'MES'),
(2, 'AÑO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(3, 'Administrador', 'admin@gmail.com', NULL, '$2y$12$Q1nMBJbk8XHMb2L16lW0XuDarOpuGFuo29wbGTfMOPXBsycI24XzC', 'f1Wdi8H1xLaSDngj6IAaA5wa8VWMifUHdiVXsyg24Rw3kjBREywoVphJl2Ux', '2025-05-13 07:13:48', '2025-09-22 22:40:06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_mascota` (`id_mascota`),
  ADD KEY `id_motivo_cita` (`id_motivo_cita`),
  ADD KEY `id_estado_cita` (`id_estado_cita`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `database_history`
--
ALTER TABLE `database_history`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `especie`
--
ALTER TABLE `especie`
  ADD PRIMARY KEY (`id_especie`),
  ADD UNIQUE KEY `especie` (`especie`);

--
-- Indices de la tabla `estado_cita`
--
ALTER TABLE `estado_cita`
  ADD PRIMARY KEY (`id_estado_cita`);

--
-- Indices de la tabla `estado_historia_clinica`
--
ALTER TABLE `estado_historia_clinica`
  ADD PRIMARY KEY (`id_estado_historia_clinica`),
  ADD UNIQUE KEY `nombre_estado` (`estado_historia_clinica`);

--
-- Indices de la tabla `estado_mascota`
--
ALTER TABLE `estado_mascota`
  ADD PRIMARY KEY (`id_estado_mascota`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  ADD PRIMARY KEY (`id_historia_clinica`),
  ADD KEY `id_mascota` (`id_mascota`),
  ADD KEY `id_estado_historia_clinica` (`id_estado_historia_clinica`);

--
-- Indices de la tabla `historia_clinica_anamnesis`
--
ALTER TABLE `historia_clinica_anamnesis`
  ADD PRIMARY KEY (`id_historia_clinica_anamnesis`);

--
-- Indices de la tabla `historia_clinica_medicamento`
--
ALTER TABLE `historia_clinica_medicamento`
  ADD PRIMARY KEY (`id_historia_clinica_medicamento`);

--
-- Indices de la tabla `historia_clinica_procedimiento`
--
ALTER TABLE `historia_clinica_procedimiento`
  ADD PRIMARY KEY (`id_historia_clinica_procedimiento`);

--
-- Indices de la tabla `historia_clinica_seguimiento`
--
ALTER TABLE `historia_clinica_seguimiento`
  ADD PRIMARY KEY (`id_historia_clinica_seguimiento`),
  ADD KEY `historia_clinica_seguimiento_ibfk_1` (`id_historia_clinica`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_sexo` (`id_sexo`),
  ADD KEY `id_raza` (`id_raza`);

--
-- Indices de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD PRIMARY KEY (`id_medicamento`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `motivo_cita`
--
ALTER TABLE `motivo_cita`
  ADD PRIMARY KEY (`id_motivo_cita`);

--
-- Indices de la tabla `motivo_historia_clinica`
--
ALTER TABLE `motivo_historia_clinica`
  ADD PRIMARY KEY (`id_motivo_historia_clinica`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `procedimiento`
--
ALTER TABLE `procedimiento`
  ADD PRIMARY KEY (`id_procedimiento`);

--
-- Indices de la tabla `raza`
--
ALTER TABLE `raza`
  ADD PRIMARY KEY (`id_raza`),
  ADD KEY `fk_raza_especie` (`id_especie`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `sexo`
--
ALTER TABLE `sexo`
  ADD PRIMARY KEY (`id_sexo`);

--
-- Indices de la tabla `unidad_tiempo`
--
ALTER TABLE `unidad_tiempo`
  ADD PRIMARY KEY (`id_unidad_tiempo`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=445;

--
-- AUTO_INCREMENT de la tabla `database_history`
--
ALTER TABLE `database_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `especie`
--
ALTER TABLE `especie`
  MODIFY `id_especie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estado_cita`
--
ALTER TABLE `estado_cita`
  MODIFY `id_estado_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_historia_clinica`
--
ALTER TABLE `estado_historia_clinica`
  MODIFY `id_estado_historia_clinica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estado_mascota`
--
ALTER TABLE `estado_mascota`
  MODIFY `id_estado_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  MODIFY `id_historia_clinica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- AUTO_INCREMENT de la tabla `historia_clinica_anamnesis`
--
ALTER TABLE `historia_clinica_anamnesis`
  MODIFY `id_historia_clinica_anamnesis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `historia_clinica_medicamento`
--
ALTER TABLE `historia_clinica_medicamento`
  MODIFY `id_historia_clinica_medicamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT de la tabla `historia_clinica_procedimiento`
--
ALTER TABLE `historia_clinica_procedimiento`
  MODIFY `id_historia_clinica_procedimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT de la tabla `historia_clinica_seguimiento`
--
ALTER TABLE `historia_clinica_seguimiento`
  MODIFY `id_historia_clinica_seguimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `id_medicamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `motivo_cita`
--
ALTER TABLE `motivo_cita`
  MODIFY `id_motivo_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `motivo_historia_clinica`
--
ALTER TABLE `motivo_historia_clinica`
  MODIFY `id_motivo_historia_clinica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `procedimiento`
--
ALTER TABLE `procedimiento`
  MODIFY `id_procedimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `raza`
--
ALTER TABLE `raza`
  MODIFY `id_raza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `sexo`
--
ALTER TABLE `sexo`
  MODIFY `id_sexo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `unidad_tiempo`
--
ALTER TABLE `unidad_tiempo`
  MODIFY `id_unidad_tiempo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_estado_cita`) REFERENCES `estado_cita` (`id_estado_cita`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_motivo_cita`) REFERENCES `motivo_cita` (`id_motivo_cita`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`id_mascota`) REFERENCES `mascota` (`id_mascota`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `historia_clinica`
--
ALTER TABLE `historia_clinica`
  ADD CONSTRAINT `historia_clinica_ibfk_1` FOREIGN KEY (`id_mascota`) REFERENCES `mascota` (`id_mascota`),
  ADD CONSTRAINT `historia_clinica_ibfk_2` FOREIGN KEY (`id_estado_historia_clinica`) REFERENCES `estado_historia_clinica` (`id_estado_historia_clinica`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `historia_clinica_seguimiento`
--
ALTER TABLE `historia_clinica_seguimiento`
  ADD CONSTRAINT `historia_clinica_seguimiento_ibfk_1` FOREIGN KEY (`id_historia_clinica`) REFERENCES `historia_clinica` (`id_historia_clinica`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `mascota_ibfk_2` FOREIGN KEY (`id_sexo`) REFERENCES `sexo` (`id_sexo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mascota_ibfk_3` FOREIGN KEY (`id_raza`) REFERENCES `raza` (`id_raza`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mascota_ibfk_4` FOREIGN KEY (`id_unidad_tiempo`) REFERENCES `unidad_tiempo` (`id_unidad_tiempo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `raza`
--
ALTER TABLE `raza`
  ADD CONSTRAINT `fk_raza_especie` FOREIGN KEY (`id_especie`) REFERENCES `especie` (`id_especie`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
