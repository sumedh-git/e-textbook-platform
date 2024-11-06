import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AddSection() {
    const location = useLocation();
    const navigate = useNavigate();

    const userID = localStorage.getItem('userID');
    const role = localStorage.getItem('role');

    // Extract the passed ChapterID and Chapter title from the location state
    const {eTextbookID, chapterID, chapterTitle } = location.state || {};

    const [section, setSection] = useState({
        sectionID: '',
        sectionTitle: ''
    });
    const [error, setError] = useState(null);

    // Handle input changes for section details
    const handleChange = (e) => {
        setSection({ ...section, [e.target.name]: e.target.value });
    };

    // Handle menu options (Add Content Block, Go Back, Landing Page)
    const handleOption = async (option) => {
        if (option === 1) {
            try {
                // Call the backend API to add the section
                const response = await fetch('http://localhost:5000/api/admin/add-section', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eTextbookID: eTextbookID,
                        chapterID: chapterID,
                        sectionID: section.sectionID,
                        sectionTitle: section.sectionTitle,
                        createdBy: userID
                    })
                });

                if (response.ok) {
                    alert('Section added successfully!');
                    navigate(`/admin/add-content-block-selection`, { state: {eTextbookID, chapterID, sectionID: section.sectionID, sectionTitle: section.sectionTitle,} });
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to add section');
                }
            } catch (err) {
                setError('Failed to add section');
            }
        } else if (option === 2) {
            // Go back to the Add Chapter page
            navigate(`/${role}/add-chapter`, { state: { chapterID, chapterTitle } });
        } else if (option === 3) {
            // Go to the Admin's landing page
            navigate(`/dashboard/${role}`);
        }
    };

    return (
        <div>
            <h2>Add New Section to {chapterTitle}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && (
                <form>
                    <label>Section Number:</label>
                    <input
                        type="text"
                        name="sectionID"
                        value={section.sectionID}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label>Section Title:</label>
                    <input
                        type="text"
                        name="sectionTitle"
                        value={section.sectionTitle}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <h3>Menu</h3>
                    <button type="button" onClick={() => handleOption(1)}>
                        Add New Content Block
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
            )}
        </div>
    );
}

export default AddSection;