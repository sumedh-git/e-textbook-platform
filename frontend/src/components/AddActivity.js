import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AddActivity() {
    const navigate = useNavigate();
    const location = useLocation();
    const { sectionID, contentBlockID } = location.state || {};  // From previous page
    const [activityID, setActivityID] = useState('');

    const handleAddQuestion = () => {
        if (!activityID) {
            alert('Please enter a unique Activity ID');
            return;
        }
        // Redirect to AddQuestion page with the activityID
        navigate('/admin/add-question', { state: { sectionID, contentBlockID, activityID } });
    };

    return (
        <div>
            <h2>Add Activity</h2>
            <label>Unique Activity ID:</label>
            <input
                type="text"
                value={activityID}
                onChange={(e) => setActivityID(e.target.value)}
                required
            />
            <br />
            <h3>Menu</h3>
            <button onClick={handleAddQuestion}>Add Question</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
        </div>
    );
}

export default AddActivity;