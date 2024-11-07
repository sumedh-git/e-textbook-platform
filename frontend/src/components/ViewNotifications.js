import React, { useState, useEffect } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";

function ViewNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentUserID = localStorage.getItem("userID");
  const url = "http://localhost:5000/api/student/notifications";

  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentUserID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        var notification = data[1];
        console.log(notification);
        setNotifications(notification);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [url, studentUserID]);

  // Function to handle marking a notification as read
  const handleMarkAsRead = (notificationID) => {
    fetch("http://localhost:5000/api/student/notifications/mark-read", {
      method: "POST", // We use POST here since we're sending data in the body
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationID }), // Sending notificationID in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }
        // Remove the notification from the local state after successful deletion
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification[0] !== notificationID
          )
        );
      })
      .catch((error) => setError(error.message));
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>Error loading notifications: {error}</p>;
  }

  return (
    <Container>
      <h2 className="my-4">Notifications</h2>
      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <p>{notification[1]}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMarkAsRead(notification[0])}
              >
                Mark as Read
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </ListGroup>
    </Container>
  );
}

export default ViewNotifications;
