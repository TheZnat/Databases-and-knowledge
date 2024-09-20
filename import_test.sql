-- Создание таблицы Individuals
CREATE TABLE Individuals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    passport_number VARCHAR(20) NOT NULL,
    inn VARCHAR(12) NOT NULL,
    snils VARCHAR(11),
    driver_license VARCHAR(20),
    additional_docs TEXT,
    notes TEXT
);

-- Создание таблицы Borrowers
CREATE TABLE Borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inn VARCHAR(12) NOT NULL,
    entity_type ENUM('individual', 'organization') NOT NULL,
    address VARCHAR(255),
    total_amount DECIMAL(15, 2),
    conditions TEXT,
    legal_notes TEXT,
    contract_list TEXT
);

-- Создание таблицы Loans
CREATE TABLE Loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    individual_id INT,
    borrower_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term INT NOT NULL, -- срок в месяцах
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(id) ON DELETE CASCADE
);

-- Создание таблицы Credits
CREATE TABLE Credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    individual_id INT,
    borrower_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    term INT NOT NULL, -- срок в месяцах
    interest_rate DECIMAL(5, 2) NOT NULL,
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(id) ON DELETE CASCADE
);

INSERT INTO Individuals (first_name, last_name, middle_name, passport_number, inn, snils, driver_license, additional_docs, notes)
VALUES 
('Ivan', 'Petrov', 'Sergeevich', '1234567890', '123456789012', '12345678901', 'AB1234567', 'none', 'Important client'),
('Alexey', 'Ivanov', 'Vladimirovich', '2345678901', '234567890123', '23456789012', 'CD2345678', 'none', 'Premium account'),
('Maria', 'Smirnova', 'Ivanovna', '3456789012', '345678901234', '34567890123', 'EF3456789', 'none', 'Good history'),
('Olga', 'Sidorova', 'Petrovna', '4567890123', '456789012345', '45678901234', 'GH4567890', 'none', 'Regular customer'),
('Sergey', 'Fedorov', 'Mikhailovich', '5678901234', '567890123456', '56789012345', 'IJ5678901', 'none', 'Corporate client'),
('Elena', 'Kuznetsova', 'Vladislavovna', '6789012345', '678901234567', '67890123456', 'KL6789012', 'none', 'Investor'),
('Nikolay', 'Kovalev', 'Pavlovich', '7890123456', '789012345678', '78901234567', 'MN7890123', 'none', 'Preferred client'),
('Irina', 'Mikhailova', 'Dmitrievna', '8901234567', '890123456789', '89012345678', 'OP8901234', 'none', 'Reliable client'),
('Dmitry', 'Nikolaev', 'Igorevich', '9012345678', '901234567890', '90123456789', 'QR9012345', 'none', 'Recently joined'),
('Anna', 'Popova', 'Sergeevna', '0123456789', '012345678901', '01234567890', 'ST0123456', 'none', 'Top investor');

INSERT INTO Individuals (first_name, last_name, middle_name, passport_number, inn, snils, driver_license, additional_docs, notes)
VALUES 
('Ivan', 'Petrov', 'Sergeevich', '1234567890', '123456789012', '12345678901', 'AB1234567', 'none', 'Important client'),
('Alexey', 'Ivanov', 'Vladimirovich', '2345678901', '234567890123', '23456789012', 'CD2345678', 'none', 'Premium account'),
('Maria', 'Smirnova', 'Ivanovna', '3456789012', '345678901234', '34567890123', 'EF3456789', 'none', 'Good history'),
('Olga', 'Sidorova', 'Petrovna', '4567890123', '456789012345', '45678901234', 'GH4567890', 'none', 'Regular customer'),
('Sergey', 'Fedorov', 'Mikhailovich', '5678901234', '567890123456', '56789012345', 'IJ5678901', 'none', 'Corporate client'),
('Elena', 'Kuznetsova', 'Vladislavovna', '6789012345', '678901234567', '67890123456', 'KL6789012', 'none', 'Investor'),
('Nikolay', 'Kovalev', 'Pavlovich', '7890123456', '789012345678', '78901234567', 'MN7890123', 'none', 'Preferred client'),
('Irina', 'Mikhailova', 'Dmitrievna', '8901234567', '890123456789', '89012345678', 'OP8901234', 'none', 'Reliable client'),
('Dmitry', 'Nikolaev', 'Igorevich', '9012345678', '901234567890', '90123456789', 'QR9012345', 'none', 'Recently joined'),
('Anna', 'Popova', 'Sergeevna', '0123456789', '012345678901', '01234567890', 'ST0123456', 'none', 'Top investor');

INSERT INTO Borrowers (inn, entity_type, address, total_amount, conditions, legal_notes, contract_list)
VALUES 
('123456789012', 'individual', '123 Main St', 1000000.00, 'Standard terms', 'No legal issues', 'Contract_001'),
('234567890123', 'individual', '456 Oak Ave', 500000.00, 'Flexible terms', 'Pending verification', 'Contract_002'),
('345678901234', 'organization', '789 Pine Rd', 2500000.00, 'Long-term credit', 'Under review', 'Contract_003'),
('456789012345', 'individual', '101 Elm St', 750000.00, 'Short-term loan', 'Cleared for approval', 'Contract_004'),
('567890123456', 'organization', '202 Birch Blvd', 3000000.00, 'Corporate loan', 'Pending clearance', 'Contract_005');

INSERT INTO Loans (individual_id, borrower_id, amount, interest_rate, term, conditions, notes)
VALUES 
(1, 1, 100000.00, 5.00, 12, 'Standard loan', 'Good credit history'),
(2, 2, 200000.00, 4.50, 24, 'Flexible payment terms', 'Approved'),
(3, 3, 500000.00, 6.00, 36, 'Corporate loan', 'Pending'),
(4, 4, 150000.00, 5.50, 12, 'Urgent loan', 'High risk'),
(5, 5, 1000000.00, 4.00, 48, 'Investment loan', 'Top priority');

INSERT INTO Credits (organization_id, individual_id, borrower_id, amount, term, interest_rate, conditions, notes)
VALUES 
(1, 2, 1, 500000.00, 36, 5.50, 'Corporate credit', 'Approved for expansion'),
(2, 3, 2, 300000.00, 24, 6.00, 'Short-term credit', 'Under review'),
(3, 4, 3, 1000000.00, 60, 4.75, 'Long-term credit', 'High value client'),
(4, 5, 4, 2000000.00, 48, 5.00, 'Corporate investment', 'Approved for large-scale project'),
(5, 6, 5, 1500000.00, 36, 4.50, 'Expansion credit', 'Cleared for funding');

