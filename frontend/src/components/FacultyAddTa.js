import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function FacultyAddTa() {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseID } = location.state || {};

    const [ta, setTa] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setTa({ ...ta, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Call backend API to create TA account
        try {
            const response = await fetch('http://localhost:5000/api/faculty/add-ta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ta, courseID })
            });
            const data = await response.json();

            if (response.ok) {
                alert('TA added successfully');
                navigate(-1);
            } else {
                setErrorMessage(data.error || "Failed to add TA");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
        }
    };

    const handleCancel = () => {
        navigate(-1);  // Navigate back to the previous page
    };

    return (
        <div>
            <h2>Add TA to Course {courseID}</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form>
                <label>First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={ta.firstName}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={ta.lastName}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={ta.email}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Default Password:</label>
                <input
                    type="password"
                    name="password"
                    value={ta.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</button>
            </form>
        </div>
    );
}

export default FacultyAddTa;