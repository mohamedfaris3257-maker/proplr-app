'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MentorApplication {
  id: string;
  name: string;
  email: string;
  expertise: string;
  status: string;
  created_at: string;
}

export default function AdminMentorsRoute() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('mentor_applications')
        .select('*')
        .order('created_at', { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Mentor Applications
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>People who applied to be mentors</p>
      {loading ? (
        <p style={{ color: '#6e7591' }}>Loading...</p>
      ) : applications.length === 0 ? (
        <p style={{ color: '#6e7591' }}>No mentor applications yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Expertise</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{a.name}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{a.email}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{a.expertise}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{a.status}</td>
                <td style={{ padding: '8px 12px', color: '#6e7591' }}>
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
