-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 29 Gru 2021, 21:44
-- Wersja serwera: 10.4.22-MariaDB
-- Wersja PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `employee_management`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `employee`
--

INSERT INTO `employee` (`id`, `name`, `password`, `firstname`, `lastname`, `birthdate`, `group_id`) VALUES
(1, 'wld19', '$2y$10$PTUeMudIYAbFaWX0MtAG6eeEMQlVGskrI5M4xvGuXoxtj1deP2K3W', 'Władysław', 'Gruszka', '2021-12-24', 5),
(3, 'kamreo22', '$2y$10$DrjOkRJDpSyF2mdXcRfbS.IxQJSZWn8ly5N03HNv4ALn.tx5qFb3.', 'Kamil', 'Jeleń', '2021-12-09', 6),
(5, 'filippo', '$2y$10$6nHLmeP.QL929TbPkbCSZuSpVzSHQevmtalTFCtMoF1IJZIs0teIS', 'Filip', 'Grzyb', '2021-12-10', 5),
(6, 'seba12', '$2y$10$C50vL.DkS3KmsK1cutFROeieu.XVkDD/YywHcbZyyb6G4k5NlZeb6', 'Sebastian', 'Grzyb', '2021-12-23', 2),
(7, 'marcin22', '$2y$10$uIDxIZnj2BEiD2Le6hSNte38AuqXVv0M2p6jJ3y8dyIdTVkzCDtN.', 'Marcin', 'Srebro', '2021-12-25', 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `groups`
--

INSERT INTO `groups` (`id`, `name`) VALUES
(2, 'grupa 4'),
(3, 'grupa 3'),
(4, 'grupa 2'),
(5, 'grupa 1'),
(6, 'grupa 8'),
(7, 'grupa 7'),
(8, 'grupa 6'),
(9, 'grupa 5');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indeksy dla tabeli `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT dla tabeli `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
