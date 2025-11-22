// src/components/KanbanColumn.jsx
import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import styles from './KanbanColumn.module.css'; // This now loads your new styles

// Helper function to get the right header class
const getHeaderClass = (title) => {
  switch (title) {
    case 'Applied':
      return styles.headerApplied;
    case 'Interviewing':
      return styles.headerInterviewing;
    case 'Offer':
      return styles.headerOffer;
    case 'Rejected':
      return styles.headerRejected;
    default:
      return '';
  }
};

const KanbanColumn = ({ id, title, jobs }) => {
  const { setNodeRef } = useSortable({ id });

  // Combine the base header class with the dynamic one
  const headerClassName = `${styles.header} ${getHeaderClass(title)}`;

  return (
    <div ref={setNodeRef} className={styles.column}>
      
      {/* Column Header */}
      <h3 className={headerClassName}>
        {title}
        <span className={styles.count}>({jobs.length})</span>
      </h3>
      
      {/* Card Container (the scrolling part) */}
      <SortableContext items={jobs.map(job => job._id)}>
        <div className={styles.cardContainer}>
          {jobs.map(job => (
            <KanbanCard key={job._id} job={job} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;