import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModifyETextbook() {
    const [eTextbookID, setETextbookID] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setETextbookID(e.target.value);
    };

    const role = localStorage.getItem('role');

    // Function to check if the E-Textbook exists
    const checkETextbookExists = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/check-etextbook/${eTextbookID}`);
            const data = await response.json();
            return data.exists;  // true if exists, false if not
        } catch (error) {
            console.error("Error checking E-Textbook ID:", error);
            return false;
        }
    };

    // Handle form submission based on user choice
    const handleOption = async (option) => {
        if (option === 1 || option === 2) {
            // Validate E-Textbook ID only for modifying actions
            const eTextbookExists = await checkETextbookExists();
            if (!eTextbookExists) {
                setError("E-Textbook ID not found. Please enter a valid ID.");
                return;
            }
        }

        if (option === 1) {
            navigate(`/admin/add-chapter`, { state: { eTextbookID } });
        } else if (option === 2) {
            navigate(`/admin/modify-chapter`, { state: { eTextbookID } });
        } else if (option === 3) {
            // Clear input and Go Back to Admin's previous page
            setETextbookID('');
            navigate(`/dashboard/${role}`);
        } else if (option === 4) {
            navigate(`/dashboard/${role}`);
        }
    };

    return (
        <div>
            <h2>Modify E-Textbook</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Unique E-Textbook ID:</label>
                <input
                    type="text"
                    name="eTextbookID"
                    value={eTextbookID}
                    onChange={handleChange}
                    required
                />
                <h3>Menu</h3>
                <button type="button" onClick={() => handleOption(1)}>
                    Add New Chapter
                </button>
                <button type="button" onClick={() => handleOption(2)}>
                    Modify Chapter
                </button>
                <button type="button" onClick={() => handleOption(3)}>
                    Go Back
                </button>
                <button type="button" onClick={() => handleOption(4)}>
                    Landing Page
                </button>
            </form>
        </div>
    );
}

export default ModifyETextbook;
