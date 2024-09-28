-- Создание таблицы Sector
CREATE TABLE Sector (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    coordinates VARCHAR(100) NOT NULL,         
    light_intensity FLOAT NOT NULL,           
    foreign_objects VARCHAR(255),              
    star_objects_count INT NOT NULL,           
    undefined_objects_count INT NOT NULL,     
    identified_objects_count INT NOT NULL,        
    notes TEXT,                              
    date_update DATETIME DEFAULT NULL          
);

-- Создание таблицы Objects 
CREATE TABLE Objects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100),
    accuracy DECIMAL(5, 2),
    quantity INT,
    time TIME,
    date DATE,
    notes TEXT
);

-- Создание таблицы NaturalObjects
CREATE TABLE NaturalObjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100),
    galaxy VARCHAR(255),
    accuracy DECIMAL(5, 2),
    light_flow DECIMAL(10, 2),
    related_objects TEXT,
    notes TEXT
);

-- Создание таблицы Position
CREATE TABLE Position (
    id INT PRIMARY KEY AUTO_INCREMENT,
    earth_position VARCHAR(255),
    sun_position VARCHAR(255),
    moon_position VARCHAR(255)
);

-- Создание таблицы LinkTable
CREATE TABLE LinkTable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sector_id INT,
    object_id INT,
    natural_object_id INT,
    position_id INT,
    FOREIGN KEY (sector_id) REFERENCES Sector(id),
    FOREIGN KEY (object_id) REFERENCES Objects(id),
    FOREIGN KEY (natural_object_id) REFERENCES NaturalObjects(id),
    FOREIGN KEY (position_id) REFERENCES `Position`(id)
);


-- Процедура для добавления столбца date_update, если его нет:
DELIMITER //

CREATE PROCEDURE ensure_date_update_exists()
BEGIN
    DECLARE column_exists INT DEFAULT 0;

    -- Проверка наличия столбца 'date_update' в таблице 'Sector'
    SELECT COUNT(*)
    INTO column_exists
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = 'Sector'
    AND column_name = 'date_update';

    -- Если столбца нет, добавляем его
    IF column_exists = 0 THEN
        ALTER TABLE Sector ADD COLUMN date_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END //

DELIMITER ;

--- Создание триггера для обновления date_update:
CREATE TRIGGER update_sector_date
AFTER UPDATE ON Sector
FOR EACH ROW
BEGIN
    -- Проверяем, существует ли столбец date_update, и добавляем его, если необходимо
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS 
        WHERE TABLE_NAME = 'Sector' AND COLUMN_NAME = 'date_update'
    ) THEN
        -- Добавляем столбец date_update, если он не существует
        ALTER TABLE Sector ADD date_update DATETIME;
    END IF;

    -- Обновляем столбец date_update текущей датой и временем
    SET NEW.date_update = NOW();
END;

--- Создание триггера для обновления date_update

DELIMITER //

CREATE TRIGGER update_date_update
BEFORE UPDATE ON Sector
FOR EACH ROW
BEGIN
    SET NEW.date_update = NOW();
END //

DELIMITER ;


--- Создание процедуры для объединения двух таблиц с помощью JOIN
DELIMITER //

CREATE PROCEDURE join_tables(IN table1_name VARCHAR(255), IN table2_name VARCHAR(255))
BEGIN
    -- Динамический SQL для выполнения JOIN
    SET @sql = CONCAT('SELECT * FROM ', table1_name, ' t1 INNER JOIN ', table2_name, ' t2 ON t1.id = t2.id');
    
    -- Выполняем динамический SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;


--- Заполнение таблицы тестовыми данными 

--- Заполнение таблицы Sector 
INSERT INTO Sector (coordinates, light_intensity, foreign_objects, star_objects_count, undefined_objects_count, identified_objects_count, notes)
VALUES 
('12.34, 56.78', 250.75, 'None', 15, 5, 10, 'Sector A observation'),
('45.67, 89.01', 300.12, 'Space debris', 20, 2, 18, 'Sector B observation'),
('23.45, 67.89', 180.50, 'Satellite', 10, 1, 9, 'Sector C observation'),
('34.56, 78.90', 500.00, 'Meteor', 25, 3, 22, 'Sector D observation'),
('98.76, 54.32', 320.45, 'Unknown object', 8, 6, 2, 'Sector E observation');

-- Заполнение таблицы Objects 
INSERT INTO Objects (type, accuracy, quantity, time, date, notes)
VALUES 
('Star', 0.98, 10, '22:15:00', '2024-09-18', 'Observed multiple stars'),
('Planet', 0.95, 1, '03:45:00', '2024-09-17', 'Single planet sighting'),
('Comet', 0.80, 1, '14:30:00', '2024-09-16', 'Comet moving fast'),
('Asteroid', 0.75, 3, '07:20:00', '2024-09-15', 'Asteroids detected'),
('Satellite', 0.92, 2, '19:50:00', '2024-09-14', 'Satellites in orbit');


-- Заполнение таблицы NaturalObjects 
INSERT INTO NaturalObjects (type, galaxy, accuracy, light_flow, related_objects, notes)
VALUES 
('Galaxy', 'Milky Way', 0.99, 1000.50, 'None', 'Milky Way galaxy observed'),
('Star', 'Andromeda', 0.96, 850.30, 'Planet A', 'Star with attached planet'),
('Planet', 'Milky Way', 0.94, 300.75, 'None', 'Large planet observed'),
('Nebula', 'Orion', 0.85, 500.60, 'Star B', 'Nebula with associated star'),
('Black Hole', 'Sagittarius A*', 0.90, 1500.25, 'None', 'Black hole at center of galaxy');


-- Заполнение таблицы Position
INSERT INTO Position (earth_position, sun_position, moon_position)
VALUES 
('12.34, 56.78', '23.45, 67.89', '98.76, 54.32'),
('22.11, 34.56', '12.34, 78.90', '67.89, 12.34'),
('45.67, 89.01', '34.56, 23.45', '23.45, 67.89'),
('56.78, 90.12', '45.67, 12.34', '12.34, 45.67'),
('78.90, 23.45', '56.78, 34.56', '34.56, 78.90');


-- Заполнение таблицы LinkTable
INSERT INTO LinkTable (sector_id, object_id, natural_object_id, position_id)
VALUES 
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);
