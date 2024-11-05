USE elearning_platform;

-- Step 1: Insert a User
INSERT INTO Users (UserID, FirstName, LastName, Email, Password) VALUES
('U001', 'Test', 'User', 'testuser@example.com', 'hashed_password_1');

-- Step 2: Insert a Faculty
INSERT INTO Faculties (UserID) VALUES
('U001');

-- Step 3: Insert an ETextbook
INSERT INTO ETextbooks (ETextbookID, CreatedBy, Title) VALUES
('ET001', 'U001', 'Introduction to Programming');

INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID) VALUES
('CSE101', 'Introduction to Computer Science', 'U001', '2024-01-10', '2024-05-10', 'Active', NULL),
('CSE102', 'Data Structures', 'U001', '2024-01-15', '2024-05-15', 'Active', NULL),
('CSE103', 'Algorithms', 'U001', '2023-01-10', '2023-05-10', 'Active', NULL); 

UPDATE Courses -- SHould Update
SET Title = 'Intro to CS'
WHERE CourseID = 'CSE101';

UPDATE Courses -- Should not update
SET Title = 'Advanced Algorithms'
WHERE CourseID = 'CSE103';