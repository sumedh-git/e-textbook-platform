import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function StudentViewContentBlocks() {
  const navigate = useNavigate();

  const location = useLocation();
  const studentUserID = localStorage.getItem('userID');
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const eTextbookID = queryParams.get('eTextBook-id');
  const chapterID = queryParams.get('chapter-id');
  const sectionID = queryParams.get('section-id');

  const [contentBlocks, setContentBlocks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activityContent, setActivityContent]  = useState({});

  const updateScore = async () => {
    try {
      const url= `http://localhost:5000/api/student/update-activity-points?student-user-id=${studentUserID}&eTextBook-id=${eTextbookID}&chapter-id=${chapterID}&section-id=${sectionID}&block-id=${contentBlocks[currentIndex].blockID}&activity-id=${contentBlocks[currentIndex].content}&question-id=${activityContent["QuestionID"]}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentUserID: localStorage.getItem('userID')}),
      });
      const data = await response.status;
      console.log('Score updated:', data);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleNext = () => {
    // Check to avoid exceeding the array length
    if (currentIndex < contentBlocks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }else{
      navigate('/dashboard/student')
    }
  };

  useEffect(() => {
    const url = `http://localhost:5000/api/student/content-blocks?student-user-id=${studentUserID}&eTextBook-id=${eTextbookID}&chapter-id=${chapterID}&section-id=${sectionID}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array, otherwise default to an empty array
        setContentBlocks(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error('Error fetching content blocks:', error));
  }, [studentUserID, eTextbookID, chapterID, sectionID]);

  useEffect(() => {
    if (contentBlocks[currentIndex]?.type === 'activity') {
      const activityID = contentBlocks[currentIndex].content; 
      const blockID = contentBlocks[currentIndex].blockID

      fetch(`http://localhost:5000/api/student/question?activity-id=${activityID}&eTextBook-id=${eTextbookID}&chapter-id=${chapterID}&section-id=${sectionID}&block-id=${blockID}`)
        .then(response => response.json())
        .then(data => setActivityContent(data))
        .catch(error => console.error('Error fetching activity questions:', error));
    }
  }, [contentBlocks, currentIndex, eTextbookID, chapterID, sectionID]);

  const [selectedOption, setSelectedOption] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    let explanationText = '';
    let isCorrectAnswer = false;

    switch (selectedOption) {
      case '1':
        explanationText = activityContent.Option1Explanation;
        if(activityContent["AnswerIdx"]===1){
          isCorrectAnswer = activityContent.AnswerIdx === 1;
        }
        break;
      case '2':
        explanationText = activityContent.Option2Explanation;
        isCorrectAnswer = activityContent.AnswerIdx === 2;
        break;
      case '3':
        explanationText = activityContent.Option3Explanation;
        isCorrectAnswer = activityContent.AnswerIdx === 3;
        break;
      case '4':
        explanationText = activityContent.Option4Explanation;
        isCorrectAnswer = activityContent.AnswerIdx === 4;
        break;
      default:
        explanationText = 'Please select a valid option.';
    }
    setExplanation(explanationText);
    if (isCorrectAnswer) {
      updateScore();
    }
  };


  return (
    <div>
      <h1>Content Blocks</h1>
      {contentBlocks.length > 0 ? (
        <div className='content-block'>
            <p><strong>Block ID:</strong>{contentBlocks[currentIndex].blockID}</p>
            <p><strong>Type:</strong>{contentBlocks[currentIndex].type}</p>
            {/* {if contentBlocks[currentIndex].type == "text"} */}
            <p><strong>Content:</strong>{contentBlocks[currentIndex].content}</p>

            {contentBlocks[currentIndex].type === "activity" && activityContent !== null && (
              <div>
                <strong>{activityContent['QuestionID']}:{activityContent['QuestionText']} </strong>
                <p>Option1:  {activityContent['Option1']}</p>
                <p>Option2:  {activityContent['Option2']}</p>
                <p>Option3:  {activityContent['Option3']}</p>
                <p>Option4:  {activityContent['Option4']}</p>

                <div>
                <label>
                  Enter your option (1-4):
                  <input
                    type="text"
                    value={selectedOption}
                    onChange={handleOptionChange}
                  />
                </label>
                <button onClick={handleSubmit}>Submit</button>
              </div>

              {explanation && (
                <div>
                  <p>{explanation}</p>
                </div>
              )}
            </div>
            )}
          </div>
  
      ) : (
        <p>No content blocks available.</p>
      )}
      <button onClick={handleNext} className="button">
        Next
      </button>
      <br></br>
      <div>
      <button onClick={() => navigate(-1)} className="button">
        Go Back
      </button>
      </div>
    </div>
  );
}

export default StudentViewContentBlocks;
