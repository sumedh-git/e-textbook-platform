import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';

function FacultyHideContentBlock() {
    const navigate = useNavigate();
    const location = useLocation();
    const { eTextbookID, chapterID, sectionID, contentBlockID } = location.state || {};

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/faculty/hide-content-block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eTextbookID, chapterID, sectionID, contentBlockID }),
            });

            if (response.ok) {
                setSuccessMessage("Content Block hidden successfully!");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Failed to hide the content block.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <h2 className="text-center mb-4">Hide Content Block</h2>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Button variant="primary" onClick={handleSave} className="w-100 mt-3">Save</Button>
                <Button variant="secondary" onClick={handleCancel} className="w-100 mt-3">Cancel</Button>
            </Card>
        </Container>
    );
}

export default FacultyHideContentBlock;