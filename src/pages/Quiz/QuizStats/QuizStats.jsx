import React, { useState, useEffect } from 'react'
import styles from './QuizStats.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar/Sidebar';
import editIcon from '../../../assets/edit.svg'
import deleteIcon from '../../../assets/delete.svg'
import shareIcon from '../../../assets/share.svg'
import DeleteQuiz from '../../../components/Quiz/DeleteQuiz/DeleteQuiz';
import Loader from '../../../assets/Loader.gif'
import { fetchAllQuiz } from '../../../api/quiz';

const QuizStats = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState([]);
    const [quizId, setQuizId] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const quizzes = await fetchAllQuiz(userId, token);
                setQuizData(quizzes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchQuizData();
    }, [userId, token, quizData]);

    const editQuiz = (e) => {
        navigate('/createQuiz', { state: { edit: true, id: e.target.id } });
    }

    const deleteQuiz = async (e) => {
        setShowDelete(true);
        setQuizId(e.target.id);
    }

    const shareQuiz = async (e) => {
        const { id } = e.target
        try {
            await navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/test/${id}`);
            toast.success("Link copied to Clipboard");
        } catch (error) {
            toast.error("Failed to copy the link");
        }
    }

    const formatCreatedDate = (inputDate) => {
        const date = new Date(inputDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className={styles.parentContainer}>
                <Sidebar activeTabKey="analytics" />
                <div className={styles.mainContainer}>
                    <h1 className={styles.header}>Quiz Analysis</h1>
                    {loading ? (
                        <img src={Loader} alt='Loading' className={styles.loader} />
                    ) : (
                        <div className={styles.tableContainer}>
                            <table>
                                <tr>
                                    <th>S.No</th>
                                    <th>Quiz Name</th>
                                    <th>Created On</th>
                                    <th>Impression</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {quizData.map((quiz, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{quiz.quizName}</td>
                                            <td>{formatCreatedDate(quiz.createdAt)}</td>
                                            <td>{quiz.impression}</td>
                                            <span className={styles.actionTab}>
                                                <td><img src={editIcon} alt='edit' id={quiz._id} onClick={editQuiz} className={styles.editIcon}/></td>
                                                <td><img src={deleteIcon} alt='edit' id={quiz._id} onClick={deleteQuiz} className={styles.deleteIcon}/></td>
                                                <td><img src={shareIcon} alt='edit' id={quiz._id} onClick={shareQuiz} className={styles.shareIcon}/></td>
                                            </span>
                                            <td><Link className={styles.analysisLink} to='/analysis' state={{ id: quiz._id }}>Question Wise Analysis</Link></td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </div>)}
                </div>
                {showDelete && (
                    <DeleteQuiz id={quizId} setShowDelete={setShowDelete} />
                )}
            </div>
        </>
    )
}

export default QuizStats