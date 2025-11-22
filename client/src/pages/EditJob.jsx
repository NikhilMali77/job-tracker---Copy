// src/pages/EditJob.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './EditJob.module.css'; // Reusing styles
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); // 2. Get the logged-in user

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    salaryExpectation: '',
    dateApplied: '',
    status: '',
    followUps: 0,
    previousCompanies: '',
    distanceFromCompany: '',
    recruitmentStrategy: 1, // 3. Add missing field
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch the job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        const formattedDate = new Date(data.dateApplied).toISOString().split('T')[0];
        
        setFormData({
          company: data.company,
          title: data.title,
          status: data.status,
          salaryExpectation: data.salaryExpectation || '',
          followUps: data.followUps || 0,
          dateApplied: formattedDate,
          previousCompanies: data.previousCompanies || 0,
          distanceFromCompany: data.distanceFromCompany || 0,
          recruitmentStrategy: data.recruitmentStrategy || 1, // 4. Set field from fetch
        });
        setLoading(false);
      } catch (err) {
        toast.error('Could not find job.');
        navigate('/');
      }
    };
    fetchJob();
  }, [id, navigate]);

  const { 
    company, title, salaryExpectation, dateApplied, status, followUps,
    previousCompanies, distanceFromCompany, recruitmentStrategy // 5. Get new field
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle the update submission
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // --- 6. FIX HARDCODED DATA ---
    const modelData = {
      ...formData,
      // Get data from the logged-in user context
      experience: user.yearsOfExperience || 0,
      age: user.age || 0,
      gender: user.gender || 0,
      educationLevel: user.educationLevel || 1,
    };

    try {
      await api.put(`/jobs/${id}`, modelData); // Send complete modelData
      toast.success('Job updated successfully!');
      navigate('/'); // Redirect to dashboard
    } catch (err) {
      toast.error('Failed to update job.');
      console.error(err);
    }
  };

  // 7. Apply loading style
  if (loading) {
    return <div className={styles.loadingText}>Loading job data...</div>;
  }

  // 8. Apply all styles to the form
  return (
    <div className={styles.formPage}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2 className={styles.title}>Edit Job Application</h2>
        
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
            step="0.1"
            min="0"
          />
        </div>

        {/* 9. Add missing dropdown */}
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

        <div className={styles.inputGroup}>
          <label htmlFor="followUps" className={styles.label}>Follow-ups:</label>
          <input type="number" name="followUps" value={followUps} onChange={onChange} className={styles.input} min="0" />
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditJob;