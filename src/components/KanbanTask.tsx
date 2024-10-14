import React from 'react';
import { Task } from '../app/types/task';

interface KanbanTaskProps {
  task: Task;
}

const KanbanTask: React.FC<KanbanTaskProps> = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <p className="text-xs text-gray-400">Assigned to: {task.assignedTo}</p>
      <p className="text-xs text-gray-400">Start: {task.startDate}</p>
      <p className="text-xs text-gray-400">End: {task.endDate}</p>
    </div>
  );
};

export default KanbanTask;
