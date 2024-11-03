SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Students, Faculties, Admins, TAs, Etextbooks, Chapters, Sections, ContentBlocks, Questions, Activities, Answers, Courses, ActiveCourses, Enrollments;
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
    TAID VARCHAR(10),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Type VARCHAR(10) CHECK (Type IN ('Active', 'Evaluation')),
    ETextbookID VARCHAR(10),

    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
    FOREIGN KEY (FacultyID) REFERENCES Faculties(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
    FOREIGN KEY (TAID) REFERENCES TAs(UserID)
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

-- CREATE Statements done

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

INSERT INTO TAs (UserID)
VALUES ('T001');  -- Mike Johnson is a Student

-- Inserting into ETextbooks
INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title)
VALUES 
    ("101", 'A001', 'Database Management Systems'),
    ("102", 'A001', 'Fundamentals of Software Engineering'),
    ("103", 'A001', 'Fundamentals of Machine Learning');

-- Inserting into Courses

INSERT INTO Courses (CourseID, Title, FacultyID, TAID, StartDate, EndDate, Type, ETextbookID)
VALUES 
    ('CS101', 'Database Systems', 'F001', "T001", '2024-01-10', '2024-05-15', 'Active', "101"),
    ('CS102', 'Software Engineering', 'F001', "T001", '2024-01-15', '2024-05-20', 'Active', "102"),
    ('CS103', 'Machine Learning', 'F001', "T001", '2024-02-01', '2024-06-01', 'Active', "103"),
    ('CS104', 'Machine Learning Foundations', 'F001', "T001", '2024-03-01', '2024-07-01', 'Evaluation', "103");

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

