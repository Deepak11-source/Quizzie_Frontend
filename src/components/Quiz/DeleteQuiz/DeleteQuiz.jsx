import React from 'react'
import styles from './DeleteQuiz.module.css'
import { toast } from 'react-toastify';
import { deleteQuiz } from '../../../api/quiz';

const DeleteQuiz = ({ id, setShowDelete }) => {
  const token = localStorage.getItem("token");

  const handleDeleteQuiz = async (e) => {
    e.preventDefault();
    try {
      const message = await deleteQuiz(id, token);
      toast.success(message, {
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
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    setShowDelete(false);
  };

  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteQuiz}>
        <h2>Are you sure you want to delete?</h2>
        <div className={styles.buttonContainer}>
          <button className={styles.deleteBtn} onClick={handleDeleteQuiz}>Confirm Delete</button>
          <button className={styles.cancelBtn} onClick={cancelDelete}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuiz;