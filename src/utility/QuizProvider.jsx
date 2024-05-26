import { createContext, useState } from "react";

export const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState({
    quizName: "",
    quizType: "",
    optionType: "text",
    questions: [
      {
        questionText: "",
        options: [
          {
            optionText: "",
            optionImage: "",
          },
          {
            optionText: "",
            optionImage: "",
          },
        ],
        correctOptionIndex: null,
      },
    ],
    timer: 0,
  });

  const [quizLinkId, setQuizLinkId] = useState();

  return (
    <QuizContext.Provider value={{ quizData, setQuizData, quizLinkId, setQuizLinkId }}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;
