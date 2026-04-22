-- Database initialization script
CREATE DATABASE IF NOT EXISTS `cafe-stock`;
USE `cafe-stock`;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    designation VARCHAR(255) NOT NULL,
    type ENUM('materiel', 'cafe') NOT NULL,
    unite ENUM('unité', 'kg') NOT NULL,
    prix_unitaire_ttc DECIMAL(12, 2) NOT NULL,
    quantite_stock DECIMAL(12, 2) NOT NULL DEFAULT 0,
    seuil_alerte DECIMAL(12, 2) NOT NULL DEFAULT 5
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    ice VARCHAR(100) NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sales (Factures) table
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_facture VARCHAR(100) NOT NULL,
    client_id INT NOT NULL,
    type_vente ENUM('materiel', 'cafe') NOT NULL,
    date_facture DATE NOT NULL,
    mode_paiement ENUM('ESPECE', 'CHEQUE', 'VIREMENT') NOT NULL,
    mode_livraison VARCHAR(255),
    note TEXT,
    total_ttc DECIMAL(12, 2) NOT NULL,
    total_ht DECIMAL(12, 2) NOT NULL,
    total_tva DECIMAL(12, 2) NOT NULL,
    status ENUM('DRAFT', 'VALIDATED') NOT NULL DEFAULT 'DRAFT',
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Sale items table
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    designation VARCHAR(255) NOT NULL,
    quantite DECIMAL(12, 2) NOT NULL,
    prix_unitaire_ttc DECIMAL(12, 2) NOT NULL,
    total_ttc DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    type ENUM('ENTREE', 'SORTIE') NOT NULL,
    quantite DECIMAL(12, 2) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    reference VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Default admin user: admin / admin123
-- Password 'admin123' hashed with bcrypt cost 10
INSERT IGNORE INTO users (username, password) 
VALUES ('admin', '$2b$10$785/1XyXfF9V6yP0VqF2i.wD1U9W8D.b9d1kS7Vl5Q5y4qT2j3e1y');
