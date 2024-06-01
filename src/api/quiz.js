import axios from 'axios';

export const fetchTrendingQuizzes = async (userId, token) => {
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/quiz/getTrendingQuizzes?createdBy=${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.filteredQuizzes;
};

export const fetchAllQuiz = async (userId, token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/quiz/getAllQuiz?createdBy=${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.quizzes;
};

export const deleteQuiz = async (id, token) => {
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/quiz/deleteQuiz/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.message;
};

export const fetchQuizDataById = async (quizId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/getQuizByID/${quizId}`);
  return response.data.quiz;
};
