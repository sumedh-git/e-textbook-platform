import React, {useState} from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function StudentViewSection() {
const navigate = useNavigate();
const [eTextbookID, setETextbookID] = useState([]);
const [chapterID, setChapterID] = useState([]);
const [sectionID, setSectionID] = useState([]);

  return (
    <div>
      <Container className="text-center mt-5">
        <p>Enter details of section you wish to view</p>
      <Form onSubmit={() => navigate(`/student/view-block?eTextBook-id=${eTextbookID}&chapter-id=${chapterID}&section-id=${sectionID}`)}>
              <Form.Group>
                  <Form.Label>ETextbookID</Form.Label>
                  <Form.Control
                      type="text"
                      value={eTextbookID}
                      onChange={(e) => setETextbookID(e.target.value)}
                      required
                  />
              </Form.Group>
              <Form.Group className="mt-3">
                  <Form.Label>ChapterID</Form.Label>
                  <Form.Control
                      type="text"
                      value={chapterID}
                      onChange={(e) => setChapterID(e.target.value)}
                      required
                  />
              </Form.Group>
              <Form.Group className="mt-3">
                  <Form.Label>SectionID</Form.Label>
                  <Form.Control
                      type="text"
                      value={sectionID}
                      onChange={(e) => setSectionID(e.target.value)}
                      required
                  />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-4 w-100">
                  Submit
              </Button>
          </Form>
              <Button variant="danger" size="lg" block onClick={() => navigate(-1)}>
                  Go Back
              </Button>
  </Container>
  </div>
  );
}

export default StudentViewSection;
