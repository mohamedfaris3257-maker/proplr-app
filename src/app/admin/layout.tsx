import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="light"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#f0f2f8',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {children}
      </main>
    </div>
  );
}
