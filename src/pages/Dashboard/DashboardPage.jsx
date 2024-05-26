import React, { useEffect, useState } from 'react'
import styles from './DashboardPage.module.css'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import Sidebar from '../../components/Sidebar/Sidebar'
import TrendingQuiz from '../../components/Quiz/TrendingQuiz/TrendingQuiz'


const DashboardPage = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; 
    const[trendingQuiz, setTrendingQuiz] = useState([]);
    const[quizData, setQuizData] = useState([]);
    
    useEffect(()=>{
      fetchTrendingQuizzes();
    },[token]);
  
    const fetchTrendingQuizzes = async () => {
      try {
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
        setTrendingQuiz(response.data.filteredQuizzes);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(()=>{
      fetchAllQuiz();
    },[token]);
    
    const fetchAllQuiz = async () => {
      try {
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
        setQuizData(response.data.quizzes);
      } catch (error) {
        console.log(error);
      }
    }
  
    const totalNumberOfQuestions = quizData.reduce(
      (accumulator, quiz) => accumulator + quiz.questions.length,
      0
    );
    
    const totalNumberOfImpressions = quizData.reduce(
      (accumulator, quiz) => accumulator + quiz.impression,
      0
    );
  
    return (
      <div className={styles.parentContainer}>
          <Sidebar activeTabKey='dashboard'/>
          <div className={styles.dashboardContainer}>
            <div className={styles.quizContainer}>              
              
              <div className={styles.quizData}>
                <p>
                  <span className={styles.number}>{quizData.length}</span>
                  <span className={styles.text}>Quiz Created</span>
                </p>               
              </div>

              <div className={styles.questionData}> 
                <p>
                  <span className={styles.number}>{totalNumberOfQuestions}</span>
                  <span className={styles.text}>Question Created</span>
                </p>
              </div>

              <div className={styles.impressionData}> 
                <p>
                  <span className={styles.number}>{totalNumberOfImpressions >= 1000 
                  ? `${(totalNumberOfImpressions / 1000).toFixed(1)}K` 
                  : totalNumberOfImpressions}</span>
                  <span className={styles.text}>Total Impressions</span>
                </p>
              </div>
            </div>
            <div className={styles.trendingQuizContainer}>
              <div className={styles.trendingQuizHeader}>Trending Quizs</div>
              <div className={styles.trendingQuiz}>
                {trendingQuiz && trendingQuiz.map((item, index) => (
                  <TrendingQuiz
                    key={index}
                    quizName={item.quizName}
                    impression={item.impression}
                    createdAt={item.createdAt}
                  />
                ))}
              </div>           
            </div>
          </div>
      </div>
    )
}

export default DashboardPage