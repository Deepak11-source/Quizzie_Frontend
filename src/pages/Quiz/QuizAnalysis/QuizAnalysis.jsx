import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Poll from '../../../components/Quiz/Analysis/Poll';
import QA from '../../../components/Quiz/Analysis/QA';
import styles from './QuizAnalysis.module.css';
import { fetchQuizDataById } from '../../../api/quiz';
import Loader from '../../../assets/Loader.gif'

const QuizAnalysis = () => {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { id } = location.state;

    useEffect(() => {
        const fetchQuizData = async (quizId) => {
            if (quizId) {
                try {
                    console.log(`Fetching quiz data for id: ${quizId}`);
                    const quiz = await fetchQuizDataById(quizId);
                    setQuizData(quiz);
                } catch (error) {
                    console.error('Error fetching quiz data:', error);
                    setError('Error fetching quiz data');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchQuizData(id);
    }, [id]);

    useEffect(() => {
        console.log('quizData updated:', quizData);
        if (quizData) {
            console.log('quizType:', quizData.quizType);
        }
    }, [quizData]);

    return (
        <div className={styles.quizAnalysis}>
            <div className={styles.sidebarContainer}>
                <Sidebar activeTabKey="analytics" />
            </div>
            <div className={styles.questionAnalysisContainer}>
                {loading ? (
                  <div className={styles.loaderDiv}>
                    <img src={Loader} alt='Loading' className={styles.loader}/>
                  </div>
                ) : error ? (
                  <div>Error: {error}</div>
                ) : !quizData ? (
                  <div>No data found</div>
                ) : (
                  <>
                    {quizData.quizType === 'Q&A' ? <QA quizData={quizData} /> : null}
                    {quizData.quizType === 'Poll' ? <Poll quizData={quizData} /> : null}
                  </>
                )}
            </div>
        </div>
    );
};

export default QuizAnalysis;
