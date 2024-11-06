SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Students, Faculties, Admins, TAs, Etextbooks, Chapters, Sections, ContentBlocks, Questions, Activities, Answers, Courses, ActiveCourses, Enrollments, CourseTAs;
SET foreign_key_checks = 1;

DROP PROCEDURE IF EXISTS DeleteSectionByFacultyOrTA;

CREATE TABLE Users (
    UserID VARCHAR(10) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Students (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Faculties (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE TAs (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Admins (
    UserID VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

 CREATE TABLE ETextbooks (
    ETextbookID VARCHAR(10) PRIMARY KEY,
    CreatedBy VARCHAR(10),
    Title VARCHAR(100) NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
 );

 CREATE TABLE Chapters (
    ChapterID VARCHAR(10),
    ETextbookID VARCHAR(10),
    Title VARCHAR(100) UNIQUE NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ETextbookID, ChapterID),
    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

  CREATE TABLE Sections (
    SectionID VARCHAR(10),
    ETextbookID VARCHAR(10),
    ChapterID VARCHAR(10),
    Title VARCHAR(100) UNIQUE NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID),
    FOREIGN KEY (ETextbookID, ChapterID) REFERENCES Chapters(ETextbookID, ChapterID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE ContentBlocks (
    BlockID VARCHAR(10),
    ETextbookID VARCHAR(10),
    ChapterID VARCHAR(10),
    SectionID VARCHAR(10),
    BlockType VARCHAR(8) NOT NULL CHECK (BlockType IN ('text', 'picture', 'activity')),
    Content TEXT NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID, BlockID),
    FOREIGN KEY (ETextbookID, ChapterID, SectionID) REFERENCES Sections(ETextbookID, ChapterID, SectionID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE Activities (
    ActivityID VARCHAR(10),
    ETextbookID VARCHAR(10),
    ChapterID VARCHAR(10),
    SectionID VARCHAR(10),
    BlockID VARCHAR(10),
    CreatedBy VARCHAR(10) NULL,
    IsHidden BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID),
    FOREIGN KEY (ETextbookID, ChapterID, SectionID, BlockID) REFERENCES ContentBlocks(ETextbookID, ChapterID, SectionID, BlockID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);


CREATE TABLE Questions (
    QuestionID VARCHAR(10),
    ETextbookID VARCHAR(10),
    ChapterID VARCHAR(10),
    SectionID VARCHAR(10),
    BlockID VARCHAR(10),
    ActivityID VARCHAR(10),
    QuestionText TEXT NOT NULL,
    Option1 TEXT NOT NULL,
    Option1Explanation TEXT,
    Option2 TEXT NOT NULL,
    Option2Explanation TEXT,
    Option3 TEXT NOT NULL,
    Option3Explanation TEXT,
    Option4 TEXT NOT NULL,
    Option4Explanation TEXT,
    AnswerIdx INT NOT NULL CHECK (AnswerIdx IN (1,2,3,4)),
    CreatedBy VARCHAR(10) NULL,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionID),
    FOREIGN KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID) REFERENCES Activities(ETextbookID, ChapterID, SectionID, BlockID, ActivityID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
CREATE TABLE StudentActivity (
    QuestionID VARCHAR(10),
    ETextbookID VARCHAR(10),
    ChapterID VARCHAR(10),
    SectionID VARCHAR(10),
    BlockID VARCHAR(10),
    ActivityID VARCHAR(10),
    StudentID VARCHAR(10),
    Points   INT NOT NULL CHECK(Points IN (0,1)) DEFAULT 0,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionID, StudentID),
    FOREIGN KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID) REFERENCES Activities(ETextbookID, ChapterID, SectionID, BlockID, ActivityID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (StudentID) REFERENCES Students(UserID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Courses (
    CourseID VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    FacultyID VARCHAR(10),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Type VARCHAR(10) CHECK (Type IN ('Active', 'Evaluation')),
    ETextbookID VARCHAR(10),

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

CREATE TABLE CourseTAs (
    CourseID VARCHAR(20),
    TAID VARCHAR(10),
    
    PRIMARY KEY (CourseID, TAID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (TAID) REFERENCES TAs(UserID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Enrollments (
    StudentID VARCHAR(10),
    CourseID VARCHAR(20),
    EnrollmentStatus ENUM('Pending', 'Enrolled'),
    PRIMARY KEY (StudentID, CourseID),

    FOREIGN KEY (StudentID) REFERENCES Students(UserID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES ActiveCourses(CourseID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Notifications (
    NotificationID INT AUTO_INCREMENT,
    StudentID VARCHAR(10),
    Msg TEXT,
    PRIMARY KEY (NotificationID),
    FOREIGN KEY (StudentID) REFERENCES Students(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Insert Faculty Users
INSERT INTO Users (UserID, FirstName, LastName, Email, Password) VALUES
('KeOg1024', 'Kemafor', 'Ogan', 'kogan@ncsu.edu', 'Ko2024!rpc'),
('JoDo1024', 'John', 'Doe', 'john.doe@example.com', 'Jd2024!abc'),
('SaMi1024', 'Sarah', 'Miller', 'sarah.miller@domain.com', 'Sm#Secure2024'),
('DaBr1024', 'David', 'Brown', 'david.b@webmail.com', 'DbPass123!'),
('EmDa1024', 'Emily', 'Davis', 'emily.davis@email.com', 'Emily#2024!'),
('MiWi1024', 'Michael', 'Wilson', 'michael.w@service.com', 'Mw987secure');

INSERT INTO Users (UserID, FirstName, LastName, Email, Password)
VALUES ('A001', 'Alice', 'Smith', 'alice@example.com', 'password123'),
       ('F001', 'John', 'Doe', 'john.doe@example.com', 'password123'),
       ('S001', 'Jane', 'Doe', 'jane.doe@example.com', 'password123'),
       ('S002', 'Ross', 'Geller', 'ross.geller@example.com', 'password123'),
       ('T001', 'Mike', 'Johnson', 'mike.j@example.com', 'password123');

INSERT INTO Admins (UserID)
VALUES ('A001');  -- Alice Smith is an Admin    

INSERT INTO Faculties (UserID)
VALUES ('F001');  -- John Doe is a Faculty member

INSERT INTO Students (UserID)
VALUES ('S001'), ("S002");  -- Jane Doe is a Student

-- INSERT INTO TAs (UserID)
-- VALUES ('T001');  -- Mike Johnson is a Student

-- Inserting into ETextbooks
INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title)
VALUES 
    ("101", 'A001', 'Database Management Systems'),
    ("102", 'A001', 'Fundamentals of Software Engineering'),
    ("103", 'A001', 'Fundamentals of Machine Learning');

-- Inserting into Courses

INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID)
VALUES 
    ('CS101', 'Database Systems', 'F001', '2024-01-10', '2024-05-15', 'Active', "101"),
    ('CS102', 'Software Engineering', 'F001', '2024-01-15', '2024-05-20', 'Active', "102"),
    ('CS103', 'Machine Learning', 'F001', '2024-02-01', '2024-06-01', 'Active', "103"),
    ('CS104', 'Machine Learning Foundations', 'F001', '2024-03-01', '2024-07-01', 'Evaluation', "103");

-- Inserting into ActiveCourses
INSERT INTO ActiveCourses (CourseID, Token, Capacity)
VALUES 
    ('CS101', 'A1B2C3D', 30),
    ('CS102', 'D4E5F6G', 25),
    ('CS103', 'H7I8J9K', 20);


INSERT INTO Enrollments (StudentID, CourseID, EnrollmentStatus)
VALUES 
    ('S001', 'CS101', 'Enrolled'),
    ('S001', 'CS102',  'Enrolled'),
    ('S002', 'CS101', 'Enrolled'),
    ('S002', 'CS102', 'Pending'),
    ('S001', 'CS103', 'Pending');

-- Inserting Chapters 
INSERT INTO Chapters (ETextbookID,ChapterID,Title,CreatedBy)
VALUES
('101',	'chap01',	'Introduction to Database', 'A001'),
('101',	'chap02',	'The Relational Model', 'A001'),
('102',	'chap01',	'Introduction to Software Engineering', 'A001'),
('102',	'chap02',	'Introduction to Software Development Life Cycle (SDLC)', 'A001'),
('103',	'chap01',	'Introduction to Machine Learning', 'A001');

-- Inserting Sections 
INSERT INTO Sections (ETextbookID, ChapterID, SectionID, Title ,CreatedBy)
VALUES
('101',	'chap01',	'Sec01',	'Database Management Systems (DBMS) Overview', 'A001'),
('101',	'chap01',	'Sec02',	'Data Models and Schemas', 'A001'),
('101',	'chap02',	'Sec01',	'Entities, Attributes, and Relationships', 'A001'),
('101',	'chap02',	'Sec02',	'Normalization and Integrity Constraints', 'A001'),
('102',	'chap01',	'Sec01',	'History and Evolution of Software Engineering', 'A001'),
('102',	'chap01',	'Sec02',	'Key Principles of Software Engineering', 'A001'),
('102',	'chap02',	'Sec01',	'Phases of the SDLC', 'A001'),
('102',	'chap02',	'Sec02',	'Agile vs. Waterfall Models', 'A001'),
('103',	'chap01',	'Sec01',	'Overview of Machine Learning', 'A001'),
('103',	'chap01',	'Sec02',	'Supervised vs Unsupervised Learning', 'A001');

-- Inserting Blocks 
INSERT INTO ContentBlocks (ETextbookID,ChapterID,SectionID,BlockID,BlockType,Content,CreatedBy)
VALUES
('101',	'chap01',	'Sec01',	'Block01',	'text',	'A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 'A001'),
('101',	'chap01',	'Sec01',	'Block02',	'text',	'Duplicated: A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 'A001'),
('101',	'chap01',	'Sec02',	'Block02',	'text',	'Duplicated: A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 'A001'),
('101',	'chap01',	'Sec02',	'Block01',	'activity',	'ACT0', 'A001'),
('101',	'chap02',	'Sec01',	'Block01',	'text',	'DBMS systems provide structured storage and ensure that data is accessible through queries using languages like SQL. They handle critical tasks such as maintaining data integrity, enforcing security protocols, and optimizing data retrieval, making them essential for both small-scale and enterprise-level applications. Examples of popular DBMS include MySQL, Oracle, and PostgreSQL.', 'A001'),
('101',	'chap02',	'Sec02',	'Block01',	'image',	'sample.png', 'A001'),
('102',	'chap01',	'Sec01',	'Block01',	'text',	'The history of software engineering dates back to the 1960s, when the "software crisis" highlighted the need for structured approaches to software development due to rising complexity and project failures. Over time, methodologies such as Waterfall, Agile, and DevOps evolved, transforming software engineering into a disciplined, iterative process that emphasizes efficiency, collaboration, and adaptability.', 'A001'),
('102',	'chap01',	'Sec02',	'Block01',	'activity',	'ACT0', 'A001'),
('102',	'chap02',	'Sec01',	'Block01',	'text',	'The Software Development Life Cycle (SDLC) consists of key phases including requirements gathering, design, development, testing, deployment, and maintenance. Each phase plays a crucial role in ensuring that software is built systematically, with feedback and revisions incorporated at each step to deliver a high-quality product.', 'A001'),
('102',	'chap02',	'Sec02',	'Block01',	'image',	'sample2.png', 'A001'),
('103',	'chap01',	'Sec01',	'Block01',	'text',	'Machine learning is a subset of artificial intelligence that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. By training algorithms on vast datasets, machine learning models can improve their accuracy over time, driving advancements in fields like healthcare, finance, and autonomous systems.', 'A001'),
('103',	'chap01',	'Sec02',	'Block01',	'activity',	'ACT0', 'A001');

INSERT INTO ContentBlocks (BlockID, ETextbookID, ChapterID, SectionID, BlockType, Content, CreatedBy) VALUES
('Block01', '101', 'chap01', 'Sec01', 'text', 'A Database Management System (DBMS) is software that enables users to efficiently create, manage, and manipulate databases. It serves as an interface between the database and end users, ensuring data is stored securely, retrieved accurately, and maintained consistently. Key features of a DBMS include data organization, transaction management, and support for multiple users accessing data concurrently.', 'KeOg1024'),
('Block01', '101', 'chap01', 'Sec02', 'activity', 'ACT0', 'JoDo1024'),
('Block01', '101', 'chap02', 'Sec01', 'text', 'DBMS systems provide structured storage and ensure that data is accessible through queries using languages like SQL. They handle critical tasks such as maintaining data integrity, enforcing security protocols, and optimizing data retrieval, making them essential for both small-scale and enterprise-level applications. Examples of popular DBMS include MySQL, Oracle, and PostgreSQL.', 'SaMi1024'),
('Block01', '101', 'chap02', 'Sec02', 'picture', 'sample.png', 'KeOg1024'),
('Block01', '102', 'chap01', 'Sec01', 'text', 'The history of software engineering dates back to the 1960s, when the "software crisis" highlighted the need for structured approaches to software development due to rising complexity and project failures. Over time, methodologies such as Waterfall, Agile, and DevOps evolved, transforming software engineering into a disciplined, iterative process that emphasizes efficiency, collaboration, and adaptability.', 'JoDo1024'),
('Block01', '102', 'chap01', 'Sec02', 'activity', 'ACT0', 'SaMi1024'),
('Block01', '102', 'chap02', 'Sec01', 'text', 'The Software Development Life Cycle (SDLC) consists of key phases including requirements gathering, design, development, testing, deployment, and maintenance. Each phase plays a crucial role in ensuring that software is built systematically, with feedback and revisions incorporated at each step to deliver a high-quality product.', 'KeOg1024'),
('Block01', '102', 'chap02', 'Sec02', 'picture', 'sample2.png', 'JoDo1024'),
('Block01', '103', 'chap01', 'Sec01', 'text', 'Machine learning is a subset of artificial intelligence that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. By training algorithms on vast datasets, machine learning models can improve their accuracy over time, driving advancements in fields like healthcare, finance, and autonomous systems.', 'Admn1024'), 
('Block01', '103', 'chap01', 'Sec02', 'activity', 'ACT0', 'SaMi1024');

INSERT INTO Activities (ActivityID, ETextbookID, ChapterID, SectionID, BlockID, CreatedBy) VALUES
('ACT0', '101', 'chap01', 'Sec02', 'Block01', 'JoDo1024'),
('ACT0', '102', 'chap01', 'Sec02', 'Block01', 'SaMi1024'),
('ACT0', '103', 'chap01', 'Sec02', 'Block01', 'Admn1024');

INSERT INTO Questions (QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionText, Option1, Option1Explanation, Option2, Option2Explanation, Option3, Option3Explanation, Option4, Option4Explanation, AnswerIdx, CreatedBy) VALUES
('Q1', '101', 'chap01', 'Sec02', 'Block01', 'ACT0', 'What does a DBMS provide?', 'Data storage only', 'Incorrect: DBMS provides more than just storage', 'Data storage and retrieval', 'Correct: DBMS manages both storing and retrieving data', 'Only security features', 'Incorrect: DBMS also handles other functions', 'Network management', 'Incorrect: DBMS does not manage network infrastructure', 2, 'JoDo1024'),
('Q2', '101', 'chap01', 'Sec02', 'Block01', 'ACT0', 'Which of these is an example of a DBMS?', 'Microsoft Excel', 'Incorrect: Excel is a spreadsheet application', 'MySQL', 'Correct: MySQL is a popular DBMS', 'Google Chrome', 'Incorrect: Chrome is a web browser', 'Windows 10', 'Incorrect: Windows is an operating system', 2, 'SaMi1024'),
('Q3', '101', 'chap01', 'Sec02', 'Block01', 'ACT0', 'What type of data does a DBMS manage?', 'Structured data', 'Correct: DBMS primarily manages structured data', 'Unstructured multimedia', 'Incorrect: While some DBMS systems can handle it, it''s not core', 'Network traffic data', 'Incorrect: DBMS doesn’t manage network data', 'Hardware usage statistics', 'Incorrect: DBMS does not handle hardware usage data', 1, 'DaBr1024'),
('Q1', '102', 'chap01', 'Sec02', 'Block01', 'ACT0', 'What was the "software crisis"?', 'A hardware shortage', 'Incorrect: The crisis was related to software development issues', 'Difficulty in software creation', 'Correct: The crisis was due to the complexity and unreliability of software', 'A network issue', 'Incorrect: It was not related to networking', 'Lack of storage devices', 'Incorrect: The crisis was not about physical storage limitations', 2, 'EmDa1024'),
('Q2', '102', 'chap01', 'Sec02', 'Block01', 'ACT0', 'Which methodology was first introduced in software engineering?', 'Waterfall model', 'Correct: Waterfall was the first formal software development model', 'Agile methodology', 'Incorrect: Agile was introduced much later', 'DevOps', 'Incorrect: DevOps is a more recent development approach', 'Scrum', 'Incorrect: Scrum is part of Agile, not the first methodology', 1, 'MiWi1024'),
('Q3', '102', 'chap01', 'Sec02', 'Block01', 'ACT0', 'What challenge did early software engineering face?', 'Lack of programming languages', 'Incorrect: Programming languages existed but were difficult to manage', 'Increasing complexity of software', 'Correct: Early engineers struggled with managing large, complex systems', 'Poor hardware development', 'Incorrect: The issue was primarily with software, not hardware', 'Internet connectivity issues', 'Incorrect: Internet connectivity wasn''t a challenge in early software', 2, 'KeOg1024'),
('Q1', '103', 'chap01', 'Sec02', 'Block01', 'ACT0', 'What is the primary goal of supervised learning?', 'Predict outcomes', 'Correct: The goal is to learn a mapping from inputs to outputs for prediction', 'Group similar data', 'Incorrect: This is more aligned with unsupervised learning', 'Discover patterns', 'Incorrect: This is not the main goal of supervised learning', 'Optimize cluster groups', 'Incorrect: This is not applicable to supervised learning', 1, 'JoDo1024'),
('Q2', '103', 'chap01', 'Sec02', 'Block01', 'ACT0', 'Which type of data is used in unsupervised learning?', 'Labeled data', 'Incorrect: Unsupervised learning uses unlabeled data', 'Unlabeled data', 'Correct: It analyzes data without pre-existing labels', 'Structured data', 'Incorrect: Unlabeled data can be structured or unstructured', 'Time-series data', 'Incorrect: Unsupervised learning does not specifically focus on time-series', 2, 'SaMi1024'),
('Q3', '103', 'chap01', 'Sec02', 'Block01', 'ACT0', 'In which scenario would you typically use supervised learning?', 'Customer segmentation', 'Incorrect: This is more relevant to unsupervised learning', 'Fraud detection', 'Correct: Supervised learning is ideal for predicting fraud based on labeled examples', 'Market basket analysis', 'Incorrect: This is generally done using unsupervised methods', 'Anomaly detection', 'Incorrect: While applicable, it is less common than fraud detection in supervised learning', 2, 'Admn1024');

INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID) VALUES
('NCSUOganCSC440F24', 'CSC440 Database Systems', 'KeOg1024', '2024-08-15', '2024-12-15', 'Active', '101'),
('NCSUOganCSC540F24', 'CSC540 Database Systems', 'KeOg1024', '2024-08-17', '2024-12-15', 'Active', '101'),
('NCSUSaraCSC326F24', 'CSC326 Software Engineering', 'SaMi1024', '2024-08-23', '2024-10-23', 'Active', '102'),
('NCSUDoeCSC522F24', 'CSC522 Fundamentals of Machine Learning', 'JoDo1024', '2025-08-25', '2025-12-18', 'Evaluation', '103'),
('NCSUSaraCSC326F25', 'CSC326 Software Engineering', 'SaMi1024', '2025-08-27', '2025-12-19', 'Evaluation', '102');

INSERT INTO ActiveCourses (CourseID, Token, Capacity) VALUES
('NCSUOganCSC440F24', 'XYJKLM', 60),
('NCSUOganCSC540F24', 'STUKZT', 50),
('NCSUSaraCSC326F24', 'LRUFND', 100);

INSERT INTO Enrollments (StudentID, CourseID, EnrollmentStatus) VALUES
('ErPe1024', 'NCSUOganCSC440F24', 'Enrolled'),
('ErPe1024', 'NCSUOganCSC540F24', 'Enrolled'),
('AlAr1024', 'NCSUOganCSC440F24',  'Enrolled'),
('BoTe1024', 'NCSUOganCSC440F24',  'Enrolled'),
('LiGa1024', 'NCSUOganCSC440F24',  'Enrolled'),
('LiGa1024', 'NCSUOganCSC540F24',  'Enrolled'),
('ArMo1024', 'NCSUOganCSC540F24',  'Enrolled'),
('ArMo1024', 'NCSUOganCSC440F24',  'Enrolled'),
-- ('SiHa1024', 'NCSUOganCSC440F24',  'Enrolled'),
('FiWi1024', 'NCSUSaraCSC326F24',  'Enrolled'),
-- ('LeMe1024', 'NCSUOganCSC440F24',  'Enrolled'),
('FiWi1024', 'NCSUOganCSC440F24',  'Pending'),
-- ('LeMe1024', 'NCSUOganCSC540F24',  'Pending'),
('AlAr1024', 'NCSUOganCSC540F24',  'Pending'),
-- ('SiHa1024', 'NCSUOganCSC540F24',  'Pending'),
('FiWi1024', 'NCSUOganCSC540F24', 'Pending');


INSERT INTO CourseTAs (CourseID, TAID) VALUES
('NCSUOganCSC440F24', 'JaWi1024'),
('NCSUOganCSC540F24', 'LiAl0924'),
('NCSUSaraCSC326F24', 'DaJo1024'),
('NCSUOganCSC440F24', 'ElCl1024'),
('NCSUOganCSC540F24', 'JeGi0924');




-- -- Insert Users
-- INSERT INTO Users (UserID, FirstName, LastName, Email, Password) VALUES
-- ('A001', 'John', 'Doe', 'john.doe@example.com', 'ab'),
-- ('A002', 'Jane', 'Smith', 'jane.smith@example.com', 'cd'),
-- ('A003', 'Emily', 'Johnson', 'emily.johnson@example.com', 'ef'),
-- ('A004', 'Michael', 'Brown', 'michael.brown@example.com', 'gh'),
-- ('A005', 'Linda', 'Williams', 'linda.williams@example.com', 'ij');

-- -- Insert Students
-- INSERT INTO Students (UserID) VALUES
-- ('A001'),
-- ('A002');

-- -- Insert Faculties
-- INSERT INTO Faculties (UserID) VALUES
-- ('A003');

-- -- Insert TAs
-- INSERT INTO TAs (UserID) VALUES
-- ('A004');

-- -- Insert Admins
-- INSERT INTO Admins (UserID) VALUES
-- ('A005');

-- -- Insert ETextbooks
-- INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title) VALUES
-- ('ET01', 'A005', 'Introduction to Programming'),
-- ('ET02', 'A005', 'Data Structures and Algorithms');

-- -- Insert Chapters
-- INSERT INTO Chapters (ChapterID, ETextbookID, Title, CreatedBy) VALUES
-- ('C01', 'ET01', 'Chapter 1: Basics of Programming', 'A003'),
-- ('C02', 'ET01', 'Chapter 2: Variables and Data Types', 'A003'),
-- ('C03', 'ET02', 'byAdmin', 'A005');

-- -- Insert Sections
-- INSERT INTO Sections (SectionID, ETextbookID, ChapterID, Title, CreatedBy) VALUES
-- ('S01', 'ET01', 'C01', 'Introduction', 'A003'),
-- ('S02', 'ET01', 'C02', 'Variables and Data Types', 'A003'),
-- ('S03', 'ET02', 'C03', 'Arrays and Linked Lists', 'A005');

-- -- Insert ContentBlocks
-- INSERT INTO ContentBlocks (BlockID, ETextbookID, ChapterID, SectionID, BlockType, Content, CreatedBy) VALUES
-- ('B01', 'ET01', 'C01', 'S01', 'text', 'This is the introduction to programming.', 'A003'),
-- ('B02', 'ET01', 'C02', 'S02', 'image', 'Image of variables and data types.', 'A003'),
-- ('B03', 'ET02', 'C03', 'S03', 'activity', 'Complete the exercise on arrays.', 'A005');

-- -- Insert Activities
-- INSERT INTO Activities (ActivityID, ETextbookID, ChapterID, SectionID, BlockID, CreatedBy) VALUES
-- ('A01', 'ET01', 'C01', 'S01', 'B01', 'A003'),
-- ('A02', 'ET01', 'C02', 'S02', 'B02', 'A003'),
-- ('A03', 'ET02', 'C03', 'S03', 'B03', 'A005');

-- -- Insert Questions
-- INSERT INTO Questions (QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionText, Option1, Option1Explanation, Option2, Option2Explanation, Option3, Option3Explanation, Option4, Option4Explanation, AnswerIdx, CreatedBy) VALUES
-- ('Q01', 'ET01', 'C01', 'S01', 'B01', 'A01', 'What is the first step in programming?', 'Define variables', 'Explanation for Option 1', 'Write code', 'Explanation for Option 2', 'Compile code', 'Explanation for Option 3', 'Execute code', 'Explanation for Option 4', 1, 'A003'),
-- ('Q02', 'ET01', 'C02', 'S02', 'B02', 'A02', 'What is a variable?', 'A container for data', 'Explanation for Option 1', 'A type of function', 'Explanation for Option 2', 'A block of code', 'Explanation for Option 3', 'A data type', 'Explanation for Option 4', 1, 'A003');

-- -- Insert Courses
-- INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID) VALUES
-- ('C001', 'Intro to Programming', 'A003', '2024-01-15', '2026-05-15', 'Active', 'ET02'),
-- ('C002', 'Data Structures', 'A003', '2024-02-01', '2024-06-01', 'Evaluation', 'ET01');

-- -- Insert ActiveCourses
-- INSERT INTO ActiveCourses (CourseID, Token, Capacity) VALUES
-- ('C001', 'ABC1234', 30);

-- -- Insert CourseTAs
-- INSERT INTO CourseTAs (CourseID, TAID) VALUES
-- ('C001', 'A004');

-- -- Insert Enrollments
-- INSERT INTO Enrollments (StudentID, CourseID, WaitlistNumber, EnrollmentStatus) VALUES
-- ('A001', 'C001', 1, 'Approved');

INSERT INTO Questions (ETextbookID,ChapterID,SectionID,BlockID,ActivityID,QuestionID,QuestionText,Option1,Option1Explanation,Option2,Option2Explanation,Option3,Option3Explanation,Option4,Option4Explanation,AnswerIdx,CreatedBy)
VALUES('101',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q1',	'What does a DBMS provide?',	'Data storage only',	'Incorrect: DBMS provides more than just storage',	'Data storage and retrieval',	'Correct: DBMS manages both storing and retrieving data',	'Only security features',	'Incorrect: DBMS also handles other functions',	'Network management',	'Incorrect: DBMS does not manage network infrastructure',	2, 'A001'),
('101',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q2',	'Which of these is an example of a DBMS?',	'Microsoft Excel',	'Incorrect: Excel is a spreadsheet application',	'MySQL',	'Correct: MySQL is a popular DBMS',	'Google Chrome',	'Incorrect: Chrome is a web browser',	'Windows 10',	'Incorrect: Windows is an operating system',	2, 'A001'),
('101',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q3',	'What type of data does a DBMS manage?',	'Structured data',	'Correct: DBMS primarily manages structured data',	'Unstructured multimedia',	'Incorrect: While some DBMS systems can handle it, its not core',	'Network traffic data',	'Incorrect: DBMS doesnt manage network data',	'Hardware usage statistics',	'Incorrect: DBMS does not handle hardware usage data',	1, 'A001'),
('102',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q1',	'What was the "software crisis"?',	'A hardware shortage',	'Incorrect: The crisis was related to software development issues',	'Difficulty in software creation',	'Correct: The crisis was due to the complexity and unreliability of software',	'A network issue',	'Incorrect: It was not related to networking',	'Lack of storage devices',	'Incorrect: The crisis was not about physical storage limitations',	2, 'A001'),
('102',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q2',	'Which methodology was first introduced in software engineering?',	'Waterfall model',	'Correct: Waterfall was the first formal software development model',	'Agile methodology',	'Incorrect: Agile was introduced much later',	'DevOps',	'Incorrect: DevOps is a more recent development approach',	'Scrum',	'Incorrect: Scrum is a part of Agile, not the first methodology',	1, 'A001'),
('102',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q3',	'What challenge did early software engineering face?',	'Lack of programming languages',	'Incorrect: Programming languages existed but were difficult to manage',	'Increasing complexity of software',	'Correct: Early engineers struggled with managing large, complex systems',	'Poor hardware development',	'Incorrect: The issue was primarily with software, not hardware',	'Internet connectivity issues',	'Incorrect: Internet connectivity wasnt a challenge in early software',	2, 'A001'),
('103',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q1',	'What is the primary goal of supervised learning?',	'Predict outcomes',	'Correct: The goal is to learn a mapping from inputs to outputs for prediction.',	'Group similar data',	'Incorrect: This is more aligned with unsupervised learning.',	'Discover patterns',	'Incorrect: This is not the main goal of supervised learning.',	'Optimize cluster groups',	'Incorrect: This is not applicable to supervised learning.',	1, 'A001'),
('103',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q2',	'Which type of data is used in unsupervised learning?',	'Labeled data',	'Incorrect: Unsupervised learning uses unlabeled data.',	'Unlabeled data',	'Correct: It analyzes data without pre-existing labels.',	'Structured data',	'Incorrect: Unlabeled data can be structured or unstructured.',	'Time-series data',	'Incorrect: Unsupervised learning does not specifically focus on time-series.',	2, 'A001'),
('103',	'chap01',	'Sec02',	'Block01',	'ACT0',	'Q3',	'In which scenario would you typically use supervised learning?',	'Customer segmentation',	'Incorrect: This is more relevant to unsupervised learning.',	'Fraud detection',	'Correct: Supervised learning is ideal for predicting fraud based on labeled examples.',	'Market basket analysis',	'Incorrect: This is generally done using unsupervised methods.',	'Anomaly detection',	'Incorrect: While applicable, it is less common than fraud detection in supervised learning.',	2, 'A001');
