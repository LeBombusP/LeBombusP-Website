'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  //temporary
  useEffect(() => {
    redirect('/login');
  }, []);
  return (
    <main>
      <p>Dashboard</p>
    </main>
  );
}
