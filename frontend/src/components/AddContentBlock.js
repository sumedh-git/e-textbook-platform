import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AddContentBlock() {
    const location = useLocation();
    const {eTextbookID, chapterID, sectionID, sectionTitle, contentBlockID, type } = location.state || {};
    const [contentData, setContentData] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userID = localStorage.getItem('userID');
    const role = localStorage.getItem('role');

    const handleSubmit = async () => {
        if (!contentData) {
            setError('Please enter content.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/add-content-block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eTextbookID: eTextbookID,
                    chapterID: chapterID,
                    sectionID: sectionID,
                    contentBlockID: contentBlockID,
                    content: contentData,
                    blockType: type,
                    createdBy: userID
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`${type} content added successfully!`);
                navigate(`/${role}/add-content-block-selection`); // Go back to the selection page
            } else {
                setError(data.error || 'Failed to add content block');
            }
        } catch (error) {
            console.error("Error:", error);
            setError('An error occurred while adding content block');
        }
    };

    return (
        <div>
            <h2>Add New {type} Content Block to Section {sectionTitle}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Content Block ID: {contentBlockID}</label>
                <br />

                <label>{type === 'text' ? "Text Content" : "Picture Name"}</label>
                <input
                    type="text"
                    placeholder={type === 'text' ? "Enter text content" : "Enter picture name (e.g., sample.png)"}
                    value={contentData}
                    onChange={(e) => setContentData(e.target.value)}
                    required
                />
                <br />

                <button type="button" onClick={handleSubmit}>Add {type}</button>
                <button type="button" onClick={() => navigate(`/${role}/add-content-block-selection`)}>Go Back</button>
            </form>
        </div>
    );
}

export default AddContentBlock;