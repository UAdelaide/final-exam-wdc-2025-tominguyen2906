DROP DATABASE IF EXISTS DogWalkService;
CREATE DATABASE DogWalkService;
USE DogWalkService;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'walker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Dogs (
    dog_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE WalkRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dog_id INT NOT NULL,
    requested_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

-- Insert test users with simple passwords for testing
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'password123', 'owner'),
('bobwalker', 'bob@example.com', 'password123', 'walker'),
('carol123', 'carol@example.com', 'password123', 'owner'),
('davidowner', 'david@example.com', 'password123', 'owner'),
('evewalker', 'eve@example.com', 'password123', 'walker');

-- Insert test dogs
INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'davidowner'), 'Rocky', 'large');

-- Insert test walk requests
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-11 10:00:00', 60, 'Central Park', 'open');