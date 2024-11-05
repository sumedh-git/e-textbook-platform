import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEvaluationCourse() {
    const [course, setCourse] = useState({
        courseID: '',
        courseName: '',
        eTextbookID: '',
        facultyID: '',
        startDate: '',
        endDate: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/create-evaluation-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            const data = await response.json();
            if (response.ok) {
                alert('Evaluation Course created successfully!');
                navigate('/dashboard/admin');
            } else {
                setError(data.error || 'Failed to create evaluation course');
            }
        } catch (err) {
            setError('An error occurred while creating the course');
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Evaluation Course</h2>
            {error && <p className="error">{error}</p>}
            <form>
                <label>Course ID:</label>
                <input type="text" name="courseID" value={course.courseID} onChange={handleChange} required />

                <label>Course Name:</label>
                <input type="text" name="courseName" value={course.courseName} onChange={handleChange} required />

                <label>E-Textbook ID:</label>
                <input type="text" name="eTextbookID" value={course.eTextbookID} onChange={handleChange} required />

                <label>Faculty Member ID:</label>
                <input type="text" name="facultyID" value={course.facultyID} onChange={handleChange} required />

                <label>Course Start Date:</label>
                <input type="date" name="startDate" value={course.startDate} onChange={handleChange} required />

                <label>Course End Date:</label>
                <input type="date" name="endDate" value={course.endDate} onChange={handleChange} required />

                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                <button type="button" onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
            </form>
        </div>
    );
}

export default CreateEvaluationCourse;