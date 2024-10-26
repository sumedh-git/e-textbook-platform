SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Students, Faculties, Admins, Etextbooks, Chapters, Sections, ContentBlocks, Courses, ActiveCourses;
SET foreign_key_checks = 1;

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

 CREATE TABLE ETextbooks (
    ETextbookID INT PRIMARY KEY,
    CreatedBy VARCHAR(10),
    Title VARCHAR(100) NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
 );

 CREATE TABLE Chapters (
    ChapterID INT AUTO_INCREMENT PRIMARY KEY,
    ETextbookID INT,
    ChapterNumber VARCHAR(10) NOT NULL,
    Title VARCHAR(100) UNIQUE NOT NULL,
    CreatedBy VARCHAR(10),
    UNIQUE (ETextbookID, ChapterNumber),
    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

  CREATE TABLE Sections (
    SectionID INT AUTO_INCREMENT PRIMARY KEY,
    ChapterID INT,
    SectionNumber VARCHAR(10) NOT NULL,
    Title VARCHAR(100) UNIQUE NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    UNIQUE (ChapterID, SectionNumber),
    FOREIGN KEY (ChapterID) REFERENCES Chapters(ChapterID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE ContentBlocks (
    BlockID INT AUTO_INCREMENT PRIMARY KEY,
    SectionID INT,
    BlockName CHAR(7),
    BlockType VARCHAR(8) CHECK (BlockType IN ('Text', 'Image', "Activity")) NOT NULL,
    Content TEXT NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    UNIQUE (SectionID, BlockID),
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE Courses (
    CourseID VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    FacultyID VARCHAR(10),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Type VARCHAR(10) CHECK (Type IN ('Active', 'Evaluation')),
    ETextbookID INT,

    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
    FOREIGN KEY (FacultyID) REFERENCES Faculties(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE ActiveCourses (
    CourseID VARCHAR(20) PRIMARY KEY,
    Token VARCHAR(7) UNIQUE NOT NULL,
    Capacity INT NOT NULL,

    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- CREATE Statements done

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


-- Inserting into ETextbooks
INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title)
VALUES 
    (101, 'A001', 'Database Management Systems'),
    (102, 'A001', 'Fundamentals of Software Engineering'),
    (103, 'A001', 'Fundamentals of Machine Learning');

-- Inserting into Chapters
INSERT INTO Chapters (ETextbookID, ChapterNumber, Title, CreatedBy)
VALUES 
    (101, 'chap01', 'Introduction to Database', 'A001'),
    (101, 'chap02', 'The Relational Model', 'A001'),
    (102, 'chap01', 'Introduction to Software Engineering', 'A001'),
    (102, 'chap02', 'Introduction to Software Development Life Cycle (SDLC)', 'A001'),
    (103, 'chap01', 'Introduction to Machine Learning', 'A001');

-- Inserting into Sections
INSERT INTO Sections (ChapterID, SectionNumber, Title, CreatedBy, IsHidden)
VALUES 
    (1, 'Sec01', 'Database Management Systems (DBMS) Overview', 'A001', FALSE),
    (1, 'Sec02', 'Data Models and Schemas', 'A001', FALSE),
    (2, 'Sec01', 'Entities, Attributes, and Relationships', 'A001', FALSE),
    (2, 'Sec02', 'Normalization and Integrity Constraints', 'A001', FALSE),
    (3, 'Sec01', 'History and Evolution of Software Engineering', 'A001', FALSE),
    (3, 'Sec02', 'Key Principles of Software Engineering', 'A001', FALSE),
    (4, 'Sec01', 'Phases of the SDLC', 'A001', TRUE),
    (4, 'Sec02', 'Agile vs. Waterfall Models', 'A001', FALSE),
    (5, 'Sec01', 'Overview of Machine Learning', 'A001', TRUE),
    (5, 'Sec02', 'Supervised vs Unsupervised Learning', 'A001', FALSE);

-- Inserting into ContentBlocks
INSERT INTO ContentBlocks (SectionID, BlockName, BlockType, Content, CreatedBy, IsHidden)
VALUES 
    (1, "Block01", 'Text', 'A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 'A001', FALSE),
    (2, "Block01", 'Activity', 'ACT0', 'A001', FALSE),
    (3, "Block01", 'Text', 'DBMS systems provide structured storage and ensure that data is accessible through queries using languages like SQL. They handle critical tasks such as maintaining data integrity, enforcing security protocols, and optimizing data retrieval, making them essential for both small-scale and enterprise-level applications. Examples of popular DBMS include MySQL, Oracle, and PostgreSQL.', 'A001', FALSE),
    (4, "Block01", 'Image', 'sample.png', 'A001', FALSE),
    (5, "Block01", 'Text', 'The history of software engineering dates back to the 1960s, when the "software crisis" highlighted the need for structured approaches to software development due to rising complexity and project failures. Over time, methodologies such as Waterfall, Agile, and DevOps evolved, transforming software engineering into a disciplined, iterative process that emphasizes efficiency, collaboration, and adaptability.', 'A001', FALSE),
    (6, "Block01", 'Activity', 'ACT0', 'A001', FALSE),
    (7, "Block01", 'Text', 'The Software Development Life Cycle (SDLC) consists of key phases including requirements gathering, design, development, testing, deployment, and maintenance. Each phase plays a crucial role in ensuring that software is built systematically, with feedback and revisions incorporated at each step to deliver a high-quality product.', 'A001', FALSE),
    (8, "Block01", 'Image', 'sample2.png', 'A001', FALSE),
    (9, "Block01", 'Text', 'Machine learning is a subset of artificial intelligence that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. By training algorithms on vast datasets, machine learning models can improve their accuracy over time, driving advancements in fields like healthcare, finance, and autonomous systems.', 'A001', FALSE),
    (10, "Block01", 'Activity', 'ACT0', 'A001', FALSE);

-- Inserting into Courses
INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID)
VALUES 
    ('CS101', 'Database Systems', 'F001', '2024-01-10', '2024-05-15', 'Active', 101),
    ('CS102', 'Software Engineering', 'F001', '2024-01-15', '2024-05-20', 'Active', 102),
    ('CS103', 'Machine Learning', 'F001', '2024-02-01', '2024-06-01', 'Active', 103);

-- Inserting into ActiveCourses
INSERT INTO ActiveCourses (CourseID, Token, Capacity)
VALUES 
    ('CS101', 'A1B2C3D', 30),
    ('CS102', 'D4E5F6G', 25),
    ('CS103', 'H7I8J9K', 20);
