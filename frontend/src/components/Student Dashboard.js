import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Main Component
function StudentDashboard() {
  const navigate = useNavigate();
  const [eTextbooks, setETextbooks] = useState([]);

  const studentUserID = localStorage.getItem("userID");
  const url = `http://localhost:5000/api/student/student-textbooks?student-user-id=${studentUserID}`;
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setETextbooks(data))
      .catch((error) => console.error("Error fetching eTextbooks:", error));
  }, [url]);

  return (
    <div>
      <div
        style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc" }}
      >
        {eTextbooks.map((etextbook) => (
          <div style={{ borderBottom: "1px solid #ddd", marginBottom: "10px" }}>
            <h2>
              {" "}
              TextbookID:
              <b>
                <i>{etextbook.ETextbookID}</i>
              </b>{" "}
              Title:{" "}
              <b>
                <i>{etextbook.Title}</i>
              </b>
            </h2>
            {etextbook.Chapters.map((chapter) => (
              <div
                style={{ marginLeft: "70px", borderBottom: "1px solid #eee" }}
              >
                <h3>
                  ChapterID: {chapter.ChapterID} Title:{chapter.Title}
                </h3>
                {chapter.Sections.map((section) => (
                  <div style={{ marginLeft: "100px" }}>
                    <h4>
                      {" "}
                      SectionID:{section.SectionID} Title:{section.Title}
                    </h4>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <Container className="text-center my-5">
          <Row className="justify-content-center">
            <Col md={4}>
              <Button
                variant="primary"
                size="lg"
                block
                className="mb-3"
                onClick={() => navigate("/student/view-section")}
              >
                View Section
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4}>
              <Button
                variant="primary"
                size="lg"
                block
                className="mb-3"
                onClick={() =>
                  navigate("/student/view-participation-activity-points")
                }
              >
                View Participation Activity Points
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4}>
              <Button
                variant="primary"
                size="lg"
                block
                className="mb-3"
                onClick={() => navigate("/student/view-notifications")}
              >
                View Notifications
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4}>
              <Button
                variant="danger"
                size="lg"
                block
                onClick={() => navigate("/student/login")}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default StudentDashboard;
