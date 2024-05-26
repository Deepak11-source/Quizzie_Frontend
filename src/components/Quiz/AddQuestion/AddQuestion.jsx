import React, { useContext, useEffect, useState } from 'react'
import styles from './AddQuestion.module.css'
import { useNavigate } from 'react-router-dom'
import { QuizContext } from '../../../utility/QuizProvider';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import deleteIcon from '../../../assets/delete.svg';
import crossIcon from '../../../assets/cross.png';
import { toast } from 'react-toastify';

const AddQuestion = ({ setIsShareQuiz, setIsAddQuestions, setIsCreateQuiz, editQuiz, editId }) => {
    const navigate = useNavigate(); 
    const QuizState = useContext(QuizContext);   
    const { quizData, setQuizData, setQuizLinkId } = QuizState;
    const [currentIndex, setCurrentIndex] = useState(0);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    useEffect(() => {
      console.log("useEffect triggered");    
      (async () => {
        console.log("Inside async function");    
        if (editQuiz && editId) {
          console.log("editQuiz and editId are truthy");    
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/quiz/getQuizByID/${editId}`
            );
            console.log("Quiz data response:", response);    
            if (response.status === 200) {
              console.log("Quiz data fetched successfully");
    
              const data = response.data.quiz;
              console.log("Fetched quiz data:", data);
    
              setQuizData({ ...data });
              console.log("Quiz data set in state:", quizData);
            }
          } catch (error) {
            console.log("Error fetching quiz data:", error);
          }
        } else {
          console.log("editQuiz or editId is falsy, skipping data fetching");
        }
      })();
    }, [editQuiz, editId ]); 
    

    const addQuestion = (e) => {
        e.stopPropagation();
        if (quizData.questions.length < 5) {
          setQuizData((prevData) => ({
            ...prevData,
            questions: [
              ...prevData.questions,
              {
                questionText: "",
                options: [
                  { optionText: "", optionImage: "" },
                  { optionText: "", optionImage: "" },
                ],
                correctOptionIndex: null,
              },
            ],
          }));
        }
    }; 
    
    const deleteQuestion = (e) => {
        e.stopPropagation();
        const index = e.target.id;
        setQuizData((prev) => {
          const newQuestions = [...quizData.questions];
          newQuestions.splice(index, 1);
          return {
            ...prev,
            questions: newQuestions,
          };
        });
        setCurrentIndex(0);
    };

    const handleQuestionChange = (e) => {
        const { value } = e.target;
        setQuizData((prevData) => {
          const newQuestions = [...quizData.questions];
          newQuestions[currentIndex].questionText = value;
          return {
           ...prevData,
            questions: newQuestions,
          };
        })
    };

    const updateOptions = (e) => {
        const { value } = e.target;
        const updatedQuestions = quizData.questions.map((question) => ({
          ...question,
          options: [
            { optionText: "", optionImage: "" },
            { optionText: "", optionImage: "" },
          ],
          correctOptionIndex: null,
        }));
        setQuizData((prevData) => ({
          ...prevData,
          optionType: value,
          questions: updatedQuestions,
        }));
    };

    const handleOptionChange = (e) => {
        const { name, value } = e.target;
        const index = e.target.id;        
        const newQuestions = [...quizData.questions];
        const newOptions = [...newQuestions[currentIndex].options];
        newOptions[index][name] = value;
        newQuestions[currentIndex] = {
          ...newQuestions[currentIndex],
            options: newOptions,
        };
        setQuizData((prevData) => ({
         ...prevData,
          questions: newQuestions,
        }));
    };    
    
    const addOptions = () => {
    setQuizData((prevData) => {
      const updatedQuestions = [...prevData.questions];
      const updatedOptions = [...updatedQuestions[currentIndex].options];
      if(updateOptions.length < 4) {
        updatedQuestions[currentIndex] = {
         ...updatedQuestions[currentIndex],
          options: [
           ...updatedOptions,
            { optionText: "", optionImage: "" },
          ],
        };
      }
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
    };  
    
    const deleteOption = (e) => {
      const index = e.target.id;
      const newQuestions = [...quizData.questions];
      const newOptions = [...newQuestions[currentIndex].options];
      newOptions.splice(index, 1);
      newQuestions[currentIndex] = {
        ...newQuestions[currentIndex],
        options: newOptions,
        correctOptionIndex:null
      };
      setQuizData((prev) => {
        return {
          ...prev,
          questions: newQuestions,
        };
      });
    };

    const setCorrectOption = (e) => {
      console.log("Set Correct Option called");
      const { name } = e.target;
      const index = e.target.id;
      console.log("Index:", index);
      const newQuestions = [...quizData.questions];
      newQuestions[currentIndex] = {
        ...newQuestions[currentIndex],
        [name]: index,
      };
      console.log("New Questions:", newQuestions);
      setQuizData((prev) => {
        console.log("Previous State:", prev);
        return {
          ...prev,
          questions: newQuestions,
        };
      });
    };
        
    const createQuiz = async () => {
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
                return (
                  option.optionText.trim() !== "" &&
                  option.optionImage.trim() !== ""
                );
            }
          })
        ) {
          toast.error("All the question fields are required");
          return;
        }
      }
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/quiz/create`,
            {
              ...quizData,
              createdBy: userId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );   
          if (response.status === 201) {
            toast.success(response.data.message, {
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
            setQuizLinkId(
              `https://quizzie-topaz.vercel.app/test/${response.data.quiz._id}`
            );
            // navigate("/dashboard");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
    };
    
    const handleEditQuiz = async () => {
      for (const question of quizData.questions) {
        if (
          !question?.questionText ||
          (quizData?.quizType == "Q&A" && question?.correctOptionIndex===null) ||
          !question?.options.every((option) => {
            if (quizData.optionType === "text") {
              return option.optionText.trim() !== "";
            } else if (quizData.optionType === "imgurl") {
              return option.optionImage.trim() !== "";
            } else if (quizData.optionType === "text&imgurl") {
              return (
                option.optionText.trim() !== "" &&
                option.optionImage.trim() !== ""
              );
            }
          })
        ) {
          toast.error("All the question fields are required");
          return;
        }
      }
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/quiz/editQuiz/${editId}`,
          quizData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // Handle successful response
        if (response.status == 200) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsCreateQuiz(false);
          setIsAddQuestions(false);
          setIsShareQuiz(true);
          setQuizLinkId(
            `https://quizzie-topaz.vercel.app/test/${response.data.quiz._id}`
          );
        }
      } catch (error) {
        // Handle error
        console.log("Error:", error);
        toast.error(error.message);
      }      
    }
    
    useEffect(() => {
      console.log("Current Index:", currentIndex);
    }, [currentIndex]);    

    const addButtonClassName = quizData.quizType == "Q&A" ? styles.addOptionButtonQA : styles.addOptionButtonPollType;
    
    const handleSetTimer = (e) => {
      const { name, value } = e.target;
        setQuizData({
          ...quizData,
          [name]: value,
        });
    };

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
              <button onClick={createQuiz} className={styles.buttonStyles}>
                Create Quiz
              </button>
            ) : (
              <button onClick={handleEditQuiz} className={styles.buttonStyles}>
                Edit Quiz
              </button>
            )}
        </div>                
    </div>
  )
}

export default AddQuestion
