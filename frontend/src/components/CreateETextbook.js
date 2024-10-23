import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating between pages

function CreateETextbook() {
    const [eTextbook, setETextbook] = useState({
        title: '',
        eTextbookID: ''
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();  // Initialize useNavigate for routing

    // Assume UserID is available in local storage (you can adjust based on your authentication logic)
    const userID = localStorage.getItem('userID');  // Retrieve the UserID from local storage

    // Handle input change
    const handleChange = (e) => {
        setETextbook({ ...eTextbook, [e.target.name]: e.target.value });
    };

    // Handle form submission based on user choice
    const handleOption = async (option) => {
        if (option === 1) {
            // Call the API to create the E-textbook in the database
            try {
                const response = await fetch('http://localhost:5000/api/admin/create-etextbook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: eTextbook.title,
                        eTextbookID: eTextbook.eTextbookID,
                        createdBy: userID   // Add UserID to identify who created the textbook
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('E-Textbook created successfully!');
                    // Redirect to Add New Chapter page, passing the E-textbook ID and title
                    navigate(`/admin/add-chapter`, { state: { eTextbookID: data.eTextbookID, title: eTextbook.title } });
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to create E-textbook');
                }
            } catch (err) {
                setError('Failed to create E-textbook');
            }
        } else if (option === 2) {
            // Discard input and Go Back to Admin's Landing Page
            setETextbook({ title: '', eTextbookID: '' });
            navigate('/dashboard/admin');
        }
    };

    return (
        <div>
            <h2>Create E-Textbook</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Title of the new E-textbook:</label>
                <input
                    type="text"
                    name="title"
                    value={eTextbook.title}
                    onChange={handleChange}
                    required
                />
                <br />
                <label>Unique E-textbook ID:</label>
                <input
                    type="text"
                    name="eTextbookID"
                    value={eTextbook.eTextbookID}
                    onChange={handleChange}
                    required
                />
                <br />
                <h3>Menu</h3>
                <button type="button" onClick={() => handleOption(1)}>
                    Add New Chapter
                </button>
                <br />
                <button type="button" onClick={() => handleOption(2)}>
                    Go Back
                </button>
            </form>
        </div>
    );
}

export default CreateETextbook;