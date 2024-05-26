import React, { useContext } from 'react'
import styles from './CreateQuiz.module.css'
import { QuizContext } from '../../../utility/QuizProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateQuiz = ({ setIsCreateQuiz, setIsAddQuestions }) => {
    const navigate = useNavigate();
    const { quizData, setQuizData } = useContext(QuizContext);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuizData({...quizData, [name]: value });
    };

    const handleContinueClick = () => {
        if(quizData.quizName && quizData.quizType){
            setIsCreateQuiz(false);
            setIsAddQuestions(true);
        }else{
            toast.error('Please fill all the fields');
        }
    }
  return (
    <div className={styles.createQuizContainer} onClick={(e) => e.stopPropagation()}>
        <input type='text' placeholder='Quiz Name' name='quizName' value={quizData.quizName || ""} onChange={handleInputChange} className={styles.quizNameInputBox}/>
        <div className={styles.quizType}>
            <label htmlFor="quizType">Quiz Type</label>
            <button id="quizType" name="quizType" value="Q&A" onClick={handleInputChange} className={quizData.quizType == "Q&A" ? styles.active : styles.notActive}>Q & A</button>
            <button id="quizType" name="quizType" value="Poll" onClick={handleInputChange}  className={quizData.quizType == "Poll" ? styles.active : styles.notActive}>Poll Type</button>
        </div>
        <div className={styles.buttonContainer}>
            <button className={styles.cancelBtn} onClick={() => navigate('/dashboard')}>Cancel</button>
            <button className={styles.continueBtn} onClick={handleContinueClick}>Continue</button>
        </div>
    </div>
  )
}

export default CreateQuiz