import React from 'react';
import { Task } from '../app/types/task';
import KanbanTask from './KanbanTask';

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-4 w-full md:w-1/3">
      <h2 className="font-bold text-xl mb-4 text-center">{status}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
