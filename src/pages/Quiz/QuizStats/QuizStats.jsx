import React, { useState, useEffect } from 'react'
import styles from './QuizStats.module.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar/Sidebar';
import editIcon from '../../../assets/edit.svg'
import deleteIcon from '../../../assets/delete.svg'
import shareIcon from '../../../assets/share.svg'
import DeleteQuiz from '../../../components/Quiz/DeleteQuiz/DeleteQuiz';

const QuizStats = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; 
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState([]);
    const [quizId, setQuizId] = useState("");
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        fetchQuizData();
    }, [quizData, token]);

    const fetchQuizData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/getAllQuiz?createdBy=${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setQuizData(response.data.quizzes);
        } catch (error) {
            console.log(error);
        }
    }

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
            await navigator.clipboard.writeText(`https://quizzie-topaz.vercel.app/test/${id}`);
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
                <Sidebar activeTabKey="analytics"/>
                <div className={styles.mainContainer}>
                    <h1 className={styles.header}>Quiz Analysis</h1>
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
                                            <td><img src={editIcon} alt='edit' id={quiz._id} onClick={editQuiz}/></td>
                                            <td><img src={deleteIcon} alt='edit' id={quiz._id} onClick={deleteQuiz}/></td>
                                            <td><img src={shareIcon} alt='edit' id={quiz._id} onClick={shareQuiz}/></td>
                                        </span>
                                        <td><Link className={styles.analysisLink} to='/analysis' state={{ id: quiz._id }}>Question Wise Analysis</Link></td>
                                    </tr>                                    
                                );
                            })}
                        </table>
                    </div>
                </div>
                {showDelete && (
                    <DeleteQuiz id={quizId} setShowDelete={setShowDelete}/>
                )}
            </div>
        </>
    )
}

export default QuizStats