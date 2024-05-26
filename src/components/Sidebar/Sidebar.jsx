import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = ({ activeTabKey }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(activeTabKey);

    const handleUserLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout Successfully', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
        navigate('/');
    };

    const handleTabChange = (id) => {
        setActiveTab(id);
        navigate(`/${id}`, { state: { activeTab: id } });
    };

    return (
        <div className={styles.sidebarContainer}>
            <h1 className={styles.sidebarTitle}>QUIZZIE</h1>
            <div className={styles.sidebarTabs}>
                <div className={`${styles.tabs} ${activeTab == "dashboard" ? styles.sidebarTab : ""}`}  onClick={() => handleTabChange('dashboard')}>
                    Dashboard
                </div>
                <div className={`${styles.tabs} ${activeTab == "analytics" ? styles.sidebarTab : ""}`} onClick={() => handleTabChange('analytics')}>
                    Analytics
                </div>
                <div className={`${styles.tabs} ${activeTab == "createQuiz" ? styles.sidebarTab : ""}`} onClick={() => handleTabChange('createQuiz')}>
                    Create Quiz
                </div>                
            </div>
            <div className={styles.logoutButton}>
                <hr className={styles.seperator} />
                <h3 className={styles.btn} onClick={handleUserLogout}>
                    Logout
                </h3>
            </div>
        </div>
    );
};

export default Sidebar;



