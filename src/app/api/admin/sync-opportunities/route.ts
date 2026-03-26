import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SEARCH_QUERIES = [
  'internship Dubai',
  'graduate trainee Dubai',
  'entry level Dubai UAE',
  'junior Dubai',
  'internship UAE',
]

async function fetchJSearchJobs(query: string) {
  const apiKey = process.env.JSEARCH_API_KEY
  if (!apiKey) throw new Error('JSEARCH_API_KEY not set')

  const params = new URLSearchParams({
    query,
    page: '1',
    num_pages: '1',
    date_posted: 'month',
  })

  const res = await fetch(
    `https://jsearch.p.rapidapi.com/search?${params}`,
    {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error(`JSearch error for "${query}":`, res.status, text)
    return []
  }

  const data = await res.json()
  console.log(`JSearch "${query}": ${data.data?.length || 0} results`)
  if (data.data?.length > 0) {
    console.log('Sample:', data.data[0].job_title, '|', data.data[0].job_city, data.data[0].job_country)
  }
  return data.data || []
}

function mapJobType(job: any): string {
  const title = (job.job_title || '').toLowerCase()
  const empType = (job.job_employment_type || '').toLowerCase()
  if (title.includes('intern') || empType === 'intern') return 'internship'
  if (title.includes('shadow')) return 'job_shadow'
  return 'job'
}

export async function POST(req: Request) {
  try {
    if (!process.env.JSEARCH_API_KEY) {
      return NextResponse.json({ error: 'JSEARCH_API_KEY not configured' }, { status: 500 })
    }

    let totalNew = 0
    let totalSkipped = 0
    let totalFetched = 0

    for (const query of SEARCH_QUERIES) {
      try {
        const jobs = await fetchJSearchJobs(query)
        totalFetched += jobs.length

        for (const job of jobs) {
          if (!job.job_title || !job.job_apply_link) {
            totalSkipped++
            continue
          }

          const { data: existing } = await adminClient
            .from('opportunities')
            .select('id')
            .eq('source_id', job.job_id)
            .single()

          if (existing) {
            totalSkipped++
            continue
          }

          const location = [job.job_city, job.job_state, job.job_country]
            .filter(Boolean).join(', ')

          const opportunity = {
            title: job.job_title,
            company: job.employer_name || 'Unknown Company',
            company_logo_url: job.employer_logo || null,
            description: (job.job_description || '').slice(0, 1000),
            type: mapJobType(job),
            location: location || 'UAE',
            is_remote: job.job_is_remote || false,
            external_url: job.job_apply_link,
            source: 'adzuna',
            source_id: job.job_id,
            status: 'staging',
            program: 'both',
            published: false,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }

          const { error } = await adminClient
            .from('opportunities')
            .insert(opportunity)

          if (error) {
            console.error('Insert error:', error.message)
          } else {
            totalNew++
          }
        }

        await new Promise(r => setTimeout(r, 1000))

      } catch (err) {
        console.error(`Error for query "${query}":`, err)
      }
    }

    return NextResponse.json({
      success: true,
      fetched: totalFetched,
      new: totalNew,
      skipped: totalSkipped,
    })

  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
