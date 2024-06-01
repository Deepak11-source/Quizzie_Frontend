import React, { useEffect, useState } from 'react'
import styles from './QuizChallenge.module.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import trophy from '../../../assets/trophy.png'
import Timer from '../../../components/Timer/Timer';
import Loader from '../../../assets/Loader.gif';

const QuizChallenge = () => {
  const [quizId, setQuizId] = useState(null);
  const [quizData, setQuizData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResult, setQuizResult] = useState(false);
  const [quizTimer, setQuizTimer] = useState(true);
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(id) {
      setQuizId(id);
      fetchQuizData(id);
      handleImpression(id);
    }
  }, [id]);

  useEffect(()=>{
    if(quizData?.timer) {
      if(currentIndex === quizQuestions.length) {
        clearInterval(quizInterval);
      }
      const quizInterval = setInterval(() =>{
        nextQuestion();
      }, quizData.timer * 1000);
      return () => clearInterval(quizInterval);
    }
  })

  const fetchQuizData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/getQuizByID/${id}`);      
      setQuizData(response.data.quiz);
      setQuizQuestions(response.data.quiz.questions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); 
    }
  }

  const handleImpression = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/quiz/increaseImpressions/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  const nextQuestion = async () => {
    setQuizTimer(false);
    if(quizData.quizType == "Q&A") {
      if(selectedOption == quizQuestions[currentIndex].correctOptionIndex) {
        const newQuestion = [...quizQuestions];
        newQuestion[currentIndex].attempt = quizQuestions[currentIndex].attempt + 1;
        newQuestion[currentIndex].correct = quizQuestions[currentIndex].correct + 1;
        await setQuizQuestions(newQuestion);
        await setQuizScore(prev => prev + 1);
      }
    }
    if(quizData.quizType == "Poll") {
      if(selectedOption == 0 || selectedOption) {
        const newQuestion = [...quizQuestions];
        newQuestion[currentIndex].options[selectedOption].count = quizQuestions[currentIndex].options[selectedOption].count + 1;
        await setQuizQuestions(newQuestion);
        console.log('Option count after increment:', newQuestion[currentIndex].options[selectedOption].count);
      } else {
        console.log('Invalid selectedOption:', selectedOption);
      }
    } else {
      console.log('selectedOption is null');
    }
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/quiz/increaseAttemptsAndCounts/${quizId}`,
        quizQuestions
      );
    } catch (error) {
      console.log(error);
    }
    if(currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if(currentIndex == quizQuestions.length - 1) {
      setQuizResult(true);
    }
    setSelectedOption(null);
    setQuizTimer(true);
  };
  
  const handleOptions = (e) => {
    const { id } = e.target;
    const selectedIdx = parseInt(id, 10);
    console.log('Option clicked:', selectedIdx);
    console.log('Selected option before change:', selectedOption);
    if(selectedOption == selectedIdx) {
      setSelectedOption(null);
      console.log('Deselected option:', selectedIdx);
    } else {
      setSelectedOption(selectedIdx);
      console.log('Newly selected option:', selectedIdx);
    }
    console.log('Selected option after change:', selectedOption === selectedIdx ? null : selectedIdx);
  }

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <img src={Loader} alt='Loading' className={styles.loader}/>
    ) : (
      <>
      {!quizResult && (
        <div className={styles.quizContainer}>        
          <div className={styles.quizHeader}>
            <p className={styles.questionLength}>0{currentIndex+1}/0{quizQuestions?.length}</p>
            {(quizData.timer && quizTimer) ? (<p className={styles.timerInfo}><Timer timer={quizData.timer}/>s</p>) : null}
          </div>        
          <div className={styles.quizQuestions}>
            <div>{quizQuestions[currentIndex]?.questionText}</div>
          </div>        
          <div className={styles.quizOptions}>
            {quizData?.optionType =="text&imgurl" &&  quizQuestions[currentIndex]?.options?.map((option, index) => {
              return (
                <div className={`${styles.optionTextImg} ${selectedOption == index && styles.highlightOption}`} key={index} onClick={handleOptions} id={index}>
                  <div id={index}>{option.optionText}</div>
                  <img src={option.optionImage} alt="option" />                
                </div>
              )
            })}
            {quizData?.optionType =="text" &&  quizQuestions[currentIndex]?.options?.map((option, index) => {
              return (
                <div className={`${styles.optionText} ${selectedOption == index && styles.highlightOption}`} key={index} onClick={handleOptions} id={index}>
                  <div id={index}>{option.optionText}</div>             
                </div>
              )
            })}
            {quizData?.optionType =="imgurl" &&  quizQuestions[currentIndex]?.options?.map((option, index) => {
              return (
                <div className={`${styles.optionImg} ${selectedOption == index && styles.highlightOption}`} key={index} onClick={handleOptions} id={index}>
                  <img id={index} src={option.optionImage} alt='optionImage'/>             
                </div>
              )
            })}
          </div>
          <div className={styles.quizAction}>
            <button onClick={nextQuestion}>{currentIndex == quizQuestions.length - 1 ? "Submit" : "Next"}</button>
          </div>
      </div>      
      )}
      {quizResult && quizData.quizType == "Poll" && (
        <div className={styles.pollResult}>
          <div>Thank you <br/> for participating in Poll</div>
        </div>
      )}
      {quizResult && quizData.quizType == "Q&A" && (
        <div className={styles.QAResult}>
          <div>
            <p>Congrats Quiz is completed</p>
            <img src={trophy}  alt='trophy'/>
            <p>Your score is {" "}<span className={styles.finalScore}>0{quizScore}/0{quizQuestions.length}</span></p>
          </div>          
        </div>
      )}
      </>
    )}         
    </div>
  )
}

export default QuizChallenge