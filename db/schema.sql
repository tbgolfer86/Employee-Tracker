DROP DATABASE IF EXISTS inventory_db;
-- Creates the "inventory_db" database --
CREATE DATABASE inventory_db;

-- Makes it so all of the following code will affect inventory_db --
USE inventory_db;

-- Creates the table "produce" within inventory_db --
CREATE TABLE produce (
  -- Creates a numeric column called "id"
  id INT NOT NULL,
  -- Makes a string column called "name"
  name VARCHAR(100) NOT NULL
);
