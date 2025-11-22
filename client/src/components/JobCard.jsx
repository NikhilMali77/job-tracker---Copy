// src/components/JobCard.jsx
import React from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';

const JobCard = ({ job, onJobDeleted }) => {
  const probability = job.predictedProbability;

  // --- 1. NEW DYNAMIC STYLING LOGIC ---

  // Function to get the color for the prediction text
  const getProbabilityColor = (prob) => {
    if (prob === null || prob === undefined) return 'var(--color-text-secondary)';
    if (prob > 70) return 'var(--color-accent-green)';
    if (prob > 40) return 'var(--color-accent-yellow)';
    return 'var(--color-accent-red)';
  };

  // Function to get the border color for the card
  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Offer':
        return 'var(--color-accent-green)';
      case 'Interviewing':
        return 'var(--color-accent-yellow)';
      case 'Rejected':
        return 'var(--color-accent-red)';
      case 'Applied':
      default:
        return 'var(--color-accent-blue)';
    }
  };

  // Combine the base card class with dynamic styles
  const cardStyle = {
    borderLeftColor: getStatusBorderColor(job.status),
  };

  // --- END DYNAMIC STYLING ---


  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the application for ${job.company}?`)) {
      try {
        await api.delete(`/jobs/${job._id}`);
        toast.success('Job deleted!');
        onJobDeleted(job._id);
      } catch (err) {
        toast.error('Could not delete job.');
        console.error(err);
      }
    }
  };
  
  return (
    // 2. Apply the dynamic style to the card
    <div className={styles.card} style={cardStyle}>
      
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>
        <span className={styles.statusBadge}>
          {job.status}
        </span>
      </div>
      
      <p className={styles.date}>
        Applied: {new Date(job.dateApplied).toLocaleDateString()}
      </p>

      {/* 3. Apply the dynamic probability color */}
      {probability !== null && typeof probability !== 'undefined' ? (
        <p 
          className={styles.probability}
          style={{ color: getProbabilityColor(probability) }}
        >
          <span>🧠</span>
          <span>Chance of offer: {Math.round(probability)}%</span>
        </p>
      ) : (
        <p className={styles.probabilityPending}>
          <span>🧠</span>
          <span>Prediction pending...</span>
        </p>
      )}

      <div className={styles.actions}>
        <Link 
          to={`/edit-job/${job._id}`}
          className={styles.editLink}
        >
          Edit
        </Link>

        <button 
          onClick={handleDelete}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;