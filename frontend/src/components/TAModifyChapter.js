import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function TAModifyChapter() {
  const [chapterID, setChapterID] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { eTextbookID } = location.state || {};

  const handleChange = (e) => setChapterID(e.target.value);

  const role = localStorage.getItem("role");

  const checkChapterExists = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/check-chapter/${eTextbookID}/${chapterID}`
      );
      const data = await response.json();
      return data.exists; // true if exists, false if not
    } catch (error) {
      console.error("Error checking Chapter ID:", error);
      return false;
    }
  };

  const handleOption = async (option) => {
    if (option === 1 || option === 2) {
      // Validate E-Textbook ID only for modifying actions
      const chapterExists = await checkChapterExists();
      if (!chapterExists) {
        setError("Chapter ID not found. Please enter a valid ID.");
        return;
      }
    }

    if (option === 1) {
      navigate(`/${role}/add-section`, { state: { eTextbookID, chapterID } });
    } else if (option === 2) {
      navigate(`/${role}/modify-section`, {
        state: { eTextbookID, chapterID },
      });
    } else if (option === 3) {
      navigate(-1);
    }
  };

  return (
    <div>
      <h2>Modify Chapter</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form>
        <label>Unique Chapter ID:</label>
        <input type="text" value={chapterID} onChange={handleChange} required />
        <h3>Menu</h3>
        <button type="button" onClick={() => handleOption(1)}>
          Add New Section
        </button>
        <button type="button" onClick={() => handleOption(2)}>
          Modify Section
        </button>
        <button type="button" onClick={() => handleOption(3)}>
          Go Back
        </button>
      </form>
    </div>
  );
}

export default TAModifyChapter;
