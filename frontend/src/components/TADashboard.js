import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TADashboard() {
  const navigate = useNavigate();

  const handleSelection = (option) => {
    switch (option) {
      case 1:
        navigate("/ta/active-course");
        break;
      case 2:
        navigate("/ta/view-courses");
        break;
      case 3:
        navigate("/change-password");
        break;
      case 4:
        alert("Logging out...");
        navigate("/");
        break;
      default:
        alert("Invalid option");
    }
  };

  return (
    <Container className="text-center mt-5">
      <h1>TA Dashboard</h1>
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
            variant="info"
            size="lg"
            block
            onClick={() => handleSelection(2)}
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
            onClick={() => handleSelection(3)}
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
            onClick={() => handleSelection(4)}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default TADashboard;
