import React, {useState} from 'react';
// import { Button, Container, Row, Col } from 'react-bootstrap';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function StudentEnroll() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [enrollmentToken, setEnrollmentToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call backend API to create faculty account
        const response = await fetch('http://localhost:5000/api/student/enroll-student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, firstName: firstName, lastName: lastName, enrollmentToken: enrollmentToken, password: password})
        });
        const data = await response.json();
        if (response.ok) {
            alert('Student enrolled successfully');
        } else {
            alert(data.error);
        }
    };

    return (
        <Container className="text-center mt-5">
            <h1>Student Enrollment Form</h1>
            <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Enrollment Token</Form.Label>
                        <Form.Control
                            type="text"
                            value={enrollmentToken}
                            onChange={(e) => setEnrollmentToken(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-4 w-100">
                        Submit
                    </Button>
                </Form>
                    <Button variant="danger" size="lg" block onClick={() => navigate('/student/login')}>
                        Go Back
                    </Button>

        </Container>
    );
}

export default StudentEnroll;