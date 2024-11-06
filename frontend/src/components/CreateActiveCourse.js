import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateActiveCourse() {
    const [course, setCourse] = useState({
        courseID: '',
        courseName: '',
        eTextbookID: '',
        facultyID: '',
        startDate: '',
        endDate: '',
        token: '',
        capacity: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/create-active-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            const data = await response.json();
            if (response.ok) {
                alert('Active Course created successfully!');
                navigate('/dashboard/admin');
            } else {
                setError(data.error || 'Failed to create active course');
            }
        } catch (err) {
            setError('An error occurred while creating the course');
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Active Course</h2>
            {error && <p className="error">{error}</p>}
            <form>
                <label>Unique Course ID:</label>
                <input type="text" name="courseID" value={course.courseID} onChange={handleChange} required />
                
                <label>Course Name:</label>
                <input type="text" name="courseName" value={course.courseName} onChange={handleChange} required />
                
                <label>Unique ID of the E-Textbook:</label>
                <input type="text" name="eTextbookID" value={course.eTextbookID} onChange={handleChange} required />
                
                <label>Faculty Member ID:</label>
                <input type="text" name="facultyID" value={course.facultyID} onChange={handleChange} required />
                
                <label>Course Start Date:</label>
                <input type="date" name="startDate" value={course.startDate} onChange={handleChange} required />
                
                <label>Course End Date:</label>
                <input type="date" name="endDate" value={course.endDate} onChange={handleChange} required />
                
                <label>Unique Token:</label>
                <input type="text" name="token" value={course.token} onChange={handleChange} required />
                
                <label>Course Capacity:</label>
                <input type="number" name="capacity" value={course.capacity} onChange={handleChange} required />

                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={() => navigate(`/dashboard/${role}`)}>Cancel</button>
                <button type="button" onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
            </form>
        </div>
    );
}

export default CreateActiveCourse;