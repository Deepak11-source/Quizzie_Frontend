import React, { useState, useContext, useRef } from 'react';
import styles from './ShareQuiz.module.css';
import { QuizContext } from '../../../utility/QuizProvider';
import { toast } from 'react-toastify';
import closeIcon from '../../../assets/cross.png';
import { useNavigate } from 'react-router-dom';

const ShareQuiz = () => {
    const [containerVisible, setContainerVisible] = useState(true);
    const { quizLinkId } = useContext(QuizContext);
    const inpRef = useRef(null);
    const navigate = useNavigate();

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(inpRef.current.value);
            toast.success("Link copied to Clipboard");
            navigate('/analytics');   
        } catch (error) {
            console.error("Failed to copy the link: ", error);
        }
    };

    const handleCloseContainer = () => {
        setContainerVisible(false);
        navigate('/analytics');        
    };

    return (
        <>
            {containerVisible && (
                <div className={styles.mainContainer} onClick={(e) => e.stopPropagation()}>
                    <img src={closeIcon} alt='closeIcon' className={styles.closeIcon} onClick={handleCloseContainer} />
                    <div className={styles.shareHeading}>
                        <h1>Congrats your Quiz is Published!</h1>
                    </div>
                    <input type="text" value={quizLinkId} ref={inpRef} readOnly />
                    <button onClick={handleCopyLink}>Share</button>
                </div>
            )}
        </>
    );
};

export default ShareQuiz;
