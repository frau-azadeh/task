"use client";

import React from 'react';
import { Gantt, Task as GanttTask } from 'gantt-task-react'; 
import 'gantt-task-react/dist/index.css';

interface GanttChartPageProps {
  tasks: GanttTask[]; 
}

const GanttChartPage: React.FC<GanttChartPageProps> = ({ tasks }) => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Gantt Chart for Tasks
      </h1>
      {tasks.length > 0 ? (
        <div className="bg-gray-50 rounded-lg shadow-lg p-4">
          <Gantt tasks={tasks} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading tasks...</p>
      )}
    </div>
  );
};

export default GanttChartPage;