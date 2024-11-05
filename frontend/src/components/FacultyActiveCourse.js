import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FacultyActiveCourse() {
  const [courseID, setCourseID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("role");

  // Function to validate courseID by calling the backend
  const validateCourseID = async () => {
    if (!courseID.trim()) {
      setErrorMessage("Please enter a Course ID.");
      return false;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/go-to-active-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userID, course_id: courseID }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("courseID", courseID); // Save CourseID in localStorage
        setErrorMessage("");
        return data.etextbook_id;
      }else{
        setErrorMessage(data.error || "Invalid Course ID.");
        return null;
      }
      
    } catch (error) {
      setErrorMessage("Invalid Course ID");
      return false;
    }
  };

  const handleMenuAction = async (action) => {
    const etextbook_id = await validateCourseID();
    if (!etextbook_id) return;

    // Navigate to the appropriate route based on action
    switch (action) {
      case "View Worklist":
        navigate("/faculty/view-worklist");
        break;
      case "Approve Enrollment":
        navigate("/faculty/approve-enrollment");
        break;
      case "View Students":
        navigate("/faculty/view-students");
        break;
      case "Add New Chapter":
        navigate(`/${role}/add-chapter`, { state: { eTextbookID: etextbook_id} });
        break;
      case "Modify Chapters":
        navigate(`/${role}/modify-chapter`, { state: { eTextbookID: etextbook_id} })
        break;
      case "Add TA":
        navigate("/faculty/add-ta", { state: { courseID: courseID}});
        break;
      default:
        break;
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4">
        <h2 className="text-center mb-4">Faculty: Active Course</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form>
          <Form.Group>
            <Form.Label>Enter Course ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course ID"
              value={courseID}
              onChange={(e) => setCourseID(e.target.value)}
              required
            />
          </Form.Group>
        </Form>

        <ListGroup className="mt-3">
          <ListGroup.Item action onClick={() => handleMenuAction("View Worklist")}>
            1. View Worklist
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleMenuAction("Approve Enrollment")}>
            2. Approve Enrollment
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleMenuAction("View Students")}>
            3. View Students
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleMenuAction("Add New Chapter")}>
            4. Add New Chapter
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleMenuAction("Modify Chapters")}>
            5. Modify Chapters
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleMenuAction("Add TA")}>
            6. Add TA
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => navigate(`/dashboard/${role}`)}>
            7. Go Back
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  );
}

export default FacultyActiveCourse;
