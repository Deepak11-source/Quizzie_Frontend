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
  
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      const { email, password } = userData;
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
        <div className={styles.inputBox}>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' name='email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
        </div>
        <div className={styles.inputBox}>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
        </div>
        <div className={styles.submitButton}>
          <button onClick={handleLoginSubmit}>{isLoading ? "Please Wait..." : "Login"}</button>
        </div>
      </div>
    );
}

export default Login