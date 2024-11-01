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

function FacultyEvaluationCourse() {
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
          "http://localhost:5000/api/faculty/go-to-evaluation-course",
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
        <h2 className="text-center mb-4">Faculty: Evaluation Course</h2>

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
              onClick={() => handleMenuAction("Add New Chapter")}
            >
              1. Add New Chapter
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={() => handleMenuAction("Modify Chapters")}
            >
              2. Modify Chapters
            </ListGroup.Item>
            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="w-100 mt-3"
            >
              Go Back
            </Button>
          </ListGroup>
        )}
      </Card>
    </Container>
  );
}

export default FacultyEvaluationCourse;
