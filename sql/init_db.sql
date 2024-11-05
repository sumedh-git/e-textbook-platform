SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Students, Faculties, Admins, TAs, Etextbooks, Chapters, Sections, ContentBlocks, Questions, Activities, Answers, Courses, ActiveCourses, Enrollments, CourseTAs;
SET foreign_key_checks = 1;

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
    BlockType VARCHAR(8) CHECK (BlockType IN ('text', 'image', 'activity')) NOT NULL,
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
    AnswerIdx INT NOT NULL,
    CreatedBy VARCHAR(10) NULL,
    PRIMARY KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionID),
    FOREIGN KEY (ETextbookID, ChapterID, SectionID, BlockID, ActivityID) REFERENCES Activities(ETextbookID, ChapterID, SectionID, BlockID, ActivityID)
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
    WaitlistNumber INT,
    EnrollmentStatus ENUM('Pending', 'Approved', 'Denied'),
    PRIMARY KEY (StudentID, CourseID),

    FOREIGN KEY (StudentID) REFERENCES Students(UserID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES ActiveCourses(CourseID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- CREATE Statements done
INSERT INTO Users (UserID, FirstName, LastName, Email, Password) VALUES
('U0001', 'Alice', 'Smith', 'alice@example.com', 'password123'),
('U0002', 'Bob', 'Johnson', 'bob@example.com', 'password123'),
('U0003', 'Charlie', 'Lee', 'charlie@example.com', 'password123'),
('U0004', 'Dana', 'Brown', 'dana@example.com', 'password123'),
('U0005', 'Eve', 'Miller', 'eve@example.com', 'password123');

INSERT INTO Students (UserID) VALUES ('U0001');
INSERT INTO Faculties (UserID) VALUES ('U0002');
INSERT INTO TAs (UserID) VALUES ('U0003');
INSERT INTO Admins (UserID) VALUES ('U0004');

INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title) VALUES
('ETB001', 'U0002', 'Introduction to Databases'),
('ETB002', 'U0002', 'Advanced Algorithms');

INSERT INTO Chapters (ChapterID, ETextbookID, Title, CreatedBy) VALUES
('CH001', 'ETB001', 'Database Fundamentals', 'U0002'),
('CH002', 'ETB001', 'SQL Basics', 'U0002'),
('CH003', 'ETB002', 'Graph Algorithms', 'U0002');

INSERT INTO Sections (SectionID, ETextbookID, ChapterID, Title, CreatedBy) VALUES
('SEC001', 'ETB001', 'CH001', 'Introduction to Databases', 'U0002'),
('SEC002', 'ETB001', 'CH001', 'Relational Models', 'U0002'),
('SEC003', 'ETB002', 'CH003', 'Shortest Path', 'U0002');

INSERT INTO ContentBlocks (BlockID, ETextbookID, ChapterID, SectionID, BlockType, Content, CreatedBy) VALUES
('B001', 'ETB001', 'CH001', 'SEC001', 'text', 'This section covers database basics.', 'U0002'),
('B002', 'ETB001', 'CH001', 'SEC002', 'text', 'Relational models explained.', 'U0002'),
('B003', 'ETB002', 'CH003', 'SEC003', 'text', 'The shortest path algorithms are critical in graphs.', 'U0002');

INSERT INTO Activities (ActivityID, ETextbookID, ChapterID, SectionID, BlockID, CreatedBy) VALUES
('A001', 'ETB001', 'CH001', 'SEC001', 'B001', 'U0002');

INSERT INTO Questions (QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionText, Option1, Option2, Option3, Option4, AnswerIdx, CreatedBy) VALUES
('Q001', 'ETB001', 'CH001', 'SEC001', 'B001', 'A001', 'What is a database?', 'A collection of data', 'A programming language', 'A type of software', 'An algorithm', 1, 'U0002');

INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID) VALUES
('C001', 'Intro to Computer Science', 'U0002', '2024-09-01', '2024-12-15', 'Active', 'ETB001'),
('C002', 'Advanced Databases', 'U0002', '2024-09-01', '2024-12-15', 'Evaluation', 'ETB002');

INSERT INTO ActiveCourses (CourseID, Token, Capacity) VALUES
('C001', 'ABC1234', 100);

INSERT INTO CourseTAs (CourseID, TAID) VALUES
('C001', 'U0003');

INSERT INTO Enrollments (StudentID, CourseID, WaitlistNumber, EnrollmentStatus) VALUES
('U0001', 'C001', 1, 'Approved');