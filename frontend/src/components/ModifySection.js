import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ModifySection() {
    const navigate = useNavigate();
    const location = useLocation();
    const {eTextbookID, chapterID} = location.state || {};
    const [sectionID, setSectionID] = useState('');

    const [error, setError] = useState(null);  // State for error messages

    const role = localStorage.getItem('role');
    
    const handleChange = (e) => setSectionID(e.target.value);

    // Function to check if section exists
    const checkSectionExists = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/check-section/${eTextbookID}/${chapterID}/${sectionID}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error checking section:", error);
            return false;
        }
    };

    const handleOption = async (option) => {
        // Only validate for actions that modify or add content blocks
        if (option === 1 || option === 2) {
            const sectionExists = await checkSectionExists();
            if (!sectionExists) {
                setError("Please enter valid E-Textbook ID, Chapter ID, and Section ID.");
                return;
            }
        }

        // Navigate based on user option
        if (option === 1) {
            navigate('/admin/add-content-block-selection', { state: { eTextbookID, chapterID, sectionID } });
        } else if (option === 2) {
            navigate('/admin/modify-content-block-selection', { state: { eTextbookID, chapterID, sectionID } });
        } else if (option === 3) {
            navigate(-1);  // Go back to previous page
        } else if (option === 4) {
            navigate(`/dashboard/${role}`);  // Go to admin landing page
        }
    };

    return (
        <div>
            <h2>Modify Section</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Section Number:</label>
                <input
                    type="text"
                    name="sectionID"
                    value={sectionID}
                    onChange={handleChange}
                    required
                />
                <br />

                <h3>Menu</h3>
                <button type="button" onClick={() => handleOption(1)}>Add New Content Block</button>
                <button type="button" onClick={() => handleOption(2)}>Modify Content Block</button>
                <button type="button" onClick={() => handleOption(3)}>Go Back</button>
                <button type="button" onClick={() => handleOption(4)}>Landing Page</button>
            </form>
        </div>
    );
}

export default ModifySection;
