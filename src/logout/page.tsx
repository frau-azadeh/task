"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // حذف توکن از localStorage
    localStorage.removeItem('token');
    
    // هدایت به صفحه ورود پس از خروج
    router.push('/login');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold">Logging out...</p>
    </div>
  );
};

export default LogoutPage;
