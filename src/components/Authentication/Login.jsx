import React, { useState, useEffect } from 'react'
import styles from './Authentication.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../../api/Authentication';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
      email: '',
      password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const [emailErr, setEmailErr] = useState(false);
    const [passErr, setPassErr] = useState(false);

    const isValid = (regex, string) => regex.test(string);
  
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      const { email, password } = userData;
      
      setEmailErr(false);
      setPassErr(false);
      const emailValid = isValid(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, email);
      const passwordValid = password.length > 0;
      setEmailErr(!emailValid);
      setPassErr(!passwordValid);


      if (!email || !password) {
        toast.error('Please provide both email and password', {
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
        const response = await loginUser(userData);
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
        navigate('/dashboard');
        setIsLoading(false);
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
        <div className={`${styles.inputBox} ${emailErr ? styles.error : ''}`}>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} placeholder={emailErr ? 'Please enter a valid email address' : ''} className={emailErr ? styles.error : ''}/>
        </div>
        <div className={`${styles.inputBox} ${passErr ? styles.error : ''}`}>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} placeholder={passErr ? 'Please enter your password' : ''} className={passErr ? styles.error : ''}/>
        </div>
        <div className={styles.submitButton}>
          <button onClick={handleLoginSubmit}>{isLoading ? "Please Wait..." : "Login"}</button>
        </div>
      </div>
    );
}

export default Login