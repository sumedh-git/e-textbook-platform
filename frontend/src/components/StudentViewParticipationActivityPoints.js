import React, { useState, useEffect } from "react";

function StudentViewParticipationActivityPoints() {
    const studentUserID = localStorage.getItem('userID')
    const [points, setPoints] = useState(null);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);  // State for question count
    const [score, setScore] = useState(0);  // State for total score
    const url = `http://localhost:5000/api/student/get-activity-points?student-user-id=${studentUserID}`
  
    useEffect(() => {
      console.log('Calling')
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setPoints(data);
          calculateScoreAndCount(data);  // Calculate score and question count when data is fetched
      })
        .catch(error => setError(error));
    }, [url]);
  
    const calculateScoreAndCount = (data) => {
      let totalScore = 0;
      let totalQuestions = 0;

      // Recursively calculate score and question count
      const traverseData = (data) => {
          if (typeof data === 'object' && !Array.isArray(data)) {
              Object.entries(data).forEach(([key, value]) => {
                  if (typeof value === 'object') {
                      traverseData(value); // Recurse into nested objects
                  } else {
                      totalQuestions += 1;
                      totalScore += value;  // Assuming the value represents score for that question
                  }
              });
          }
      };

      traverseData(data);  // Start the traversal

      setQuestionCount(totalQuestions);  // Set the number of questions
      setScore(totalScore);  // Set the total score
  };
    if (error) return <p>{error}</p>;

    const renderHierarchy = (data) => {
      if (!data) return <p>Loading</p>;
      return (
        <div>
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              {typeof value === 'object' ? (
                <>
                  <strong>{key}</strong>
                  {renderHierarchy(value)}
                </>
              ) : (
                <>
                  <span>{key}</span>: <span>{value}</span> points
                </>
              )}
            </li>
          ))}
        </ul>
        </div>
      );
    };
  
    return (
      <div>
        {renderHierarchy(points)}
        <p><strong>Total Questions:</strong> {questionCount}</p>
        <p><strong>Total Score:</strong> {score} points</p>      </div>
    );
  };

export default StudentViewParticipationActivityPoints;
