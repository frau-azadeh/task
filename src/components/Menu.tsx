"use client"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Menu = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header>
    
        <div className="md:hidden flex justify-between items-center p-4 bg-white">
          <h5 className="text-xl font-semibold text-gray-600">           
             TO DO LIST
          </h5>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>

     
        <aside className={`fixed z-10 top-0 pb-3 px-6 w-full md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%] h-screen bg-white border-r transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="mt-8 text-center">
            <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
            TO DO LIST
            </h5>
          </div>
          <ul className="space-y-2 tracking-wide mt-4">
            <li>
              <Link href="/dashboard" className={`relative px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/dashboard' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span className="-mr-1 font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/addtask" className={`px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/addtask' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span className="group-hover:text-gray-700">Add Task</span>
              </Link>
            </li>
            <li>
              <Link href="/calendar" className={`px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/calendar' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span className="group-hover:text-gray-700">Calendar</span>
              </Link>
            </li>
            <li>
              <Link href="/chart" className={`px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/chart' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                </svg>
                <span className="group-hover:text-gray-700">Chart</span>
              </Link>
            </li>
            <li>
              <Link href="/kanban" className={`px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/kanban' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <span className="group-hover:text-gray-700">Kanban</span>
              </Link>
            </li>
          </ul>
          <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
            <Link href="/login" className={`px-4 py-3 flex items-center space-x-4 rounded-xl ${pathname === '/login' ? 'bg-gradient-to-r from-sky-600 to-cyan-400 text-white' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="group-hover:text-gray-700">Logout</span>
              </Link>
          </div>
        </aside>
      </header>
    </>
  );
};

export default Menu;
