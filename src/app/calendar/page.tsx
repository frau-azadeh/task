"use client";
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; 
import { Task } from '../types/task'; 
import Menu from '../../components/Menu';
import GanttChartPage from '../../components/GanttChartPage';
import { Task as GanttTask } from 'gantt-task-react'; 
import { DecodedToken } from '../types/DecodeToken';

const emailToUserMap: { [key: string]: string } = {
  'ahmad@example.com': 'ahmad',
  'maryam@example.com': 'maryam',
  'shahin@example.com': 'shahin',
};

const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await response.json();
  return data.tasks;
};

const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [role, setRole] = useState<string>(''); 
  const [userName, setUserName] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token); 
        setRole(decoded.role);

        const user = emailToUserMap[decoded.email]; 
        if (!user) {
          setError('User not found');
          return;
        }

        setUserName(user);
        fetchTasks(token)
          .then((tasks) => {
            let filteredTasks: Task[] = [];

            if (decoded.role === 'admin') {
              filteredTasks = tasks;
            } else {
              filteredTasks = tasks.filter((task: Task) => task.assignedTo.toLowerCase() === user.toLowerCase());
              if (filteredTasks.length === 0) {
                setError('No tasks found for this user');
              }
            }
            const formattedTasks: GanttTask[] = filteredTasks.map((task) => ({
              id: String(task.id),
              name: task.title,
              start: new Date(task.startDate),
              end: new Date(task.endDate),
              type: 'task',
              progress: task.progress, 
              isDisabled: false,
            }));

            setTasks(formattedTasks);
          })
          .catch((err: unknown) => {
            if (err instanceof Error) {
              setError(err.message || 'Error fetching tasks');
            } else {
              setError('Error fetching tasks');
            }
          });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to decode token');
        } else {
          setError('Failed to decode token');
        }
      }
    } else {
      setError('No token found');
    }
  }, []);

  return (
    <>
      <Menu />
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div className="px-6 pt-6 2xl:container">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <>
                {userName && (
                  <p className="text-center mb-4 text-lg font-semibold text-blue-600">
                    Logged in as: {userName} ({role})
                  </p>
                )}
                <GanttChartPage tasks={tasks} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;