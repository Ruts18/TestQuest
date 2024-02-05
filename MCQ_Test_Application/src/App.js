
import React, { useState, useEffect } from 'react';
import './App.css';
import Question from './components/Questions';
import ResultPopup from './components/ResultPopup';
import * as XLSX from 'xlsx';

function App() {
  const [questionsData, setQuestionsData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const excelFilePath = process.env.PUBLIC_URL + '/mcqtest.xlsx';

    const fetchData = async () => {
      try {
        const response = await fetch(excelFilePath);

        if (!response.ok) {
          throw new Error('Failed to fetch the Excel file');
        }

        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        console.log('Fetched Data:', workbook);

        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log('Parsed Data:', sheetData);

        if (sheetData.length === 0) {
          throw new Error('Excel file is empty or contains no data');
        }

        setQuestionsData(sheetData);
        setSelectedAnswers(Array(sheetData.length).fill([]));
      } catch (error) {
        console.error('Error fetching or parsing Excel data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    const score = calculateScore();
    console.log('Score: ' + score);
    setShowResult(true);
  };

  const handleOptionChange = (event, questionIndex) => {
    const { value, checked } = event.target;
  
    setSelectedAnswers((prevSelectedAnswers) => {
      const updatedAnswers = [...prevSelectedAnswers];
  
      if (checked) {
        if (questionsData[questionIndex].type === 'single') {
          updatedAnswers[questionIndex] = [value];
        } else {
          updatedAnswers[questionIndex] = [
            ...(updatedAnswers[questionIndex] || []),
            value,
          ];
        }
      } else {
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (option) => option !== value
        );
      }
  
      return updatedAnswers;
    });
  };
  

  const calculateScore = () => {
    let score = 0;
    questionsData.forEach((question, index) => {
      const userAnswers = selectedAnswers[index];
      console.log("userAnswers: " + userAnswers);
      const correctAnswers = question.Answer.split(',');
      console.log("correctAnswers: " + correctAnswers);
  
      const userAnswerKeys = [];
      for (const key in question) {
        if (userAnswers.includes(question[key])) {
          userAnswerKeys.push(key);
        }
      }
        const isCorrect = correctAnswers.every((correctAnswer) =>
        userAnswerKeys.includes(correctAnswer)
      );
  
      if (isCorrect) {
        const numCorrectAnswers = correctAnswers.length;
        score += numCorrectAnswers * 5;
      }
    });
    console.log(`Total Score: ${score}`);
    return score;
  };
  

  const calculateStudentResult = (score) => {
    const totalScore = questionsData.reduce(
      (total, question) => total + question.Answer.split(',').length * 5,
      0
    );
    const result = score > totalScore / 2 ? 'Pass' : 'Failed';
    console.log('You Are: ' + result);
    return result;
  };

  const closeResultPopup = () => {
    setShowResult(false);
    setSelectedAnswers(Array(questionsData.length).fill([]));
  };

  return (
        <div className="container">
        <h1>MCQ Test</h1>
        {questionsData.map((question, index) => (
          <Question
            key={index}
            questionNumber={index + 1}
            question={question.Questions}
            options={[
              question.Option1,
              question.Option2,
              question.Option3,
              question.Option4,
            ]}
            selectedOptions={selectedAnswers[index]}
            inputType={question.type === 'single' ? 'radio' : 'checkbox'}
            onOptionChange={(e) => handleOptionChange(e, index)}
          />
        ))}
        <div className="submit-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {showResult && (
          <ResultPopup
            score={calculateScore()}
            resultAs={calculateStudentResult(calculateScore())}
            onClose={closeResultPopup}
          />
        )}
      </div>
  );
}

export default App;
