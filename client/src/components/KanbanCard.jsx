// src/components/KanbanCard.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import styles from './KanbanCard.module.css'; // Import the styles

const KanbanCard = ({ job }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // We'll use this to add a class
  } = useSortable({ id: job._id, data: { job } });

  // 1. These styles are REQUIRED by dnd-kit for positioning
  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 2. These are our new dynamic classes
  const cardClassName = `${styles.card} ${isDragging ? styles.cardDragging : ''}`;
  
  const prob = job.predictedProbability;
  
  // --- 3. UPDATED Helper function for dynamic color ---
  const getProbabilityColor = (prob) => {
    if (prob === null || prob === undefined) return 'var(--color-text-secondary)';
    if (prob > 70) return 'var(--color-accent-green)';
    if (prob > 40) return 'var(--color-accent-yellow)';
    return 'var(--color-accent-red)';
  };

  return (
    <div 
      ref={setNodeRef} 
      style={dndStyle}         // Apply dnd-kit styles
      className={cardClassName}  // Apply our custom classes
      {...attributes} 
      {...listeners}
    >
      <h4 className={styles.title}>{job.title}</h4>
      <p className={styles.company}>{job.company}</p>
      
      {prob !== null ? (
        <p 
          className={styles.probability}
          style={{ color: getProbabilityColor(prob) }} // Dynamic color
        >
          <span>🧠</span>
          <span>{Math.round(prob)}%</span>
        </p>
      ) : (
        <p 
          className={styles.probability}
          style={{ color: getProbabilityColor(null) }}
        >
          <span>🧠</span>
          <span>...</span>
        </p>
      )}

      <Link to={`/edit-job/${job._id}`} className={styles.editLink}>
        Edit
      </Link>
    </div>
  );
};

export default KanbanCard;