import React, { useState } from 'react'
import styles from './AuthenticationPage.module.css'
import Register from '../../components/Authentication/Register'
import Login from '../../components/Authentication/Login'

const AuthenticationPage = () => {
    const [login, setLogin] = useState(false);
    const handleRegistrationSuccess = () => {
        setLogin(true);
    };
    return (
        <div className={styles.parentContainer}>
            <div className={styles.childContainer}>
                <h1>QUIZZIE</h1>
                <div className={styles.buttonContainer}>
                    <div className={!login ? styles.buttonActive : ""} onClick={() => setLogin(false)}>
                        Sign Up
                    </div>
                    <div className={login ? styles.buttonActive : ""} onClick={() => setLogin(true)}>
                        Login
                    </div>
                </div>
                {login ? <Login /> : <Register onRegisterSuccess={handleRegistrationSuccess} />}
            </div>
        </div>
    )
}

export default AuthenticationPage