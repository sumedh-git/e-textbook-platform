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

  const handleNext = () => {
    // Check to avoid exceeding the array length
    if (currentIndex < contentBlocks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }else{
      navigate('/dashboard/student')
    }
  };

  useEffect(() => {
    console.log("API call initiated");
    const url = `http://localhost:5000/api/student/content-blocks?student-user-id=${studentUserID}&eTextBook-id=${eTextbookID}&chapter-id=${chapterID}&section-id=${sectionID}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array, otherwise default to an empty array
        setContentBlocks(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error('Error fetching content blocks:', error));
  }, [studentUserID, eTextbookID, chapterID, sectionID]);

  return (
    <div>
      <h1>Content Blocks</h1>
      {contentBlocks.length > 0 ? (
        <div clasName='content-block'>
            <p><strong>Block ID:</strong>{contentBlocks[currentIndex].blockID}</p>
            <p><strong>Type:</strong>{contentBlocks[currentIndex].type}</p>
            {/* {if contentBlocks[currentIndex].type == "text"} */}
            <p><strong>Content:</strong>{contentBlocks[currentIndex].content}</p>
          </div>
  
      ) : (
        <p>No content blocks available.</p>
      )}
      <button onClick={handleNext} >
        Next
      </button>
      <br></br>
      <div>
      <button onClick={() => navigate(-1)} >
        Go Back
      </button>
      </div>
    </div>
  );
}

export default StudentViewContentBlocks;
