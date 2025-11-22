// src/pages/AddJob.jsx
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './AddJob.module.css'; // 1. Import new styles
import { useAuth } from '../context/AuthContext'; // 2. Import useAuth

const AddJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 3. Get the logged-in user
  
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    salaryExpectation: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'Applied',
    distanceFromCompany: '', 
    previousCompanies: '',
    recruitmentStrategy: 1, // Add this from our last API update
  });

  const { 
    company, title, salaryExpectation, dateApplied, status, 
    distanceFromCompany, previousCompanies, recruitmentStrategy 
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // --- 4. FIX HARDCODED DATA ---
    // Now we combine the form data with the *real* user data
    const jobDataPayload = {
      ...formData,
      // Get data from the logged-in user context
      experience: user.yearsOfExperience || 0,
      age: user.age || 0,
      gender: user.gender || 0,
      educationLevel: user.educationLevel || 1,
    };
    
    try {
      await api.post('/jobs', jobDataPayload); // Send the correct data
      toast.success('Job added successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to add job. Please check your inputs.');
      console.error(err);
    }
  };

  return (
    // 5. Apply all the new styles
    <div className={styles.formPage}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2 className={styles.title}>Add a New Job</h2>
        
        <div className={styles.inputGroup}>
          <label htmlFor="company" className={styles.label}>Company:</label>
          <input type="text" name="company" value={company} onChange={onChange} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="title" className={styles.label}>Job Title:</label>
          <input type="text" name="title" value={title} onChange={onChange} className={styles.input} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="previousCompanies" className={styles.label}>Previous Companies:</label>
          <input 
            type="number" 
            name="previousCompanies" 
            value={previousCompanies} 
            onChange={onChange} 
            className={styles.input}
            placeholder="e.g., 3"
            min="0"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="distanceFromCompany" className={styles.label}>Distance from Company (in km):</label>
          <input 
            type="number" 
            name="distanceFromCompany" 
            value={distanceFromCompany} 
            onChange={onChange} 
            className={styles.input}
            placeholder="e.g., 15.5"
            step="0.1"
            min="0"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="recruitmentStrategy" className={styles.label}>Recruitment Strategy:</label>
          <select 
            name="recruitmentStrategy" 
            value={recruitmentStrategy} 
            onChange={onChange} 
            className={styles.input}
          >
            <option value="1">Job Board (e.g., LinkedIn, Indeed)</option>
            <option value="2">Direct Application (Company Website)</option>
            <option value="3">Referral / Networking</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="salaryExpectation" className={styles.label}>Salary Expectation ($):</label>
          <input type="number" name="salaryExpectation" value={salaryExpectation} onChange={onChange} className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dateApplied" className={styles.label}>Date Applied:</label>
          <input type="date" name="dateApplied" value={dateApplied} onChange={onChange} className={styles.input} required />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="status" className={styles.label}>Status:</label>
          <select name="status" value={status} onChange={onChange} className={styles.input}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Job
        </button>
      </form>
    </div>
  );
};

export default AddJob;