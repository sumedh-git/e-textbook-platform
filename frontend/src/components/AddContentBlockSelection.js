import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AddContentBlockSelection() {
    const [contentBlockID, setContentBlockID] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {eTextbookID, chapterID, sectionID, sectionTitle } = location.state || {};

    const role = localStorage.getItem('role');

    const handleOptionSelection = (type) => {
        if (!contentBlockID) {
            alert('Please enter Content Block ID');
            return;
        }

        if (type === 'activity') {
            navigate('/admin/add-activity', { state: {eTextbookID, chapterID, sectionID, sectionTitle, contentBlockID } });
        } else {
            navigate('/admin/add-content-block', { state: {eTextbookID, chapterID, sectionID, sectionTitle, contentBlockID, type } });
        }
    };

    return (
        <div>
            <h2>Add New Content Block to Section {sectionTitle}</h2>
            <label>Content Block ID:</label>
            <input
                type="text"
                value={contentBlockID}
                onChange={(e) => setContentBlockID(e.target.value)}
                required
            />
            <h3>Select Content Type</h3>
            <button onClick={() => handleOptionSelection('text')}>Add Text</button>
            <button onClick={() => handleOptionSelection('image')}>Add Picture</button>
            <button onClick={() => handleOptionSelection('activity')}>Add Activity</button>
            <br /><br />
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate(`/dashboard/${role}`)}>Landing Page</button>
        </div>
    );
}

export default AddContentBlockSelection;
