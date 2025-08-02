import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [questionSets, setQuestionSets] = useState([]);
  const [currentSet, setCurrentSet] = useState(null);
  const [currentSetName, setCurrentSetName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelections, setUserSelections] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [wrongAnswers, setWrongAnswers] = useState({});

  // Load available question sets on component mount
  useEffect(() => {
    const loadQuestionSets = () => {
      // In a real app, we would fetch these dynamically
      // For this demo, we'll hardcode the available sets
      const sets = ["Regulations", "Operations", "LoadingAndPerformance", "Airspace", "Weather", "SampleTest"];
      setQuestionSets(sets);
      setLoading(false);
    };
    loadQuestionSets();
    loadUserSelections();
    loadWrongAnswers();
  }, []);

  // Load the first question set when component is ready
  useEffect(() => {
    if (!loading && questionSets.length > 0 && Object.keys(userSelections).length >= 0) {
      loadQuestionSet(questionSets[0]);
    }
  }, [loading, questionSets]);

  // Load user selections from localStorage
  const loadUserSelections = () => {
    try {
      const saved = localStorage.getItem("answerCheckerSelections");
      if (saved) {
        setUserSelections(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading user selections:", error);
      setUserSelections({});
    }
  };

  // Load wrong answers from localStorage
  const loadWrongAnswers = () => {
    try {
      const saved = localStorage.getItem("answerCheckerWrongAnswers");
      if (saved) {
        setWrongAnswers(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading wrong answers:", error);
      setWrongAnswers({});
    }
  };

  // Save user selections to localStorage
  const saveUserSelections = (selections) => {
    try {
      localStorage.setItem("answerCheckerSelections", JSON.stringify(selections));
    } catch (error) {
      console.error("Error saving user selections:", error);
    }
  };

  // Save wrong answers to localStorage
  const saveWrongAnswers = (wrongAnswers) => {
    try {
      localStorage.setItem("answerCheckerWrongAnswers", JSON.stringify(wrongAnswers));
    } catch (error) {
      console.error("Error saving wrong answers:", error);
    }
  };

  // Delete a wrong answer entry
  const handleDeleteWrongAnswer = (key) => {
    const newWrongAnswers = { ...wrongAnswers };
    delete newWrongAnswers[key];
    setWrongAnswers(newWrongAnswers);
    saveWrongAnswers(newWrongAnswers);
  };

  // Reset user selections for the current question set
  const resetCurrentSetSelections = () => {
    if (!currentSetName || !currentSet) return;

    // Create a new selections object without entries for the current set
    const newSelections = { ...userSelections };
    currentSet.answers.forEach(question => {
      const selectionKey = `${currentSetName}-${question.seq}`;
      delete newSelections[selectionKey];
    });

    // Update state and localStorage
    setUserSelections(newSelections);
    saveUserSelections(newSelections);

    // Reset UI for current question
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setExplanation('');
  };

  // Load a specific question set
  const loadQuestionSet = async (setName) => {
    try {
      const response = await fetch(`/data/${setName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${setName}.json`);
      }

      const data = await response.json();
      setCurrentSet(data);
      setCurrentSetName(setName);
      setCurrentQuestionIndex(0);
      setShowResult(false);
      
      // Check if user has already selected an answer for this question
      const selectionKey = `${setName}-${data.answers[0].seq}`;
      if (userSelections[selectionKey]) {
        setSelectedOption(userSelections[selectionKey]);
      } else {
        setSelectedOption(null);
      }
    } catch (error) {
      console.error(`Error loading question set ${setName}:`, error);
      alert(`Failed to load question set: ${error.message}`);
    }
  };

  // Handle question set change
  const handleSetChange = (e) => {
    const selectedSet = e.target.value;
    if (selectedSet) {
      loadQuestionSet(selectedSet);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowResult(false);
    
    // Save selection immediately
    if (currentSet && currentSet.answers.length > 0) {
      const currentQuestion = currentSet.answers[currentQuestionIndex];
      
      const newSelections = {
        ...userSelections,
        [`${currentSetName}-${currentQuestion.seq}`]: option
      };
      
      setUserSelections(newSelections);
      saveUserSelections(newSelections);
    }
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentSet || currentSet.answers.length === 0 || !selectedOption) return;

    const currentQuestion = currentSet.answers[currentQuestionIndex];
    const userAnswer = selectedOption;
    const correct = userAnswer === currentQuestion.answer;

    setIsCorrect(correct);
    setExplanation(currentQuestion.explanation);
    setShowResult(true);

    // Record wrong answers
    if (!correct) {
      const wrongAnswerKey = `${currentSetName}-${currentQuestion.seq}`;
      const newWrongAnswers = {
        ...wrongAnswers,
        [wrongAnswerKey]: {
          seq: currentQuestion.seq,
          question: currentQuestion.question,
          userAnswer,
          correctAnswer: currentQuestion.answer,
          explanation: currentQuestion.explanation
        }
      };
      setWrongAnswers(newWrongAnswers);
      saveWrongAnswers(newWrongAnswers);
    }
  };

  // Navigate to previous question
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setShowResult(false);
      
      // Check if user has already selected an answer for this question
      const currentQuestion = currentSet.answers[newIndex];
      const selectionKey = `${currentSetName}-${currentQuestion.seq}`;
      if (userSelections[selectionKey]) {
        setSelectedOption(userSelections[selectionKey]);
      } else {
        setSelectedOption(null);
      }
    }
  };

  // Navigate to next question
  const goToNext = () => {
    if (currentSet && currentQuestionIndex < currentSet.answers.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setShowResult(false);
      
      // Check if user has already selected an answer for this question
      const currentQuestion = currentSet.answers[newIndex];
      const selectionKey = `${currentSetName}-${currentQuestion.seq}`;
      if (userSelections[selectionKey]) {
        setSelectedOption(userSelections[selectionKey]);
      } else {
        setSelectedOption(null);
      }
    }
  };

  // Get current question
  const currentQuestion = currentSet && currentSet.answers.length > 0 
    ? currentSet.answers[currentQuestionIndex] 
    : null;

  return (
    <div className="container">
      <header>
        <h1>Answer Checker</h1>
        <div className="controls">
          <label htmlFor="questionSet">Select Question Set:</label>
          <select id="questionSet" onChange={handleSetChange} value={currentSetName} disabled={loading || questionSets.length === 0}>
            {loading || questionSets.length === 0 ? (
              <option value="">Loading...</option>
            ) : (
              questionSets.map((set) => (
                <option key={set} value={set}>
                  {`${set}`}
                </option>
              ))
            )}
          </select>
          <button 
            id="resetBtn" 
            className="btn"
            onClick={resetCurrentSetSelections}
          >
            Reset Selections
          </button>
        </div>
      </header>

      <main>
        {currentQuestion && (
          <div className="question-container">
            <div className="question-header">
              <h2 id="questionNumber">{`Question ${currentQuestion.seq}`}</h2>
              <div className="progress">
                <span id="progressText">{`${currentQuestion.seq}/${currentSet.answers.length}`}</span>
              </div>
            </div>

            <div className="options">
              {['A', 'B', 'C'].map((option) => (
                <button
                  key={option}
                  className={`option ${selectedOption === option ? 'selected' : ''} ${
                    showResult && option === currentQuestion.answer ? 'correct' : ''
                  } ${
                    showResult && selectedOption === option && option !== currentQuestion.answer ? 'incorrect' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="actions">
              <button 
                id="checkBtn" 
                className="btn" 
                onClick={checkAnswer}
                disabled={!selectedOption}
              >
                Check Answer
              </button>
            </div>

            {showResult && (
              <div id="result" className="result">
                <div 
                  id="answerStatus" 
                  className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <div id="explanation" className="explanation">
                  {explanation}
                </div>
              </div>
            )}

            <div className="navigation">
              <button 
                id="prevBtn" 
                className="btn" 
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button 
                id="nextBtn" 
                className="btn" 
                onClick={goToNext}
                disabled={!currentSet || currentQuestionIndex === currentSet.answers.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Wrong Answers Section */}
      <div className="wrong-answers-section">
        <h2>Wrong Answers Review</h2>
        {Object.keys(wrongAnswers).length > 0 ? (
          <div className="wrong-answers-list">
            {Object.entries(wrongAnswers)
              .filter(([key]) => key.startsWith(currentSetName))
              .map(([key, wrongAnswer]) => (
                <div key={key} className="wrong-answer-item">
                  <div className="wrong-answer-header">
                    <h3>Question {wrongAnswer.seq}</h3>
                    <button 
                      className="delete-wrong-answer" 
                      onClick={() => handleDeleteWrongAnswer(key)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="wrong-answer-question">
                    <strong>Question:</strong> {wrongAnswer.question}
                  </div>
                  <div className="wrong-answer-details">
                    <span className="your-answer">Your answer: {wrongAnswer.userAnswer}</span>
                    <span className="correct-answer">Correct answer: {wrongAnswer.correctAnswer}</span>
                  </div>
                  <div className="wrong-answer-explanation">
                    <strong>Explanation:</strong> {wrongAnswer.explanation}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-wrong-answers">No wrong answers recorded yet for this question set.</p>
        )}
      </div>
    </div>
  );
}

export default App;
