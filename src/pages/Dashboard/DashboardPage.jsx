import React, { useEffect, useState } from 'react';
import styles from './DashboardPage.module.css';
import {jwtDecode} from "jwt-decode";
import Sidebar from '../../components/Sidebar/Sidebar';
import TrendingQuiz from '../../components/Quiz/TrendingQuiz/TrendingQuiz';
import { fetchTrendingQuizzes, fetchAllQuiz } from '../../api/quiz';

const DashboardPage = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; 
    const[trendingQuiz, setTrendingQuiz] = useState([]);
    const[quizData, setQuizData] = useState([]);
    
    useEffect(()=>{
      fetchTrendingQuizzes(userId, token)
        .then(data => setTrendingQuiz(data))
        .catch(error => console.error("Error fetching trending quizzes: ", error));
    },[userId, token]);
  
    useEffect(()=>{
      fetchAllQuiz(userId, token)
        .then(data => setQuizData(data))
        .catch(error => console.error("Error fetching all quizzes: ", error));
    },[userId, token]);
    
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

export default DashboardPage;
