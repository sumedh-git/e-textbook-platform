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

function TAActiveCourse() {
  const [courseID, setCourseID] = useState("");
  const [isCourseEntered, setIsCourseEntered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (courseID.trim()) {
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

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData.error || "An error occurred. Please try again."
          );
          return;
        }

        setIsCourseEntered(true); // Proceed to show menu
        setErrorMessage(""); // Clear any previous error messages

        localStorage.setItem("courseID", courseID); // Save CourseID in loccalStorage
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleMenuAction = (action) => {
    // Add your logic for each menu action
    console.log(`Action selected: ${action}`);
    // For example, navigate to a different route based on action
    if (action === "View Students") {
      navigate("/ta/view-students"); // Navigate to TAViewStudents component
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4">
        <h2 className="text-center mb-4">TA: Active Course</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {!isCourseEntered ? (
          <Form onSubmit={handleSubmit}>
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

            <Button variant="primary" type="submit" className="mt-4 w-100">
              Submit
            </Button>

            <Button
              variant="secondary"
              className="mt-3 w-100"
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </Form>
        ) : (
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
            <ListGroup.Item action onClick={handleGoBack}>
              4. Go Back
            </ListGroup.Item>
          </ListGroup>
        )}
      </Card>
    </Container>
  );
}

export default TAActiveCourse;
