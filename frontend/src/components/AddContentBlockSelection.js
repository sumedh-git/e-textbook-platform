import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AddContentBlockSelection() {
    const [contentBlockNumber, setContentBlockNumber] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { sectionID, sectionTitle } = location.state || {};

    const handleOptionSelection = (type) => {
        if (!contentBlockNumber) {
            alert('Please enter Content Block ID');
            return;
        }

        if (type === 'activity') {
            navigate('/admin/add-activity', { state: { sectionID, sectionTitle, contentBlockNumber } });
        } else {
            navigate('/admin/add-content-block', { state: { sectionID, sectionTitle, contentBlockNumber, type } });
        }
    };

    return (
        <div>
            <h2>Add New Content Block to Section {sectionTitle}</h2>
            <label>Content Block ID:</label>
            <input
                type="text"
                value={contentBlockNumber}
                onChange={(e) => setContentBlockNumber(e.target.value)}
                required
            />
            <h3>Select Content Type</h3>
            <button onClick={() => handleOptionSelection('text')}>Add Text</button>
            <button onClick={() => handleOptionSelection('image')}>Add Picture</button>
            <button onClick={() => handleOptionSelection('activity')}>Add Activity</button>
            <br /><br />
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
        </div>
    );
}

export default AddContentBlockSelection;
