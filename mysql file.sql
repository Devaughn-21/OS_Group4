-- Fliphos Kesete DATABASE SETUP
-- DriveEasy Car Rental Web Application

DROP DATABASE IF EXISTS driveeasy;
CREATE DATABASE driveeasy;
USE driveeasy;

--  USERS TABLE
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    license_number VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT NOW()
);

--  CARS TABLE
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year YEAR NOT NULL,
    color VARCHAR(30),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    category ENUM('economy', 'standard', 'luxury', 'SUV') NOT NULL,
    daily_rate DECIMAL(8,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    mileage INT
);

--  RENTALS TABLE
CREATE TABLE rentals (
    rental_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT NOW(),

    CONSTRAINT fk_rentals_users
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_rentals_cars
        FOREIGN KEY (car_id) REFERENCES cars(car_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_rental_dates
        CHECK (end_date > start_date)
);

--  PAYMENTS TABLE
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    rental_id INT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT NOW(),
    method ENUM('credit_card', 'debit_card', 'cash') NOT NULL,
    status ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',

    CONSTRAINT fk_payments_rentals
        FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

USE driveeasy;

-- SAMPLE USERS
INSERT INTO users 
(first_name, last_name, email, phone, license_number)
VALUES
('John', 'Smith', 'john.smith@email.com', '519-111-2222', 'D1234567'),
('Sarah', 'Johnson', 'sarah.j@email.com', '519-333-4444', 'D7654321'),
('Michael', 'Brown', 'michael.b@email.com', '519-555-6666', 'D9988776');

-- SAMPLE CARS
INSERT INTO cars
(make, model, year, color, license_plate, category, daily_rate, is_available, mileage)
VALUES
('Toyota', 'Camry', 2023, 'White', 'ABC123', 'standard', 45.00, TRUE, 22000),
('Honda', 'Civic', 2022, 'Black', 'DEF456', 'economy', 38.00, TRUE, 31000),
('BMW', 'X5', 2024, 'Blue', 'GHI789', 'luxury', 120.00, TRUE, 12000),
('Ford', 'Escape', 2021, 'Gray', 'JKL321', 'SUV', 65.00, TRUE, 45000);

-- SAMPLE RENTALS
INSERT INTO rentals
(user_id, car_id, start_date, end_date, total_cost, status)
VALUES
(1, 1, '2026-06-10', '2026-06-15', 225.00, 'active'),
(2, 2, '2026-06-12', '2026-06-14', 76.00, 'pending'),
(3, 3, '2026-05-01', '2026-05-03', 240.00, 'completed');

-- SAMPLE PAYMENTS
INSERT INTO payments
(rental_id, amount, method, status)
VALUES
(1, 225.00, 'credit_card', 'completed'),
(2, 76.00, 'debit_card', 'pending'),
(3, 240.00, 'credit_card', 'completed');

-- Mark active rental car as unavailable
UPDATE cars
SET is_available = FALSE
WHERE car_id = 1;





-- Show all users
SELECT * FROM users;

-- Show all cars
SELECT * FROM cars;

-- Show only available cars
SELECT * FROM cars
WHERE is_available = TRUE;

-- Show all rentals with user and car details
SELECT 
    rentals.rental_id,
    users.first_name,
    users.last_name,
    cars.make,
    cars.model,
    rentals.start_date,
    rentals.end_date,
    rentals.total_cost,
    rentals.status
FROM rentals
JOIN users ON rentals.user_id = users.user_id
JOIN cars ON rentals.car_id = cars.car_id;

-- Show payment information with rental details
SELECT 
    payments.payment_id,
    rentals.rental_id,
    payments.amount,
    payments.method,
    payments.status,
    payments.payment_date
FROM payments
JOIN rentals ON payments.rental_id = rentals.rental_id;

-- Check cars by category
SELECT * FROM cars
WHERE category = 'SUV';

-- Revenue report
SELECT 
    SUM(amount) AS total_revenue
FROM payments
WHERE status = 'completed';

-- Rental count by status
SELECT 
    status,
    COUNT(*) AS total_rentals
FROM rentals
GROUP BY status;



