'use client';
import React from 'react';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

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
