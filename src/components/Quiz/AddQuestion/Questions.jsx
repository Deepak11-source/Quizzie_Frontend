import React, { useContext, useEffect, useState } from 'react'
import styles from './AddQuestion.module.css'
import { useNavigate } from 'react-router-dom'
import { QuizContext } from '../../../utility/QuizProvider';
import { jwtDecode } from "jwt-decode";
import { getQuizById, createQuiz, handleEditQuiz } from '../../../api/quiz';
import useOptions from '../../../hooks/useOptions';
import useQuestions from '../../../hooks/useQuestions';
import deleteIcon from '../../../assets/delete.svg';
import crossIcon from '../../../assets/cross.png';
import { toast } from 'react-toastify';

const Questions = ({ setIsShareQuiz, setIsAddQuestions, setIsCreateQuiz, editQuiz, editId }) => {
    const navigate = useNavigate();
    const QuizState = useContext(QuizContext);
    const { quizData, setQuizData, setQuizLinkId } = QuizState;
    const [currentIndex, setCurrentIndex] = useState(0);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const { updateOptions, handleOptionChange, addOptions, deleteOption } = useOptions();
    const { addQuestion, deleteQuestion, handleQuestionChange, setCorrectOption } = useQuestions();

    useEffect(() => {
        const fetchQuiz = async () => {
          if (editQuiz && editId) {
            try {
              const data = await getQuizById(editId);
              setQuizData({ ...data.quiz });
            } catch (error) {
              console.log("Error fetching quiz data:", error);
            }
          }
        };
        fetchQuiz();
    }, [editQuiz, editId]);

    const handleSubmit = async (isEdit) => {
        for (const question of quizData.questions) {
          if (
            !question?.questionText ||
            !(quizData?.quizType === "Poll" ? 1 : question?.correctOptionIndex) ||
            !question?.options.every((option) => {
              if (quizData.optionType === "text") {
                return option.optionText.trim() !== "";
              } else if (quizData.optionType === "imgurl") {
                return option.optionImage.trim() !== "";
              } else if (quizData.optionType === "text&imgurl") {
                return option.optionText.trim() !== "" && option.optionImage.trim() !== "";
              }
            })
          ) {
            toast.error("All the question fields are required");
            return;
          }
        }
    
        try {
          let response;
          if (isEdit) {
            response = await handleEditQuiz(quizData, editId, token);
          } else {
            response = await createQuiz(quizData, userId, token);
          }
    
          if ((isEdit && response.status === 200) || (!isEdit && response.status === 201)) {
            toast.success(response.message, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setIsShareQuiz(true);
            setIsAddQuestions(false);
            setIsCreateQuiz(false);
            setQuizLinkId(`${import.meta.env.VITE_FRONTEND_URL}/test/${response.quiz._id}`);
          }
        } catch (error) {
          toast.error(error.message);
        }
    };

    const handleSetTimer = (e) => {
        const { name, value } = e.target;
          setQuizData({
            ...quizData,
            [name]: value,
        });
    };

    const addButtonClassName = quizData.quizType === "Q&A" ? styles.addOptionButtonQA : styles.addOptionButtonPollType;

    return (
    <div className={styles.questionContainer} onClick={(e) => {e.stopPropagation()}}>
        <div className={styles.questionButtonsContainer}>
            <div className={styles.buttonsContainer}>
                {quizData.questions.map((question, index) => {
                    return (
                      <div
                        className={`${styles.questionButton} ${currentIndex == index && styles.selectedQuestion}`}
                        id={index}
                        key={index}
                        onClick={(e) => {
                            const id = e.currentTarget.id;
                            setCurrentIndex(id);
                          }}
                      >
                        {index + 1}
                        {index !== 0 && (
                          
                          <img onClick={deleteQuestion} key={index} id={index} className={styles.deleteQuest} src={crossIcon} alt='delete'/>
                            
                        )}
                      </div>
                    );
                })}
                {quizData.questions.length < 5 && (
                    <button className={styles.addQuestionButton} onClick={addQuestion}>
                        +
                    </button>
                )} 
            </div>
            <div className={styles.maxQuestion}>Max 5 questions</div>
        </div>
        <input
            type="text"
            className={styles.questionText}
            placeholder="Question Text"
            name="questionText"
            value={quizData?.questions[currentIndex]?.questionText}
            onChange={handleQuestionChange}
        />
        <div className={styles.optionsContainer}>
            <label>Option Type</label>
            <div className={styles.radioInputContainer}>
              <input type='radio' id='optionType' name='optionType' value='text' onChange={updateOptions} checked={quizData?.optionType == "text"} className={styles.radioInput}/>
              <label htmlFor="optionType">Text</label>
            </div>
            <div className={styles.radioInputContainer}>
              <input type='radio' id='optionType' name='optionType' value='imgurl' onChange={updateOptions} checked={quizData?.optionType == "imgurl"} className={styles.radioInput}/>
              <label htmlFor="optionType">Image Url</label>
            </div>
            <div className={styles.radioInputContainer}>
              <input type='radio' id='optionType' name='optionType' value='text&imgurl' onChange={updateOptions} checked={quizData?.optionType == "text&imgurl"} className={styles.radioInput}/>
              <label htmlFor="optionType">Text & Image Url</label>
            </div>               
        </div>

        <div className={styles.optionsTimer}>
            <div className={styles.options}>
              {quizData?.questions[currentIndex]?.options.map((option, index) => (
                <div key={index} className={styles.optionContainer}>
                  {quizData?.quizType == "Q&A" && (
                    <input
                      type="radio"
                      className={styles.optionRadio}
                      name="correctOptionIndex"
                      id={index}
                      onClick={setCorrectOption}           
                      checked={quizData.questions[currentIndex].correctOptionIndex == index}
                    />
                  )}
                  {(quizData?.optionType == "text" || quizData?.optionType == "text&imgurl") && (
                    <input
                      type="text"
                      value={option.optionText}
                      placeholder="Text"
                      name="optionText"
                      className={ quizData.questions[currentIndex].correctOptionIndex == index ? styles.checkedInputbox : styles.optionInputbox }
                      id={index}
                      onChange={handleOptionChange}
                    />
                  )}
                  {(quizData?.optionType == "imgurl" || quizData?.optionType == "text&imgurl") && (
                    <input
                      type="text"
                      value={option.optionImage}
                      placeholder="Image Url"
                      name="optionImage"
                      className={ quizData.questions[currentIndex].correctOptionIndex == index ? styles.checkedInputbox : styles.optionInputbox }
                      id={index}
                      onChange={handleOptionChange}
                    />
                  )}

                  {quizData?.questions[currentIndex]?.options.length > 2 && index > 1 && (
                    <img
                      src={deleteIcon}
                      alt="delete button"
                      onClick={deleteOption}
                      id={index}
                      className={styles.deleteIcon}
                    />
                  )}
                </div>
              ))}
              {quizData?.questions[currentIndex]?.options.length < 4 && (
                <button
                  onClick={addOptions}
                  className={addButtonClassName}
                >
                  Add Option
                </button>
                )}
            </div>
            {quizData?.quizType == "Q&A" && (
                <div className={styles.timerContainer}>
                  <p>Timer</p>
                  <button name="timer" value={0} className={quizData.timer == 0 ? styles.selectedTimerBtn : styles.timerBtn} onClick={handleSetTimer}>
                    OFF
                  </button>
                  <button name="timer" value={5} className={quizData.timer == 5 ? styles.selectedTimerBtn : styles.timerBtn} onClick={handleSetTimer}>
                    5 sec
                  </button>
                  <button name="timer" value={10} className={quizData.timer == 10 ? styles.selectedTimerBtn : styles.timerBtn} onClick={handleSetTimer}>
                    10 sec
                  </button>
                </div>
            )}
        </div>       
        <div className={styles.actionContainer}>
            <button onClick={() => navigate('/dashboard')} className={styles.cancelButton}>
              Cancel
            </button>
            {!editQuiz ? (
              <button onClick={handleSubmit} className={styles.buttonStyles}>
                Create Quiz
              </button>
            ) : (
              <button onClick={handleSubmit} className={styles.buttonStyles}>
                Edit Quiz
              </button>
            )}
        </div>                
    </div>
  )
}

export default Questions