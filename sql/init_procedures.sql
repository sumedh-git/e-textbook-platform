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