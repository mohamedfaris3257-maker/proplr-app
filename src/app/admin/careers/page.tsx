'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface JobPosting {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

export default function AdminCareersRoute() {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });
      setPostings(data ?? []);
      setLoading(false);
    };
    fetchPostings();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Careers
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Manage job postings</p>
      {loading ? (
        <p style={{ color: '#6e7591' }}>Loading...</p>
      ) : postings.length === 0 ? (
        <p style={{ color: '#6e7591' }}>No job postings yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {postings.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{p.title}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{p.type}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{p.status}</td>
                <td style={{ padding: '8px 12px', color: '#6e7591' }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
