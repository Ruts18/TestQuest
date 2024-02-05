import React from 'react';

function ResultPopup(props) {
  const { score, resultAs, onClose } = props;

  return (
    <div className="result-popup">
      <div className="popup-content">
        <span className="close-popup" onClick={onClose}>
          &times;
        </span>
        <h2>Your Result</h2>
        <p>Score: {score}</p>
        <p>Student: {resultAs}</p>
      </div>
    </div>
  );
}

export default ResultPopup;
