import React, { useState } from 'react';
import styles from './Authentication.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from '../../api/Authentication';

const Register = ({ onRegisterSuccess }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [confirmPassErr, setConfirmPassErr] = useState(false);

    const isValid = (regex, string) => regex.test(string);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = userData;

        // Reset error states
        setNameErr(false);
        setEmailErr(false);
        setPassErr(false);
        setConfirmPassErr(false);

        // Validation checks
        const nameValid = isValid(/^[a-zA-Z-' ]+$/, name);
        const emailValid = isValid(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, email);
        const passwordValid = isValid(/^.{6,}$/, password);
        const passwordsMatch = password === confirmPassword;
        const confirmPasswordEmpty = confirmPassword === '';

        setNameErr(!nameValid);
        setEmailErr(!emailValid);
        setPassErr(!passwordValid);
        setConfirmPassErr(!passwordsMatch || confirmPasswordEmpty); 

        // Show warning if any field is invalid or empty
        if (!nameValid || !emailValid || !passwordValid || !passwordsMatch) {
            toast.warning("All the fields are required and must be valid!", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await registerUser(userData);
            toast.success(response.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setIsLoading(false);
            onRegisterSuccess();
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={`${styles.inputBox} ${nameErr ? styles.error : ''}`}>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' name='name' value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} placeholder={nameErr ? 'Please enter a valid name' : ''} className={nameErr ? styles.error : ''} />
            </div>

            <div className={`${styles.inputBox} ${emailErr ? styles.error : ''}`}>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' name='email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder={emailErr ? 'Please enter a valid email address' : ''} className={emailErr ? styles.error : ''} />
            </div>

            <div className={`${styles.inputBox} ${passErr ? styles.error : ''}`}>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} placeholder={passErr ? 'Please enter a valid password minimum 6 characters' : ''} className={passErr ? styles.error : ''} />
            </div>

            <div className={`${styles.inputBox} ${confirmPassErr ? styles.error : ''}`}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input type='password' id='confirmPassword' name='confirmPassword' value={userData.confirmPassword} onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })} placeholder={confirmPassErr ? 'Passwords do not match' : ''} className={confirmPassErr ? styles.error : ''} />
            </div>

            <div className={styles.submitButton}>
                <button onClick={handleRegisterSubmit}>{isLoading ? "Please Wait..." : "Sign up"}</button>
            </div>
        </div>
    );
}

export default Register;
