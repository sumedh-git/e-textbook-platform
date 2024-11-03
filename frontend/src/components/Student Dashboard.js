import React, { useState } from 'react';
const eBooksData = [
    { 
      title: "E-book 1",
      chapters: [
        {
          title: "Chapter 1",
          sections: [
            {
              title: "Section 1",
              blocks: ["Block 1"]
            },
            {
              title: "Section 2",
              blocks: ["Block 2"]
            }
          ]
        },
        {
          title: "Chapter 2",
          sections: [
            {
              title: "Section 1",
              blocks: ["Block 1"]
            }
          ]
        }
      ]
    },
    {
      title: "E-book 2",
      chapters: [
        {
          title: "Chapter 1",
          sections: [
            {
              title: "Section 1",
              blocks: ["Block 1"]
            },
            {
              title: "Section 2",
              blocks: ["Block 2"]
            }
          ]
        },
        {
          title: "Chapter 2",
          sections: [
            {
              title: "Section 1",
              blocks: ["Block 1"]
            }
          ]
        }
      ]
    }
  ];
  
  
// Block Component
const Block = ({ block }) => {
  return <li style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>{block}</li>;
};

// Section Component
const Section = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
      <h4 onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? "▼" : "►"}
      {section.title}
      </h4>
      {isExpanded && (
        <ul>
          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </ul>
      )}
    </div>
  );
};

// Chapter Component
const Chapter = ({ chapter }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
      <h3 onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "▼" : "►"}
        {chapter.title}
      </h3>
      {isExpanded && (
        <div style={{ paddingLeft: "20px" }}>
          {chapter.sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
      )}
    </div>
  );
};

// EBook Component
const EBook = ({ ebook }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.5rem 0" }}>
      <h2 onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "▼" : "►"}
        {ebook.title}
      </h2>
      {isExpanded && (
        <div style={{ paddingLeft: "20px" }}>
          {ebook.chapters.map((chapter, index) => (
            <Chapter key={index} chapter={chapter} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const StudentDashboard = () => {
  return (
    <div>
        <div className="centered-container">
        {eBooksData.map((ebook, index) => (
            <EBook key={index} ebook={ebook} />
        ))}
        </div>
    </div>
  );
};

export default StudentDashboard;
