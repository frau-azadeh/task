"use client";
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; 
import { Task } from '../types/task';
import KanbanColumn from '../../components/KanbanColumn';
import Menu from '../../components/Menu';
import { DecodedToken } from '../types/DecodeToken';

const emailToUserMap: { [key: string]: string } = {
  'ahmad@example.com': 'ahmad',
  'maryam@example.com': 'maryam',
  'shahin@example.com': 'shahin',
};

const fetchTasks = async (token: string) => {
  const response = await fetch('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await response.json();
  return data.tasks;
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
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
            if (decoded.role === 'admin') {
              setTasks(tasks);
            } else {
              const userTasks = tasks.filter((task: Task) => task.assignedTo.toLowerCase() === user.toLowerCase());
              if (userTasks.length === 0) {
                setError('No tasks found for this user');
              } else {
                setTasks(userTasks);
              }
            }
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

  const columns = ['To Do', 'In Progress', 'Done'];

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
                  <p className="text-center mb-4">
                    Logged in as: {userName} ({role})
                  </p>
                )}
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 p-4">
                  {columns.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      tasks={tasks.filter((task: Task) => task.status === status)} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;