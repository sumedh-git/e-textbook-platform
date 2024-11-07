import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FacultyViewWorklist() {
  const [worklist, setWorklist] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const courseID = localStorage.getItem("courseID");

  useEffect(() => {
    const fetchWorklist = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty/view-worklist",
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
        setWorklist(data || []); 
        setErrorMessage(""); 
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      }
    };

    fetchWorklist();
  }, [courseID]);

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "600px" }} className="p-4">
        <h2 className="text-center mb-4">Students in Waitlist</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {worklist.length > 0 ? (
          <ListGroup>
            {worklist.map((worklist, index) => (
              <ListGroup.Item key={index}>
                <strong>Student ID:</strong> {worklist[0]}
                <br />
                <strong>Name:</strong> {worklist[1] + " " + worklist[2]}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Alert variant="info">No students in the waitlist for this course.</Alert>
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

export default FacultyViewWorklist;
