import React, { useState } from "react";
import { Container, Card, Form, ListGroup, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TAActiveCourse() {
  const [courseID, setCourseID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("role");

  // Function to validate courseID by calling the backend
  const validateCourseID = async () => {
    if (!courseID.trim()) {
      setErrorMessage("Please enter a Course ID.");
      return null;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/ta/go-to-active-course",
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
        console.log(data);
        return data.etextbook_id; // Retrieve and return etextbook_id
      } else {
        setErrorMessage(data.error || "Invalid Course ID.");
        return null;
      }
    } catch (error) {
      setErrorMessage("Invalid Course ID");
      return null;
    }
  };

  const handleMenuAction = async (action) => {
    const etextbook_id = await validateCourseID();
    if (!etextbook_id) return;

    // Navigate to the appropriate route based on action, passing etextbook_id as state
    switch (action) {
      case "View Students":
        navigate("/ta/view-students");
        break;
      case "Add New Chapter":
        navigate(`/${role}/add-chapter`, {
          state: { eTextbookID: etextbook_id },
        });
        break;
      case "Modify Chapters":
        navigate(`/${role}/modify-chapter`, {
          state: { eTextbookID: etextbook_id },
        });
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
        <h2 className="text-center mb-4">TA: Active Course</h2>

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
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("View Students")}
          >
            1. View Students
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("Add New Chapter")}
          >
            2. Add New Chapter
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("Modify Chapters")}
          >
            3. Modify Chapters
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => navigate(`/dashboard/${role}`)}>
            4. Go Back
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  );
}

export default TAActiveCourse;
