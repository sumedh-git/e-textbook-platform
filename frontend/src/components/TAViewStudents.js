// TAViewStudents.js
import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TAViewStudents() {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const courseID = localStorage.getItem("courseID");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ta/view-students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ course_id: courseID }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData.error || "An error occurred. Please try again."
          );
          return;
        }

        const data = await response.json();
        setStudents(data || []); // Assuming 'students' field in the response
        setErrorMessage(""); // Clear previous error messages
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      }
    };

    fetchStudents();
  }, [courseID]);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "600px" }} className="p-4">
        <h2 className="text-center mb-4">Students Enrolled in Course</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {students.length > 0 ? (
          <ListGroup>
            {students.map((student, index) => (
              <ListGroup.Item key={index}>
                <strong>Student ID:</strong> {student[0]}
                <br />
                <strong>Name:</strong> {student[1] + " " + student[2]}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info">No students found for this course.</Alert>
        )}

        <Button
          variant="secondary"
          onClick={handleGoBack}
          className="mt-3 w-100"
        >
          Go Back
        </Button>
      </Card>
    </Container>
  );
}

export default TAViewStudents;
