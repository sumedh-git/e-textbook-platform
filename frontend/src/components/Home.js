import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';

function Home() {
    const navigate = useNavigate();

    const handleSelection = (role) => {
        navigate(`/login/${role}`);
    };

    return (
        <Container className="text-center my-5">
            <h1 className="mb-4">Welcome to the E-Learning Platform</h1>
            <h2 className="mb-4">Select Your Role</h2>

            {/* Role Buttons in a Vertical Single Line */}
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3" onClick={() => handleSelection('admin')}>
                        Admin Login
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3" onClick={() => handleSelection('faculty')}>
                        Faculty Login
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3" onClick={() => handleSelection('ta')}>
                        TA Login
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3" onClick={() => handleSelection('student')}>
                        Student Login
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="danger" size="lg" block onClick={() => navigate('/')}>
                        Exit
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;