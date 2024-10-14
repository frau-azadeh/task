"use client";
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Menu from '../../components/Menu';
import Pagination from '../../components/Pagination';
import SearchBox from '../../components/SearchBar';
import StatusFilter from '../../components/StatusFilter';
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

const Page: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 5;
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  useEffect(() => {
    const emailToUserMap: { [key: string]: string } = {
      'ahmad@example.com': 'ahmad',
      'maryam@example.com': 'maryam',
      'shahin@example.com': 'shahin',
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);

        const user = emailToUserMap[decoded.email];
        if (!user) {
          setError("User not found");
          return;
        }

        setUserName(user);

        fetchTasks(token)
          .then((tasks) => {
            if (decoded.role === 'admin') {
              setTasks(tasks);
              setFilteredTasks(tasks);
            } else {
              const userTasks = tasks.filter(task => task.assignedTo.toLowerCase() === user.toLowerCase());
              if (userTasks.length === 0) {
                setError("No tasks found for this user");
              } else {
                setTasks(userTasks);
                setFilteredTasks(userTasks);
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

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, statusFilter, tasks]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Menu />
      <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div className="px-6 pt-6 2xl:container">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {userName && (
              <p className="text-center mb-4">Logged in as: {userName} ({role})</p>
            )}
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-2xl font-bold text-center mb-4">Tasks</h1>
              <div className="flex flex-wrap items-center mb-4">
                <SearchBox onSearch={setSearchQuery} />
                <StatusFilter onFilterChange={setStatusFilter} />
              </div>
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className="block lg:hidden">
                    {currentTasks.length === 0 ? (
                      <p className="text-center py-4">No tasks available</p>
                    ) : (
                      currentTasks.map((task) => (
                        <div key={task.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                          <p className="font-bold">Title: {task.title}</p>
                          <p>Description: {task.description}</p>
                          <p>Status: {task.status}</p>
                          <p>Assigned To: {task.assignedTo}</p>
                          <p>Start Date: {task.startDate}</p>
                          <p>End Date: {task.endDate}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="hidden lg:block">
                    <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Title</th>
                          <th className="py-3 px-6 text-left">Description</th>
                          <th className="py-3 px-6 text-left">Status</th>
                          <th className="py-3 px-6 text-left">Assigned To</th>
                          <th className="py-3 px-6 text-left">Start Date</th>
                          <th className="py-3 px-6 text-left">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTasks.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">No tasks available</td>
                          </tr>
                        ) : (
                          currentTasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100">
                              <td className="py-3 px-6 text-left">{task.title}</td>
                              <td className="py-3 px-6 text-left">{task.description}</td>
                              <td className="py-3 px-6 text-left">{task.status}</td>
                              <td className="py-3 px-6 text-left">{task.assignedTo}</td>
                              <td className="py-3 px-6 text-left">{task.startDate}</td>
                              <td className="py-3 px-6 text-left">{task.endDate}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;