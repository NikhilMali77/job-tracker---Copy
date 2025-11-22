// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import StatusPieChart from '../components/charts/StatusPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import styles from './Analytics.module.css'; // This now loads your new styles

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/stats');
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className={styles.loadingText}>Loading analytics...</div>;
  }

  if (!stats) {
    return <div className={styles.errorText}>No analytics data found.</div>;
  }

  return (
    <div className={styles.analyticsPage}>
      <h1 className={styles.header}>My Analytics</h1>
      
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <StatusPieChart data={stats.statusStats} />
        </div>
        <div className={styles.chartContainer}>
          <MonthlyBarChart data={stats.monthlyApplications} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;