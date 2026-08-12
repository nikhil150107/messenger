CREATE DATABASE IF NOT EXISTS messenger;
USE messenger;

-- Country table
CREATE TABLE country (
    country_id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL
);

-- State table
CREATE TABLE state (
    state_id INT AUTO_INCREMENT PRIMARY KEY,
    country_id INT NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country(country_id)
        ON DELETE CASCADE
);

-- City table
CREATE TABLE city (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    state_id INT NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (state_id) REFERENCES state(state_id)
        ON DELETE CASCADE
);

-- User table
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    country_id INT NOT NULL,
    state_id INT NOT NULL,
    city_id INT NOT NULL,
    mob_no VARCHAR(15) UNIQUE NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES country(country_id),
    FOREIGN KEY (state_id) REFERENCES state(state_id),
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);