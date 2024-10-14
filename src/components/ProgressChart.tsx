"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
  progress: number;
}

interface ProgressChartProps {
  tasks: Task[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ tasks }) => {
  const progressByPerson: { [key: string]: number } = {};
  const totalTasksByPerson: { [key: string]: number } = {};

  tasks.forEach((task) => {
    let taskProgress = 0;
    if (task.status === 'Done') {
      taskProgress = 100;
    } else if (task.status === 'In Progress') {
      taskProgress = 50;
    }

    if (!progressByPerson[task.assignedTo]) {
      progressByPerson[task.assignedTo] = 0;
      totalTasksByPerson[task.assignedTo] = 0;
    }

    progressByPerson[task.assignedTo] += taskProgress;
    totalTasksByPerson[task.assignedTo] += 1;
  });

  const progressResult = Object.keys(progressByPerson).map((person) => ({
    person,
    progress: progressByPerson[person] / totalTasksByPerson[person],
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Progress by Person</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {progressResult.map((personData) => (
          <div key={personData.person} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center mb-2">{personData.person}</h2>
            <Pie
              data={{
                labels: ['Completed', 'Remaining'],
                datasets: [
                  {
                    label: 'Progress',
                    data: [personData.progress, 100 - personData.progress],
                    backgroundColor: ['#4CAF50', '#FF5252'],
                    hoverBackgroundColor: ['#66BB6A', '#FF6E6E'],
                  },
                ],
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
