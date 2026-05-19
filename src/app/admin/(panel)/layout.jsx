'use client';
import dynamic from 'next/dynamic';

const AdminNav = dynamic(() => import('@/components/admin/AdminNav'), { ssr: false });

export default function PanelLayout({ children }) {
  return (
    <div className="admin-cursor min-h-screen bg-[#080808]">
      <AdminNav />
      <main className="admin-main p-4 md:p-8 pb-20 md:pb-8 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
