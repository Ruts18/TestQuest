import React from 'react';

function Question({
  questionNumber,
  question,
  options,
  selectedOptions,
  inputType,
  onOptionChange,
}) {
  return (
    <div className="question">
      <p>{`${questionNumber}. ${question}`}</p>
      <ol type='a'>
        {options.map((option, index) => (
          <li key={index}>
            <label>
              <input
                type={inputType}
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={(e) => onOptionChange(e, questionNumber - 1)}
              />
              {option}
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Question;
