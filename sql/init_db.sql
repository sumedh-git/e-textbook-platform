SET foreign_key_checks = 0;
DROP TABLE IF EXISTS Users, Students, Faculties, Admins, Etextbooks, Chapters, Sections, ContentBlocks, Questions, Activities, Answers;
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
    ETextbookID INT,
    ChapterID INT,
    SectionNumber VARCHAR(10) NOT NULL,
    Title VARCHAR(100) UNIQUE NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    UNIQUE (ETextbookID, ChapterID, SectionNumber),
    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (ChapterID) REFERENCES Chapters(ChapterID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE ContentBlocks (
    BlockID INT AUTO_INCREMENT PRIMARY KEY,
    ETextbookID INT,
    SectionID INT,
    BlockNumber VARCHAR(10) NOT NULL,
    BlockType VARCHAR(8) CHECK (BlockType IN ('text', 'image', 'activity')) NOT NULL,
    Content TEXT NOT NULL,
    CreatedBy VARCHAR(10),
    IsHidden BOOLEAN DEFAULT FALSE,
    UNIQUE (ETextbookID, SectionID, BlockNumber),
    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID)
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
    ON DELETE SET NULL 
    ON UPDATE CASCADE
);

CREATE TABLE Activities (
    ActivityID INT AUTO_INCREMENT PRIMARY KEY,   -- Unique identifier for each activity record
    ETextbookID INT,                             -- Foreign key to associate activity with a textbook
    SectionID INT,                               -- Foreign key to associate activity with a section
    BlockID INT,                                 -- Foreign key to the specific content block in the section
    ActivityNumber VARCHAR(10) NOT NULL,         -- User-defined number to identify the activity
    CreatedBy VARCHAR(10) NULL,
    IsHidden BOOLEAN DEFAULT FALSE,
    UNIQUE (ETextbookID, ActivityNumber, SectionID, BlockID), -- Ensures uniqueness within each section and block
    FOREIGN KEY (ETextbookID) REFERENCES ETextbooks(ETextbookID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (BlockID) REFERENCES ContentBlocks(BlockID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE Questions (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each question
    ActivityID INT,                                   -- Foreign key referencing Activities
    ETextbookID INT,                                  -- Foreign key referencing ETextbooks
    SectionID INT,                                    -- Foreign key referencing Sections
    QuestionNumber VARCHAR(10) NOT NULL,              -- User-defined identifier within each activity
    QuestionText TEXT NOT NULL,                       -- Content of the question
    UNIQUE (QuestionNumber, ActivityID, ETextbookID), -- Ensures uniqueness within each textbook's activity
    FOREIGN KEY (ActivityID, ETextbookID, SectionID) REFERENCES Activities(ActivityID, ETextbookID, SectionID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Answers (
    AnswerID INT PRIMARY KEY AUTO_INCREMENT,
    QuestionID INT,
    AnswerText VARCHAR(255) NOT NULL,
    Explanation TEXT,
    IsCorrect BOOLEAN NOT NULL,
    FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (QuestionID, IsCorrect)
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