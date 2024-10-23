import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateFaculty() {
    const [faculty, setFaculty] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFaculty({ ...faculty, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call backend API to create faculty account
        const response = await fetch('http://localhost:5000/api/admin/create-faculty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faculty)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Faculty account created successfully');
        } else {
            alert(data.error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);  // Navigate back to the previous page
    };

    return (
        <div>
            <h2>Create Faculty Account</h2>
            <form onSubmit={handleSubmit}>
                <label>First Name:</label>
                <input type="text" name="firstName" value={faculty.firstName} onChange={handleChange} required />
                <br />
                <label>Last Name:</label>
                <input type="text" name="lastName" value={faculty.lastName} onChange={handleChange} required />
                <br />
                <label>Email:</label>
                <input type="email" name="email" value={faculty.email} onChange={handleChange} required />
                <br />
                <label>Password:</label>
                <input type="password" name="password" value={faculty.password} onChange={handleChange} required />
                <br />
                <button type="submit">Add User</button>
            </form>
            <button onClick={handleGoBack} style={{ marginTop: '10px' }}>Go Back</button>
        </div>
    );
}

export default CreateFaculty;