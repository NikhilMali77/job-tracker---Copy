// src/pages/Kanban.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from '../components/KanbanColumn';
import styles from './Kanban.module.css'; // This now loads your new styles

const KANBAN_COLUMNS = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

const Kanban = () => {
  const [jobs, setJobs] = useState([]);
  const [columns, setColumns] = useState({
    Applied: [],
    Interviewing: [],
    Offer: [],
    Rejected: [],
  });
  const [loading, setLoading] = useState(true);

  // ... (All logic functions like fetchJobs and handleDragEnd are identical) ...
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs');
      // This is a good place to add the same safety check as Dashboard.jsx
      if (Array.isArray(data)) {
        setJobs(data);
        // Sort jobs into columns
        const newColumns = { Applied: [], Interviewing: [], Offer: [], Rejected: [] };
        data.forEach(job => {
          if (newColumns[job.status]) {
            newColumns[job.status].push(job);
          }
        });
        setColumns(newColumns);
      } else {
        setJobs([]);
        setColumns({ Applied: [], Interviewing: [], Offer: [], Rejected: [] });
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeJob = active.data.current.job;
    const overColumnId = over.id.toString();
    const targetColumn = KANBAN_COLUMNS.find(col => col === overColumnId);
    const sourceColumn = activeJob.status;
    if (!targetColumn || targetColumn === sourceColumn) return;

    setColumns(prev => {
      const newColumns = { ...prev };
      newColumns[sourceColumn] = prev[sourceColumn].filter(job => job._id !== activeJob._id);
      newColumns[targetColumn] = [...prev[targetColumn], { ...activeJob, status: targetColumn }];
      return newColumns;
    });

    const updatePromise = api.put(`/jobs/${activeJob._id}`, { ...activeJob, status: targetColumn });

    toast.promise(updatePromise, {
      loading: 'Updating job...',
      success: (res) => {
        fetchJobs(); 
        return 'Job status updated!';
      },
      error: (err) => {
        toast.error('Failed to update. Reverting change.');
        setColumns(prev => ({ ...prev, [sourceColumn]: [...prev[sourceColumn], activeJob] }));
        return 'Update failed.';
      },
    });
  };

  if (loading) {
    return <div className={styles.loadingText}>Loading Kanban...</div>;
  }

  return (
    <div className={styles.kanbanPage}>
      <h1 className={styles.header}>Kanban Board</h1>
      
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className={styles.columnsContainer}>
          <SortableContext items={KANBAN_COLUMNS} strategy={horizontalListSortingStrategy}>
            {KANBAN_COLUMNS.map(colId => (
              <KanbanColumn
                key={colId}
                id={colId}
                title={colId}
                jobs={columns[colId]}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default Kanban;