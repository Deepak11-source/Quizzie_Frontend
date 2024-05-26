import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Poll from '../../../components/Quiz/Analysis/Poll';
import QA from '../../../components/Quiz/Analysis/QA';
import styles from './QuizAnalysis.module.css';

const QuizAnalysis = () => {
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { id } = location.state;

    const fetchQuizData = async (quizId) => {
        if (quizId) {
            try {
                console.log(`Fetching quiz data for id: ${quizId}`);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/getQuizByID/${quizId}`);
                if (response.status === 200) {
                    console.log('Response received:', response.data.quiz);
                    setQuizData(response.data.quiz);
                } else {
                    console.error('Unexpected response status:', response.status);
                    setError(`Unexpected response status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
                setError('Error fetching quiz data');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchQuizData(id);
    }, [id]);

    useEffect(() => {
        console.log('quizData updated:', quizData);
        if (quizData) {
            console.log('quizType:', quizData.quizType);
        }
    }, [quizData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!quizData) {
        return <div>No data found</div>;
    }

    return (
        <div className={styles.quizAnalysis}>
            <div className={styles.sidebarContainer}>
                <Sidebar activeTabKey="analytics" />
            </div>
            <div className={styles.questionAnalysisContainer}>
                {quizData.quizType === 'Q&A' ? <QA quizData={quizData} /> : null}
                {quizData.quizType === 'Poll' ? <Poll quizData={quizData} /> : null}
            </div>
        </div>
    );
};

export default QuizAnalysis;
