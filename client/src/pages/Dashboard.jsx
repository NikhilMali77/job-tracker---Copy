// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import styles from './Dashboard.module.css'; // 2. Import new styles

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null); // 3. Add state for stats
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // 4. Get the user for their name

  // 5. Create a function to load all dashboard data
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      // Fetch jobs and stats at the same time
      const [jobsResponse, statsResponse] = await Promise.all([
        api.get('/jobs'),
        api.get('/stats')
      ]);

      // Set jobs data
      if (Array.isArray(jobsResponse.data)) {
        setJobs(jobsResponse.data);
      } else {
        setJobs([]);
      }
      
      // Set stats data
      if (statsResponse.data) {
        setStats(statsResponse.data.statusStats);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setJobs([]);
      setStats(null);
    }
    setIsLoading(false);
  };

  // 6. Call the new load function on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const handleJobDeleted = (deletedJobId) => {
    setJobs(currentJobs => currentJobs.filter(job => job._id !== deletedJobId));
    // Re-fetch stats to get updated counts
    loadDashboard(); 
  };
  
  // 7. Render a full loading state
  if (isLoading) {
    return <div className={styles.loadingText}>Loading Dashboard...</div>;
  }

  // Helper to create stat cards
  const StatCard = ({ label, value, color }) => (
    <div className={styles.statCard}>
      <h3 className={styles.statLabel} style={{ color }}>{label}</h3>
      <p className={styles.statValue}>{value}</p>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      {/* --- NEW: Header --- */}
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {user ? user.name : ''}!</h1>
        <p className={styles.subtitle}>Here's an overview of your job hunt.</p>
      </header>
      
      {/* --- NEW: Quick Stats --- */}
      {stats && (
        <div className={styles.quickStats}>
          <StatCard 
            label="Applied" 
            value={stats.Applied || 0}
            color="var(--color-accent-blue)" 
          />
          <StatCard 
            label="Interviewing" 
            value={stats.Interviewing || 0}
            color="var(--color-accent-yellow)"
          />
          <StatCard 
            label="Offers" 
            value={stats.Offer || 0}
            color="var(--color-accent-green)"
          />
          <StatCard 
            label="Rejected" 
            value={stats.Rejected || 0}
            color="var(--color-accent-red)"
          />
        </div>
      )}

      {/* --- NEW: Quick Actions --- */}
      <div className={styles.quickActions}>
        <Link to="/add-job" className={`${styles.actionButton} ${styles.primary}`}>
          {/* You can add an SVG icon here */}
          <span>+</span> Add New Job
        </Link>
        <Link to="/extension" className={`${styles.actionButton} ${styles.secondary}`}>
          {/* You can add an SVG icon here */}
          <span>🚀</span> Get the Extension
        </Link>
      </div>

      {/* --- Job List --- */}
      <div className={styles.jobListHeader}>
        <h2 className={styles.jobListTitle}>Your Applications</h2>
        <span className={styles.jobListCount}>{jobs.length} Job(s)</span>
      </div>
      
      {jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>You haven't tracked any jobs yet.</p>
          <Link to="/add-job" className={`${styles.actionButton} ${styles.primary}`}>
            Add Your First Job!
          </Link>
        </div>
      ) : (
        <div className={styles.jobsGrid}>
          {jobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onJobDeleted={handleJobDeleted} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;