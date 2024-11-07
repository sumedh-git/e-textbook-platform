import React, { useState } from "react";
import { Container, Card, Button, ListGroup, Alert, Form } from "react-bootstrap";

function ExecuteQuery() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [textBoxContent, setTextBoxContent] = useState("");

  const handleQueryClick = async (queryNumber) => {
    setLoading(true);
    setErrorMessage(""); 
    try {
      const response = await fetch("http://localhost:5000/api/misc/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred. Please try again.");
        return;
      }

      const data = await response.json();
      setResponseData(data); // Save the fetched data
      setTextBoxContent(JSON.stringify(data, null, 2)); // Populate text box with the result
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px", textAlign: "center" }} className="p-4">
        <h2 className="text-center mb-4">Execute a Query</h2>
        <ListGroup>
          {[1, 2, 3, 4, 5, 6, 7].map((queryNumber) => (
            <ListGroup.Item
              key={queryNumber}
              className="d-flex justify-content-center align-items-center"
              style={{ border: "none" }}
            >
              <Button
                variant="primary"
                onClick={() => handleQueryClick(queryNumber)}
                style={{ width: "100%" }}
                disabled={loading} 
              >
                Query {queryNumber}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {loading && <Alert variant="info">Fetching results...</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {responseData && (
          <>
            <div className="mt-4">
              <h4>Query Result:</h4>
              <pre>{JSON.stringify(responseData, null, 2)}</pre>
            </div>

            {/* Textbox is shown only if responseData exists
            <Form.Group className="mt-3">
              <Form.Label>Result (Text Box)</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={textBoxContent}
                readOnly
              />
            </Form.Group> */}
          </>
        )}
      </Card>
    </Container>
  );
}

export default ExecuteQuery;
