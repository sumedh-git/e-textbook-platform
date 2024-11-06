import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function TAModifySection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eTextbookID, chapterID } = location.state || {};
  const [sectionID, setSectionID] = useState("");

  const [error, setError] = useState(null); // State for error messages

  const role = localStorage.getItem("role");

  // Handle input changes and reset error when input changes
  const handleChange = (e) => setSectionID(e.target.value);

  // Function to check if section exists
  const checkSectionExists = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/check-section/${eTextbookID}/${chapterID}/${sectionID}`
      );
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking section:", error);
      return false;
    }
  };

  const handleOption = async (option) => {
    // Only validate for actions that modify or add content blocks
    if (option === 1 || option === 2 || option === 3 || option === 4) {
      const sectionExists = await checkSectionExists();
      if (!sectionExists) {
        setError(
          "Please enter valid E-Textbook ID, Chapter ID, and Section ID."
        );
        return;
      }
    }

    // Navigate based on user option
    if (option === 1) {
      navigate(`/${role}/add-content-block-selection`, {
        state: { eTextbookID, chapterID, sectionID },
      });
    } else if (option === 2) {
      navigate(`/${role}/modify-content-block`, {
        state: { eTextbookID, chapterID, sectionID },
      });
    } else if (option === 3) {
      navigate("/ta/modify-chapter");
    }
  };

  return (
    <div>
      <h2>Modify Section</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form>
        <label>Section Number:</label>
        <input
          type="text"
          name="sectionID"
          value={sectionID}
          onChange={handleChange}
          required
        />
        <br />

        <h3>Menu</h3>
        <button type="button" onClick={() => handleOption(1)}>
          Add New Content Block
        </button>
        <button type="button" onClick={() => handleOption(2)}>
          Modify Content Block
        </button>
        <button type="button" onClick={() => handleOption(3)}>
          Go Back
        </button>
      </form>
    </div>
  );
}

export default TAModifySection;
