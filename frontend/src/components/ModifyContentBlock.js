import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ModifyContentBlock() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eTextbookID, chapterID, sectionID, contentBlockID, type } = location.state || {};
    const [contentData, setContentData] = useState('');
    const [error, setError] = useState(null);

    const userID = localStorage.getItem('userID');

    const handleSubmit = async () => {
        if (!contentData) {
            setError("Content cannot be empty.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/modify-content-block', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eTextbookID,
                    chapterID,
                    sectionID,
                    contentBlockID,
                    contentData,
                    type,
                    updatedBy : userID
                })
            });
            if (response.ok) {
                alert('Content block modified successfully!');
                navigate(-1); // Go back to ModifyContentBlock
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update content block.');
            }
        } catch (error) {
            setError('An error occurred while updating content.');
        }
    };

    return (
        <div>
            <h2>{type === 'text' ? 'Add Text' : 'Add Picture'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={(e) => e.preventDefault()}>
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
                <button type="button" onClick={() => navigate(-1)}>Go Back</button>
            </form>
        </div>
    );
}

export default ModifyContentBlock;
