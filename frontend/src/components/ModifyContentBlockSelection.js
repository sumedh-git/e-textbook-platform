import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ModifyContentBlockSelection() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eTextbookID, chapterID, sectionID } = location.state || {};

    const [contentBlockID, setContentBlockID] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => setContentBlockID(e.target.value);

    const checkContentBlockExists = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/check-content-block/${eTextbookID}/${chapterID}/${sectionID}/${contentBlockID}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error checking Content Block ID:", error);
            return false;
        }
    };

    const handleOptionSelection = async (type) => {
        if (!contentBlockID) {
            alert('Please enter Content Block ID');
            return;
        }

        if (type === 'activity' || type === 'text' || type === 'picture'){
            const exists = await checkContentBlockExists();
            if (!exists) {
                setError("Content Block ID not found. Please enter a valid ID.");
                return;
            }
        }

        if (type === 'activity') {
            navigate('/admin/modify-activity', { state: {eTextbookID, chapterID, sectionID, contentBlockID } });
        } else {
            navigate('/admin/modify-content-block', { state: {eTextbookID, chapterID, sectionID, contentBlockID, type } });
        }
    };

    return (
        <div>
            <h2>Modify Content Block</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>Content Block ID:</label>
            <input
                type="text"
                value={contentBlockID}
                onChange={(e) => setContentBlockID(e.target.value)}
                required
            />
            <h3>Select Content Type</h3>
            <button onClick={() => handleOptionSelection('text')}>Add Text</button>
            <button onClick={() => handleOptionSelection('picture')}>Add Picture</button>
            <button onClick={() => handleOptionSelection('activity')}>Add Activity</button>
            <br /><br />
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
        </div>
    );
}

export default ModifyContentBlockSelection;
