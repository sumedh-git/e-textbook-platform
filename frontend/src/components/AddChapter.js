import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AddChapter() {
    const location = useLocation();
    const { eTextbookID, title } = location.state;
    const [chapter, setChapter] = useState({
        chapterID: '',
        chapterTitle: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userID = localStorage.getItem('userID');
    const role = localStorage.getItem('role');

    // Handle input change for chapter fields
    const handleChange = (e) => {
        setChapter({ ...chapter, [e.target.name]: e.target.value });
    };

    // Handle form submission based on user choice
    const handleOption = async (option) => {
        if (option === 1) {
            // Call the API to create the chapter in the database
            try {
                const response = await fetch('http://localhost:5000/api/admin/add-chapter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chapterID: chapter.chapterID,
                        chapterTitle: chapter.chapterTitle,
                        eTextbookID: eTextbookID,
                        createdBy: userID
                    })
                });

                if (response.ok) {
                    alert('Chapter added successfully!');
                    navigate(`/${role}/add-section`, { state: {eTextbookID: eTextbookID, chapterID: chapter.chapterID, chapterTitle: chapter.chapterTitle} });
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to add chapter');
                }
            } catch (err) {
                setError('Failed to add chapter');
            }
        } else if (option === 2) {
            // Go back to the Create E-textbook page and discard input
            navigate(-1);
        } else if (option === 3) {
            // Go to the Admin's landing page
            navigate(`/dashboard/${role}`);
        }
    };

    return (
        <div>
            <h2>Add New Chapter to {title}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Unique Chapter ID:</label>
                <input
                    type="text"
                    name="chapterID"
                    value={chapter.chapterNumber}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Chapter Title:</label>
                <input
                    type="text"
                    name="chapterTitle"
                    value={chapter.chapterTitle}
                    onChange={handleChange}
                    required
                />
                <br />
                <h3>Menu</h3>
                <button type="button" onClick={() => handleOption(1)}>
                    Add New Section
                </button>
                <br />
                <button type="button" onClick={() => handleOption(2)}>
                    Go Back
                </button>
                <br />
                <button type="button" onClick={() => handleOption(3)}>
                    Landing Page
                </button>
            </form>
        </div>
    );
}

export default AddChapter;
