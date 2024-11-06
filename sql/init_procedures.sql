DROP PROCEDURE IF EXISTS DeleteSectionByFacultyOrTA;

/&/

CREATE PROCEDURE DeleteSectionByFacultyOrTA (
    IN in_userID VARCHAR(10),
    IN in_etextbookID VARCHAR(10),
    IN in_chapterID VARCHAR(10),
    IN in_sectionID VARCHAR(10)
)
BEGIN
    DECLARE creator_id VARCHAR(10);
    
    -- Get the creator ID for the section
    SELECT CreatedBy INTO creator_id 
    FROM Sections 
    WHERE ETextbookID = in_etextbookID 
      AND ChapterID = in_chapterID 
      AND SectionID = in_sectionID;

    -- Verify if the creator is the current faculty or a TA
    IF creator_id = in_userID THEN
        DELETE FROM Sections 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID;

        SELECT "Section deleted successfully" AS result_message;

    ELSEIF EXISTS (
        SELECT 1 FROM TAs WHERE TAs.UserID = creator_id
    ) THEN
        DELETE FROM Sections 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID;

        SELECT "Section deleted successfully" AS result_message;

    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You do not have permission to delete this section.';
    END IF;

END

/&/

-- Create a stored procedure to check the end date of a course
CREATE PROCEDURE check_end_date(IN p_course_id VARCHAR(20))
BEGIN
    DECLARE v_end_date DATE;
    -- Get the EndDate of the specified course
    SELECT EndDate INTO v_end_date
    FROM Courses
    WHERE CourseID = p_course_id;
    
    -- Check if the EndDate has passed
    IF CURDATE() > v_end_date THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot edit course after the end date';
    END IF;
END

/&/

-- Create a trigger to call the check_end_date procedure before updating a course

CREATE TRIGGER before_course_update
BEFORE UPDATE ON Courses
FOR EACH ROW
BEGIN
    -- Call the stored procedure to check if editing is allowed
    CALL check_end_date(OLD.CourseID);
END

/&/

CREATE TRIGGER InsertDefaultScoresAfterEnrollmentUpdate
AFTER UPDATE ON Enrollments
FOR EACH ROW
BEGIN
    -- Check if the enrollment status was changed to 'Enrolled'
    IF NEW.EnrollmentStatus = 'Enrolled' AND OLD.EnrollmentStatus <> 'Enrolled' THEN
        -- Insert a default score of 0 for each question in the e-textbook
        INSERT INTO StudentActivity (QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID, StudentID, Points)
        SELECT 
            q.QuestionID,
            q.ETextbookID,
            q.ChapterID,
            q.SectionID,
            q.BlockID,
            q.ActivityID,
            NEW.StudentID,
            0 AS Points
        FROM 
            Questions q
            JOIN Courses c ON c.CourseID = NEW.CourseID
            JOIN ETextbooks et ON et.ETextbookID = c.ETextbookID
        WHERE 
            q.ETextbookID = et.ETextbookID;
    END IF;
END