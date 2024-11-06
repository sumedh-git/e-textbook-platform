import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Alert, Form, ListGroup } from "react-bootstrap";

function TAModifyContentBlock() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eTextbookID, chapterID, sectionID } = location.state || {};

  const [contentBlockID, setContentBlockID] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => setContentBlockID(e.target.value);

  // Function to check if the content block exists
  const checkContentBlockExists = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/check-content-block/${eTextbookID}/${chapterID}/${sectionID}/${contentBlockID}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking Content Block ID:", error);
      setError("Failed to validate content block ID.");
      return false;
    }
  };

  // Mapping of actions to routes
  const actionRouteMap = {
    HideContentBlock: "/faculty/hide-content-block",
    DeleteContentBlock: "/faculty/delete-content-block",
    HideActivity: "/faculty/hide-activity",
    DeleteActivity: "/faculty/delete-activity",
    AddActivity: "/faculty/add-activity",
  };

  const handleMenuAction = async (action, type = null) => {
    if (!contentBlockID.trim()) {
      setError("Please enter a Content Block ID.");
      return;
    }

    const isValid = await checkContentBlockExists();
    if (!isValid) {
      setError("Content Block ID not found. Please enter a valid ID.");
      return;
    }

    // Get the route from the mapping
    const route = actionRouteMap[action];

    // Check if a route exists for the action
    if (route) {
      const state = { eTextbookID, chapterID, sectionID, contentBlockID };

      // Include type for AddText and AddPicture actions
      if (action === "AddText" || action === "AddPicture") {
        state.type = type; // Set the type to the appropriate value
      }

      navigate(route, { state });
    } else {
      setError("Invalid action selected.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4">
        <h2 className="text-center mb-4">Modify Content Block</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group controlId="contentBlockID">
            <Form.Label>Enter Content Block ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Content Block ID"
              value={contentBlockID}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>

        <ListGroup className="mt-3">
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("HideContentBlock")}
          >
            1. Hide Content Block
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("DeleteContentBlock")}
          >
            2. Delete Content Block
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("AddText", "text")}
          >
            3. Add Text
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("AddPicture", "image")}
          >
            4. Add Picture
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("HideActivity")}
          >
            5. Hide Activity
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("DeleteActivity")}
          >
            6. Delete Activity
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => handleMenuAction("AddActivity")}
          >
            7. Add Activity
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => navigate(-1)}>
            8. Go Back
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  );
}

export default TAModifyContentBlock;
