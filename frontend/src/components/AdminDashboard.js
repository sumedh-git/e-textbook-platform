import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();

    const handleSelection = (option) => {
        switch (option) {
            case 1:
                navigate('/admin/create-faculty');
                break;
            case 2:
                navigate('/admin/create-etextbook');
                break;
            case 3:
                navigate('/admin/modify-etextbook');
                break;
            case 4:
                navigate('/admin/create-active-course');
                break;
            case 5:
                navigate('/admin/create-evaluation-course');
                break;
            case 6:
                alert('Logging out...');
                navigate('/');
                break;
            default:
                alert('Invalid option');
        }
    };

    return (
        <Container className="text-center mt-5">
            <h1>Admin Dashboard</h1>
            <Row className="mt-4">
                <Col>
                    <Button variant="primary" size="lg" block onClick={() => handleSelection(1)}>
                        Create a Faculty Account
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="success" size="lg" block onClick={() => handleSelection(2)}>
                        Create E-textbook
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="info" size="lg" block onClick={() => handleSelection(3)}>
                        Modify E-textbooks
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="warning" size="lg" block onClick={() => handleSelection(4)}>
                        Create New Active Course
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="dark" size="lg" block onClick={() => handleSelection(5)}>
                        Create New Evaluation Course
                    </Button>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Button variant="danger" size="lg" block onClick={() => handleSelection(6)}>
                        Logout
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminDashboard;