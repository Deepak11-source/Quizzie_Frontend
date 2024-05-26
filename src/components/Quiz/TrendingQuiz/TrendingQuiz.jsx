import React from 'react';
import styles from './TrendingQuiz.module.css';
import impressionIcon from '../../../assets/eye.svg';

const TrendingQuiz = ({ quizName, impression, createdAt }) => {

    const formatCreatedDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formattedCreatedDate = formatCreatedDate(createdAt);

    return (
        <div className={styles.trendingQuizContainer}>
            <div className={styles.trendingQuiz}>
                <span className={styles.quizName}>{quizName}</span>
                <span className={styles.impression}>
                    {impression}
                    <img src={impressionIcon} alt='impression' />
                </span>
            </div>
            <div className={styles.trendingQuizCreatedAt}>
                <span>Created On: {formattedCreatedDate}</span>
            </div>
        </div>
    );
};

export default TrendingQuiz;
