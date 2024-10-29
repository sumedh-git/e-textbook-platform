import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FacultyViewCourses() {
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading status
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ta/view-courses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userID }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(
            errorData.error || "An error occurred. Please try again."
          );
          setLoading(false); // Set loading to false in case of error
          return;
        }

        const data = await response.json();
        setCourses(data); // Assuming the response contains a 'courses' field with the course data
        setErrorMessage(""); // Clear any previous error messages
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      } finally {
        setLoading(false); // Set loading to false when the fetching is complete
      }
    };

    fetchCourses();
  }, [userID]);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "600px" }} className="p-4">
        <h2 className="text-center mb-4">Faculty: Active Courses</h2>

        {loading ? ( // Check if data is still loading
          <Alert variant="info">Fetching results...</Alert>
        ) : (
          <>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {courses.length > 0 ? (
              <ListGroup>
                {courses.map((course, index) => (
                  <ListGroup.Item key={index}>
                    <strong>Course ID:</strong> {course[0]}
                    <br />
                    <strong>Course Name:</strong> {course[1]}
                    <br />
                    <strong>Faculty ID:</strong> {course[2]}
                    <br />
                    <strong>Start Date:</strong> {course[3]}
                    <br />
                    <strong>End Date:</strong> {course[4]}
                    <br />
                    <strong>Status:</strong> {course[5]}
                    <br />
                    <strong>Course Code:</strong> {course[6]}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="info">No courses found for this faculty.</Alert>
            )}
          </>
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

export default FacultyViewCourses;
