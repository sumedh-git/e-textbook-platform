import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AddQuestion() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eTextbookID, chapterID, sectionID, contentBlockID, activityID } = location.state || {};

    const [questionID, setQuestionID] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
    ]);
    const [answer, setAnswer] = useState(''); // Field for correct answer (1-4)
    const [error, setError] = useState(null);

    const userID = localStorage.getItem('userID');
    const role = localStorage.getItem('role');

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = async () => {
        // Validate that all fields are completed
        if (!questionID || !questionText || options.some(option => !option.text || !option.explanation)) {
            setError('Please complete all fields.');
            return;
        }

        const correctOptionIndex = parseInt(answer) - 1; // Convert answer to zero-based index for validation
        if (isNaN(correctOptionIndex) || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
            setError('Please enter a valid option number (1-4) for the correct answer.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/add-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eTextbookID,
                    chapterID,
                    sectionID,
                    contentBlockID,
                    blockType: 'activity',
                    content: activityID,
                    activityID,
                    questionID,
                    questionText,
                    options,
                    answerIdx: parseInt(answer),  // Use the answer directly as 1-based index
                    createdBy: userID
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Question and activity added successfully!');
                navigate(-1);  // Go back to Add Activity page
            } else {
                setError(data.error || 'Failed to add question');
            }
        } catch (error) {
            console.error("Error:", error);
            setError('An error occurred while adding the question');
        }
    };

    return (
        <div>
            <h2>Add Question to Activity {activityID}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form>
                <label>Question ID:</label>
                <input
                    type="text"
                    value={questionID}
                    onChange={(e) => setQuestionID(e.target.value)}
                    required
                />
                <br />

                <label>Question Text:</label>
                <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
                <br />

                {options.map((option, index) => (
                    <div key={index}>
                        <label>Option {index + 1} Text:</label>
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                            required
                        />
                        <br />
                        <label>Option {index + 1} Explanation:</label>
                        <input
                            type="text"
                            value={option.explanation}
                            onChange={(e) => handleOptionChange(index, 'explanation', e.target.value)}
                            required
                        />
                        <br />
                    </div>
                ))}

                <label>Answer (Enter option number 1-4):</label>
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />
                <br />

                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                <button type="button" onClick={() => navigate(`/dashboard/${role}`)}>Landing Page</button>
            </form>
        </div>
    );
}

export default AddQuestion;
