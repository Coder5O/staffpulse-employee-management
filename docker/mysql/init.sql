-- StaffPulse MySQL initialization script
-- This runs automatically when the container first starts

CREATE DATABASE IF NOT EXISTS `staffpulse` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `staffpulse_test` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `staffpulse`.* TO 'staffpulse'@'%';
GRANT ALL PRIVILEGES ON `staffpulse_test`.* TO 'staffpulse'@'%';
FLUSH PRIVILEGES;
