'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Registration {
  id: string;
  name: string;
  email: string;
  child_name: string;
  age: number;
  created_at: string;
}

export default function AdminSummerCampRoute() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('summer_camp_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      setRegistrations(data ?? []);
      setLoading(false);
    };
    fetchRegistrations();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Summer Camp Registrations
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Families registered for summer camp</p>
      {loading ? (
        <p style={{ color: '#6e7591' }}>Loading...</p>
      ) : registrations.length === 0 ? (
        <p style={{ color: '#6e7591' }}>No registrations yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Child Name</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Age</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.name}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.email}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.child_name}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.age}</td>
                <td style={{ padding: '8px 12px', color: '#6e7591' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
