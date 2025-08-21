import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import F1RacingDashboard with no SSR to prevent hydration issues
const F1RacingDashboard = dynamic(
  () => import('../components/f1-dashboard/F1RacingDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading F1 Racing Dashboard...</div>
      </div>
    )
  }
);

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>F1 Sales Racing Dashboard</title>
        <meta name="description" content="Formula 1 themed sales performance dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <F1RacingDashboard excelPath="/Book1.xlsx" />
    </>
  );
}