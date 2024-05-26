import React from 'react';
import styles from './Analysis.module.css';

const QA = ({ quizData }) => {
    console.log('QA component received quizData:', quizData);    
    const formatCreatedDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };
    return (
        <div className={styles.mainContainer}>
            <div className={styles.quizHeader}>
                <div className={styles.quizNameHeading}>{quizData.quizName} Question Analysis</div>
                <div className={styles.quizInfoHeader}>
                    <p>Created on: {formatCreatedDate(quizData.createdAt)}</p>
                    <p>Impressions: {quizData.impression}</p>
                </div>
            </div>
            <div className={styles.questionContainer}>
                {quizData.questions.map((question, index) => (
                    <div className={styles.quizQuestion} key={index}>
                        <div className={styles.questionText}>Q.{index + 1} &nbsp;{question.questionText}</div>
                        <div className={styles.quizOptionsQA}>
                            <div>
                                <div className={styles.optionTitle}>{question.attempt}</div>
                                <p>people Attempted the question</p>
                            </div>
                            <div>
                                <div className={styles.optionTitle}>{question.correct}</div>
                                <p>people Answered Correctly</p>
                            </div>
                            <div>
                                <div className={styles.optionTitle}>{question.attempt - question.correct}</div>
                                <p>people Answered Incorrectly</p>
                            </div>
                        </div>
                        <hr className={styles.seperator} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QA;
