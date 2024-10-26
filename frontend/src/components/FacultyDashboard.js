import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const navigate = useNavigate();

  const handleSelection = (option) => {
    switch (option) {
      case 1:
        navigate("/faculty/active-course");
        break;
      case 2:
        navigate("/faculty/evaluation-course");
        break;
      case 3:
        navigate("/faculty/view-courses");
        break;
      case 4:
        navigate("/change-password");
        break;
      case 5:
        alert("Logging out...");
        navigate("/");
        break;
      default:
        alert("Invalid option");
    }
  };

  return (
    <Container className="text-center mt-5">
      <h1>Faculty Dashboard</h1>
      <Row className="mt-4">
        <Col>
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => handleSelection(1)}
          >
            Go to Active Course
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button
            variant="success"
            size="lg"
            block
            onClick={() => handleSelection(2)}
          >
            Go to Evaluation Course
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button
            variant="info"
            size="lg"
            block
            onClick={() => handleSelection(3)}
          >
            View Courses
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button
            variant="warning"
            size="lg"
            block
            onClick={() => handleSelection(4)}
          >
            Change Password
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Button
            variant="danger"
            size="lg"
            block
            onClick={() => handleSelection(5)}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default FacultyDashboard;
