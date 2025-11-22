// client/src/pages/Extension.jsx
import React from 'react';
import styles from './Extension.module.css'; // This now loads your new styles

const Extension = () => {

  // IMPORTANT: Replace this with your real Chrome Web Store URL
  // when your extension is approved.
  const CHROME_STORE_URL = "#"; 

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Meet the AutoTrack Clipper</h1>
        <p className={styles.subtitle}>
          The power of your job tracker, right in your browser.
        </p>
      </div>

      <div className={styles.features}>
        <h2>How It Works</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>1. Find a Job</h3>
            <p>Browse LinkedIn, Indeed, or any job board. When you find a job you like, click "Apply."</p>
          </div>
          <div className={styles.featureCard}>
            <h3>2. Auto-Clip</h3>
            <p>Our extension opens, with the Job Title and Company auto-filled by our AI. No more copy-pasting.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>3. Save & Continue</h3>
            <p>Click "Save Job," and the application is instantly added to your dashboard. You can hide the popup and finish applying.</p>
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2>Get Started Now</h2>
        <p>Install the free extension for your Chrome browser.</p>
        <a 
          href={CHROME_STORE_URL} 
          className={styles.downloadButton}
          // Note: When you deploy, you'll need to publish your 
          // extension to the Chrome Web Store to get this link.
          onClick={(e) => {
            if (CHROME_STORE_URL === "#") {
              e.preventDefault();
              alert("Coming soon! The extension is not yet published.");
            }
          }}
        >
          Add to Chrome
        </a>
      </div>
    </div>
  );
};

export default Extension;