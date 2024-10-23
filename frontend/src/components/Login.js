import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

function Login() {
    const { role } = useParams();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, password: password, role: role })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userID', data.user.user_id);
                navigate(`/dashboard/${role}`);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const handleGoBack = () => {
        navigate('/');  // Redirect back to Home page
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <h2 className="text-center mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
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
                        Sign-In
                    </Button>
                </Form>
                <Button variant="secondary" className="mt-3 w-100" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Card>
        </Container>
    );
}

export default Login;