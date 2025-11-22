// src/components/NavBar.jsx
import React, { useState } from 'react'; // 1. Import useState
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 2. Add state

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Helper for NavLink classes
  const getNavLinkClass = ({ isActive }) => 
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
    
  // Helper for mobile NavLink (closes menu on click)
  const getMobileNavLinkClass = ({ isActive }) => 
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
    
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      
      {/* Left Side (Logo) */}
      <NavLink to="/" className={styles.logo} onClick={closeMobileMenu}>
        AutoTrack
      </NavLink>
      
      {/* --- 3. UPDATED: Desktop Nav Links --- */}
      {/* This list is now separate and will be hidden on mobile */}
      <div className={styles.navLinks}>
        <NavLink to="/" className={getNavLinkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/add-job" className={getNavLinkClass}>
          Add Job
        </NavLink>
        <NavLink to="/kanban" className={getNavLinkClass}>
          Kanban
        </NavLink>
        <NavLink to="/analytics" className={getNavLinkClass}>
          Analytics
        </NavLink>
        <NavLink to="/extension" className={getNavLinkClass}>
          Extension
        </NavLink>
      </div>

      {/* Right Side (User Info) */}
      <div className={styles.userInfo}>
        {user && <span className={styles.welcomeText}>Welcome, {user.name}</span>}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
        
        {/* --- 4. NEW: Hamburger Button --- */}
        <button 
          className={styles.hamburgerButton} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* --- 5. NEW: Mobile Menu (Overlay) --- */}
      {isMobileMenuOpen && (
        <div className={styles.mobileNavActive}>
          <NavLink to="/" className={getMobileNavLinkClass} end onClick={closeMobileMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/add-job" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Add Job
          </NavLink>
          <NavLink to="/kanban" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Kanban
          </NavLink>
          <NavLink to="/analytics" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Analytics
          </NavLink>
          <NavLink to="/extension" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Extension
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default NavBar;