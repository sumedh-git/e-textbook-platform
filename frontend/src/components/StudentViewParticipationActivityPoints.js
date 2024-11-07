import React, { useState, useEffect } from "react";

function StudentViewParticipationActivityPoints() {
    const studentUserID = localStorage.getItem('userID')
    const [points, setPoints] = useState(null);
    const [error, setError] = useState(null);
    const url = `http://localhost:5000/api/student/get-activity-points?student-user-id=${studentUserID}`
  
    useEffect(() => {
      console.log('Calling')
      fetch(url)
        .then(response => response.json())
        .then(data => setPoints(data))
        .catch(error => setError(error));
    }, [url]);
  
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
      </div>
    );
  };

export default StudentViewParticipationActivityPoints;
