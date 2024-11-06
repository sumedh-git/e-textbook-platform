import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = localStorage.getItem("userID");

    if (!userID) {
      setErrorMessage("User ID not found. Please log in again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password and Confirm Password do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userID,
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred");
      } else {
        const data = await response.json();
        setErrorMessage(""); // Clear error message
        setCurrentPassword("");
        setNewPassword("");
        alert("Password changed successfully!");
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleGoBack = () => {
    navigate(`/dashboard/${role}`); // Navigate back to the previous page
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4">
        <h2 className="text-center mb-4">Change Password</h2>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Change Password
          </Button>

          <Button
            variant="secondary"
            className="mt-3 w-100"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ChangePassword;
