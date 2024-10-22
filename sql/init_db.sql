-- Creating the Users table with common attributes
CREATE TABLE Users (
    UserID VARCHAR(10) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Creating the Students table and linking to Users with a foreign key
CREATE TABLE Students (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Creating the Faculties table and linking to Users with a foreign key
CREATE TABLE Faculties (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Creating the Admins table and linking to Users with a foreign key
CREATE TABLE Admins (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO Users (UserID, FirstName, LastName, Email, Password)
VALUES ('A001', 'Alice', 'Smith', 'alice@example.com', 'password123'),
       ('F001', 'John', 'Doe', 'john.doe@example.com', 'password123'),
       ('S001', 'Jane', 'Doe', 'jane.doe@example.com', 'password123'),
       ('T001', 'Mike', 'Johnson', 'mike.j@example.com', 'password123');

INSERT INTO Admins (UserID)
VALUES ('A001');  -- Alice Smith is an Admin

INSERT INTO Faculties (UserID)
VALUES ('F001');  -- John Doe is a Faculty member

INSERT INTO Students (UserID)
VALUES ('S001');  -- Jane Doe is a Student