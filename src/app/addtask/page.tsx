"use client";
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Menu from '../../components/Menu';
import { Task } from '../types/task';
import { DecodedToken } from '../types/DecodeToken';

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

const addTask = async (token: string, task: Task) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to add task');
  }
  return await response.json();
};

const editTask = async (token: string, task: Task) => {
  const response = await fetch(`/api/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return await response.json();
};

const deleteTask = async (token: string, taskId: number) => {
  const response = await fetch(`/api/tasks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: taskId }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

const AddTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>(''); 
  const [userName, setUserName] = useState<string>(''); 
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'To Do',
    assignedTo: '',
    progress: 0,
    startDate: '',
    endDate: '',
  });

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        setRole(decoded.role); 
        setUserName(decoded.email); 

        fetchTasks(token)
          .then((tasks) => {
            setTasks(tasks);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (editingTaskId) {
          await editTask(token, { ...taskForm, id: editingTaskId } as Task);
        } else {
          const taskToAdd = role === 'admin' ? taskForm : { ...taskForm, assignedTo: userName };
          await addTask(token, taskToAdd as Task);
        }
        setTaskForm({
          title: '',
          description: '',
          status: 'To Do',
          assignedTo: '',
          progress: 0,
          startDate: '',
          endDate: '',
        });
        setEditingTaskId(null);
        fetchTasks(token).then(setTasks); 
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setTaskForm(task);
    setEditingTaskId(task.id);
  };

  const handleDelete = async (taskId: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await deleteTask(token, taskId);
        fetchTasks(token).then(setTasks); 
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  return (
    <>
      <Menu />
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div className="px-6 pt-6 2xl:container">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <h1 className="text-2xl font-bold mb-4">Manage Tasks</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mb-4">
                {role === 'admin' ? (
                  <>
                    <label className="block text-gray-700">Assigned To</label>
                    <input
                      type="text"
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    value={taskForm.assignedTo}
                    className="w-full p-2 border rounded-lg"
                    disabled
                  />
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={taskForm.startDate}
                  onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Date</label>
                <input
                  type="date"
                  value={taskForm.endDate}
                  onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Progress (%)</label>
                <input
                  type="number"
                  value={taskForm.progress}
                  onChange={(e) => setTaskForm({ ...taskForm, progress: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                  min={0}
                  max={100}
                />
              </div>
              <div className="col-span-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-auto">
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-500 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Assigned To</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{task.title}</td>
                    <td className="py-3 px-6 text-left">{task.description}</td>
                    <td className="py-3 px-6 text-left">{task.status}</td>
                    <td className="py-3 px-6 text-left">{task.assignedTo}</td>
                    <td className="py-3 px-6 text-left">
                      {role === 'admin' || task.assignedTo === userName ? (
                        <>
                          <button
                            className="bg-blue-500 text-white p-2 mr-2 rounded-lg"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded-lg"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span>Read-only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskPage;
