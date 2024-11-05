import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModifySection() {
    const navigate = useNavigate();

    // State for E-textbook ID, Chapter ID, and Section ID
    const [formData, setFormData] = useState({
        eTextbookID: '',
        chapterID: '',
        sectionID: ''
    });

    const [error, setError] = useState(null);  // State for error messages

    const role = localStorage.getItem('role');
    
    // Handle input changes and reset error when input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    // Function to check if section exists
    const checkSectionExists = async () => {
        const { eTextbookID, chapterID, sectionID } = formData;
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
            navigate('/admin/add-content-block-selection', { state: formData });
        } else if (option === 2) {
            navigate('/admin/modify-content-block-selection', { state: formData });
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
                <label>E-Textbook ID:</label>
                <input
                    type="text"
                    name="eTextbookID"
                    value={formData.eTextbookID}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Chapter ID:</label>
                <input
                    type="text"
                    name="chapterID"
                    value={formData.chapterID}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Section Number:</label>
                <input
                    type="text"
                    name="sectionID"
                    value={formData.sectionID}
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
