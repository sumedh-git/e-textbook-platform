import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';

function StudentLogin() {
    const navigate = useNavigate();

    return (
        <Container className="text-center my-5">
            <h1 className="mb-4">Student Login Page</h1>

            {/* Role Buttons in a Vertical Single Line */}
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3" onClick={() => navigate('/student/enroll')}>
                        Enroll 
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="primary" size="lg" block className="mb-3"  onClick={() => navigate('/login/student')}>
                        Sign In
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={4}>
                    <Button variant="danger" size="lg" block onClick={() => navigate('/')}>
                        Go Back
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default StudentLogin;