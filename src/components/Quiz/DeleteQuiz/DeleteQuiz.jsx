import React from 'react'
import styles from './DeleteQuiz.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteQuiz = ({ id, setShowDelete }) => {
    const token = localStorage.getItem("token");
    const handleDeleteQuiz = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/quiz/deleteQuiz/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setShowDelete(false);
        } catch (error) {
            console.log(error);
        }
    }
    const cancelDelete = (e) => {
      e.preventDefault();
      setShowDelete(false);
  }
  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteQuiz}>
        <h2>Are you confirm you want to delete ?</h2>
        <div className={styles.buttonContainer}>
          <button className={styles.deleteBtn} onClick={handleDeleteQuiz} >Confirm Delete</button>
          <button className={styles.cancelBtn} onClick={cancelDelete}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteQuiz