import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function FacultyApproveEnrollment() {
    const [studentID, setStudentID] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const courseID = localStorage.getItem("courseID");

    const handleChange = (e) => {
        setStudentID(e.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/faculty/approve-enrollment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentID, courseID }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
            } else {
                setMessage({ type: 'danger', text: data.error });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'An error occurred while approving enrollment.' });
        }
    };

    const handleCancel = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <h2 className="text-center mb-4">Approve Enrollment</h2>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form>
                    <Form.Group>
                        <Form.Label>Enter Student ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Student ID"
                            value={studentID}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" className="mt-4 w-100" onClick={handleSave}>Save</Button>
                    <Button variant="secondary" className="mt-3 w-100" onClick={handleCancel}>Cancel</Button>
                </Form>
            </Card>
        </Container>
    );
}

export default FacultyApproveEnrollment;
