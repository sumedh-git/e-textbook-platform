import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ModifyQuestion() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eTextbookID, chapterID, sectionID, contentBlockID, activityID } = location.state || {};

    const [questionID, setQuestionID] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { text: '', explanation: '', isCorrect: false },
        { text: '', explanation: '', isCorrect: false },
        { text: '', explanation: '', isCorrect: false },
        { text: '', explanation: '', isCorrect: false },
    ]);
    const [error, setError] = useState(null);

    const userID = localStorage.getItem('userID');

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = async () => {
        if (!questionID || !questionText || options.some(option => !option.text || !option.explanation)) {
            setError('Please complete all fields.');
            return;
        }

        const correctOptionIndex = options.findIndex(option => option.isCorrect);
        if (correctOptionIndex === -1 || options.filter(option => option.isCorrect).length !== 1) {
            setError('Please mark exactly one option as correct.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/modify-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eTextbookID,
                    chapterID,
                    sectionID,
                    contentBlockID,
                    blockType : 'activity',
                    content: activityID,
                    activityID,
                    questionID,
                    questionText,
                    options,
                    answerIdx: correctOptionIndex + 1,  // Send the correct option index as a 1-based index
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
                        <label>Is Correct:</label>
                        <input
                            type="radio"
                            checked={option.isCorrect}
                            onChange={() => {
                                const updatedOptions = options.map((opt, optIndex) =>
                                    ({ ...opt, isCorrect: optIndex === index })
                                );
                                setOptions(updatedOptions);
                            }}
                        />
                        <br />
                    </div>
                ))}

                <button type="button" onClick={handleSubmit}>Save</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                <button type="button" onClick={() => navigate('/dashboard/admin')}>Landing Page</button>
            </form>
        </div>
    );
}

export default ModifyQuestion;