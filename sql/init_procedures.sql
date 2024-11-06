DROP PROCEDURE IF EXISTS DeleteSectionByFacultyOrTA;

/&/

DROP PROCEDURE IF EXISTS check_end_date;

/&/

DROP PROCEDURE IF EXISTS DeleteChapterByFacultyOrTA;

/&/

DROP PROCEDURE IF EXISTS DeleteContentBlockByFacultyOrTA;

/&/

DROP PROCEDURE IF EXISTS DeleteActivityByFacultyOrTA;

/&/

DROP PROCEDURE IF EXISTS ApproveEnrollment;

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

CREATE PROCEDURE DeleteChapterByFacultyOrTA (
    IN in_userID VARCHAR(10),
    IN in_etextbookID VARCHAR(10),
    IN in_chapterID VARCHAR(10)
)
BEGIN
    DECLARE creator_id VARCHAR(10);

    -- Get the creator ID for the chapter
    SELECT CreatedBy INTO creator_id 
    FROM Chapters 
    WHERE ETextbookID = in_etextbookID 
      AND ChapterID = in_chapterID;

    -- Verify if the creator is the current faculty or a TA
    IF creator_id = in_userID THEN
        DELETE FROM Chapters 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID;

        SELECT "Chapter deleted successfully" AS result_message;

    ELSEIF EXISTS (
        SELECT 1 FROM TAs WHERE TAs.UserID = creator_id
    ) THEN
        DELETE FROM Chapters 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID;

        SELECT "Chapter deleted successfully" AS result_message;

    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You do not have permission to delete this chapter.';
    END IF;

END;

/&/

CREATE PROCEDURE DeleteContentBlockByFacultyOrTA (
    IN in_userID VARCHAR(10),
    IN in_etextbookID VARCHAR(10),
    IN in_chapterID VARCHAR(10),
    IN in_sectionID VARCHAR(10),
    IN in_blockID VARCHAR(10)
)
BEGIN
    DECLARE creator_id VARCHAR(10);

    -- Get the creator ID for the content block
    SELECT CreatedBy INTO creator_id 
    FROM ContentBlocks 
    WHERE ETextbookID = in_etextbookID 
      AND ChapterID = in_chapterID 
      AND SectionID = in_sectionID
      AND BlockID = in_blockID;

    -- Verify if the creator is the current faculty or a TA
    IF creator_id = in_userID THEN
        DELETE FROM ContentBlocks 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID
          AND BlockID = in_blockID;

        SELECT "Content block deleted successfully" AS result_message;

    ELSEIF EXISTS (
        SELECT 1 FROM TAs WHERE TAs.UserID = creator_id
    ) THEN
        DELETE FROM ContentBlocks 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID
          AND BlockID = in_blockID;

        SELECT "Content block deleted successfully" AS result_message;

    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You do not have permission to delete this content block.';
    END IF;

END;

/&/

CREATE PROCEDURE DeleteActivityByFacultyOrTA (
    IN in_userID VARCHAR(10),
    IN in_etextbookID VARCHAR(10),
    IN in_chapterID VARCHAR(10),
    IN in_sectionID VARCHAR(10),
    IN in_blockID VARCHAR(10),
    IN in_activityID VARCHAR(10)
)
BEGIN
    DECLARE creator_id VARCHAR(10);

    -- Get the creator ID for the activity
    SELECT CreatedBy INTO creator_id 
    FROM Activities 
    WHERE ETextbookID = in_etextbookID 
      AND ChapterID = in_chapterID 
      AND SectionID = in_sectionID
      AND BlockID = in_blockID
      AND ActivityID = in_activityID;

    -- Verify if the creator is the current faculty or a TA
    IF creator_id = in_userID THEN
        DELETE FROM Activities 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID
          AND BlockID = in_blockID
          AND ActivityID = in_activityID;

        SELECT "Activity deleted successfully" AS result_message;

    ELSEIF EXISTS (
        SELECT 1 FROM TAs WHERE TAs.UserID = creator_id
    ) THEN
        DELETE FROM Activities 
        WHERE ETextbookID = in_etextbookID 
          AND ChapterID = in_chapterID 
          AND SectionID = in_sectionID
          AND BlockID = in_blockID
          AND ActivityID = in_activityID;

        SELECT "Activity deleted successfully" AS result_message;

    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'You do not have permission to delete this activity.';
    END IF;

END;

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


CREATE PROCEDURE ApproveEnrollment(
    IN in_StudentID VARCHAR(10),
    IN in_CourseID VARCHAR(20)
)
BEGIN
    DECLARE courseCapacity INT;

    -- Retrieve the current capacity of the specific course
    SELECT Capacity INTO courseCapacity
    FROM ActiveCourses
    WHERE CourseID = in_CourseID;

    -- Check if the course has available capacity
    IF courseCapacity > 0 THEN
        -- Update enrollment status to 'Enrolled' for the specified student and course
        UPDATE Enrollments
        SET EnrollmentStatus = 'Enrolled'
        WHERE StudentID = in_StudentID AND CourseID = in_CourseID;

        -- Decrease the capacity of the specific course by 1
        UPDATE ActiveCourses
        SET Capacity = Capacity - 1
        WHERE CourseID = in_CourseID;
        
        -- Return success message
        SELECT "Enrollment approved successfully." AS result_message;
    ELSE
        -- If no capacity, return an error message
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course is at full capacity.';
    END IF;

END