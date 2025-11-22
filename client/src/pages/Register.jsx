// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'; // Reuse the login styles

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // For confirmation
    yearsOfExperience: 0,
    age: 18,
    gender: 0,
    educationLevel: 1,
  });

  const { name, email, password, password2, yearsOfExperience, age, gender, educationLevel } = formData;

  const onChange = (e) => {
    // Handle number inputs
    if (['age', 'gender', 'educationLevel', 'yearsOfExperience'].includes(e.target.name)) {
      setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      return toast.error('Passwords do not match');
    }
    
    try {
      // We don't need to send password2 to the API
      const { password2, ...apiData } = formData;
      await register(apiData);
      
      toast.success('Registered successfully! Welcome!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed.');
      console.error(error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Register</h2>
        
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} required className={styles.input} />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password2" className={styles.label}>Confirm Password:</label>
          <input type="password" id="password2" name="password2" value={password2} onChange={onChange} required className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="yearsOfExperience" className={styles.label}>Years of Experience:</label>
          <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={yearsOfExperience} onChange={onChange} required className={styles.input} min="0" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="age" className={styles.label}>Age:</label>
          <input type="number" id="age" name="age" value={age} onChange={onChange} required className={styles.input} min="18" />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="gender" className={styles.label}>Gender:</label>
          <select id="gender" name="gender" value={gender} onChange={onChange} className={styles.input}>
            <option value="0">Female</option>
            <option value="1">Male</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="educationLevel" className={styles.label}>Education Level:</label>
          <select id="educationLevel" name="educationLevel" value={educationLevel} onChange={onChange} className={styles.input}>
            <option value="1">High School</option>
            <option value="2">Bachelor's</option>
            <option value="3">Master's</option>
            <option value="4">PhD</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
        
        {/* --- THIS IS THE ONLY CHANGE --- */}
        <p className={styles.signupText}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;