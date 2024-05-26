import React, { useEffect, useState } from 'react';
import styles from './CreateQuizPage.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import QuizProvider from '../../../utility/QuizProvider';
import CreateQuiz from '../../../components/Quiz/CreateQuiz/CreateQuiz';
import AddQuestion from '../../../components/Quiz/AddQuestion/AddQuestion';
import ShareQuiz from '../../../components/Quiz/ShareQuiz/ShareQuiz';

const CreateQuizPage = () => {
    const [isCreateQuiz, setIsCreateQuiz] = useState();
    const [isAddQuestions, setIsAddQuestions] = useState();
    const [editId, setEditId] = useState();
    const [isShareQuiz, setIsShareQuiz] = useState(false);
    const [isEditQuiz, setIsEditQuiz] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { edit, id } = location.state;

    useEffect(() => {
        if (edit) {
            setIsCreateQuiz(false);
            setIsEditQuiz(true);
            setIsAddQuestions(true);
        } else {
            setIsCreateQuiz(true);
            setIsAddQuestions(false);
        }
        if (id) {
            setEditId(id);
        }
    }, [edit, id]);

    const handleCancel = () => {
        setIsCreateQuiz(true);
        setIsAddQuestions(false);
        navigate('/dashboard');
    };

    return (
        <div className={styles.parentContainer} onClick={handleCancel}>
            <Sidebar activeTabKey="createQuiz" />
            <QuizProvider>
                {isCreateQuiz && (
                <CreateQuiz setIsCreateQuiz={setIsCreateQuiz} setIsAddQuestions={setIsAddQuestions} />)}
                {isAddQuestions && (<AddQuestion setIsShareQuiz={setIsShareQuiz} setIsAddQuestions={setIsAddQuestions} setIsCreateQuiz={setIsCreateQuiz} editQuiz={isEditQuiz} editId={editId} />)}
                {isShareQuiz && (<ShareQuiz />)}
            </QuizProvider>
        </div>
    );
}

export default CreateQuizPage;
