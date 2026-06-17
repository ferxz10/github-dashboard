import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, ExternalLink, MapPin, Building2, Globe } from 'lucide-react'
import LanguageChart from './LanguageChart.jsx'
import ActivityChart from './ActivityChart.jsx'
import EventTypesChart from './EventTypesChart.jsx'
import RepoCard from './RepoCard.jsx'
import StatCard from './StatCard.jsx'

export default function Dashboard({ username, onBack }) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/dashboard/${username}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Error loading data')
      }
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [username])

  if (loading) return <LoadingSkeleton username={username} onBack={onBack} />
  if (error)   return <ErrorState error={error} onBack={onBack} onRetry={fetchData} />

  const { profile, stats, languages, top_repos, activity } = data
  const joinYear = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : '?'

  return (
    <div style={styles.page}>
      {/* Top nav */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button onClick={onBack} style={styles.backBtn}>
            <ArrowLeft size={16} />
            Inicio
          </button>
          <span style={styles.headerTitle}>
            GitHub Dashboard
          </span>
          <button onClick={fetchData} style={styles.refreshBtn} title="Update">
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Profile section */}
        <section style={styles.profileSection} className="fade-in">
          <div style={styles.profileCard}>
            <img src={profile.avatar_url} alt={profile.login} style={styles.avatar} />
            <div style={styles.profileInfo}>
              <h1 style={styles.profileName}>{profile.name || profile.login}</h1>
              <p style={styles.profileLogin}>@{profile.login}</p>
              {profile.bio && <p style={styles.profileBio}>{profile.bio}</p>}
              <div style={styles.profileMeta}>
                {profile.location && (
                  <span style={styles.metaItem}>
                    <MapPin size={13} /> {profile.location}
                  </span>
                )}
                {profile.company && (
                  <span style={styles.metaItem}>
                    <Building2 size={13} /> {profile.company}
                  </span>
                )}
                {profile.blog && (
                  <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                     target="_blank" rel="noopener noreferrer" style={styles.metaLink}>
                    <Globe size={13} /> Portfolio
                    <ExternalLink size={11} />
                  </a>
                )}
                <span style={styles.metaItem}>🗓 Member since {joinYear}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section style={styles.statsGrid} className="fade-in-1">
          <StatCard label="Repositories" value={profile.public_repos} color="#00d084" icon="📁" />
          <StatCard label="Total Stars"  value={stats.total_stars}    color="#e3b341" icon="⭐" />
          <StatCard label="Total Forks"  value={stats.total_forks}    color="#58a6ff" icon="🍴" />
          <StatCard label="Followers"   value={profile.followers}    color="#bc8cff" icon="👥" />
          <StatCard label="Following"    value={profile.following}    color="#f78166" icon="➡️" />
          <StatCard label="Own repositories" value={stats.original_repos} color="#00d084" icon="💡" />
        </section>

        {/* Charts row */}
        <div style={styles.chartsRow}>
          <div style={{ ...styles.chartCard, flex: 1 }} className="fade-in-2">
            <h2 style={styles.sectionTitle}>
              <span style={styles.dot('#00d084')} />
              Most used languages
            </h2>
            <LanguageChart languages={languages} />
          </div>
          <div style={{ ...styles.chartCard, flex: 1 }} className="fade-in-3">
            <h2 style={styles.sectionTitle}>
              <span style={styles.dot('#f78166')} />
              Type of events
            </h2>
            <EventTypesChart data={activity.event_types} />
          </div>
        </div>

        {/* Activity chart - full width */}
        <div style={styles.chartCard} className="fade-in-4">
          <h2 style={styles.sectionTitle}>
            <span style={styles.dot('#58a6ff')} />
            Public activity — Last 12 months
          </h2>
          <ActivityChart data={activity.monthly} />
        </div>

        {/* Top repos */}
        <section className="fade-in-5">
          <h2 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>
            <span style={styles.dot('#e3b341')} />
            Most popular repositories
          </h2>
          <div style={styles.reposGrid}>
            {top_repos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <span>Data obtained from the GitHub REST API · No API key required</span>
          <span>Made with FastAPI + React + Chart.js</span>
        </footer>
      </main>
    </div>
  )
}

function LoadingSkeleton({ username, onBack }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button onClick={onBack} style={styles.backBtn}>
            <ArrowLeft size={16} /> Start
          </button>
          <span style={styles.headerTitle}>GitHub Dashboard</span>
          <div />
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.loadingState}>
          <div style={styles.loadingIcon}>⚙️</div>
          <p style={styles.loadingText}>Analyzing @{username}...</p>
          <p style={styles.loadingSubText}>Loading repositories, activities and languages</p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill} />
          </div>
        </div>
      </main>
    </div>
  )
}

function ErrorState({ error, onBack, onRetry }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button onClick={onBack} style={styles.backBtn}>
            <ArrowLeft size={16} /> Start
          </button>
          <span style={styles.headerTitle}>GitHub Dashboard</span>
          <div />
        </div>
      </header>
      <main style={{ ...styles.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={styles.errorCard}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</p>
          <p style={{ color: '#f78166', fontWeight: 600, marginBottom: '8px' }}>error loading data</p>
          <p style={{ color: '#8b949e', fontSize: '0.875rem', marginBottom: '20px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBack}  style={styles.errorBtnSecondary}>← Return</button>
            <button onClick={onRetry} style={styles.errorBtnPrimary}>Retry</button>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0c10' },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(10,12,16,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #21262d',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.875rem',
    color: '#8b949e',
    letterSpacing: '0.05em',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: '1px solid #21262d',
    color: '#8b949e',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: '1px solid #21262d',
    color: '#8b949e',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px 64px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  profileSection: {},
  profileCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    background: '#161b22',
    border: '1px solid #21262d',
    borderRadius: '12px',
    padding: '28px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid #30363d',
    flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#e6edf3',
    marginBottom: '2px',
  },
  profileLogin: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9rem',
    color: '#00d084',
    marginBottom: '10px',
  },
  profileBio: {
    color: '#8b949e',
    fontSize: '0.95rem',
    marginBottom: '14px',
    lineHeight: 1.6,
    maxWidth: '600px',
  },
  profileMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#8b949e',
    fontSize: '0.82rem',
  },
  metaLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#58a6ff',
    fontSize: '0.82rem',
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  },
  chartsRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  chartCard: {
    background: '#161b22',
    border: '1px solid #21262d',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '280px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#e6edf3',
    marginBottom: '20px',
    letterSpacing: '0.01em',
  },
  dot: (color) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  reposGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #21262d',
    color: '#484f58',
    fontSize: '0.78rem',
  },
  loadingState: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  loadingIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
    animation: 'fadeInUp 0.5s ease',
  },
  loadingText: {
    color: '#e6edf3',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '6px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  loadingSubText: {
    color: '#484f58',
    fontSize: '0.85rem',
    marginBottom: '28px',
  },
  progressBar: {
    width: '200px',
    height: '3px',
    background: '#21262d',
    borderRadius: '2px',
    margin: '0 auto',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#00d084',
    borderRadius: '2px',
    animation: 'shimmer 1.5s infinite',
    backgroundSize: '200% 100%',
    backgroundImage: 'linear-gradient(90deg, #0a0c10 0%, #00d084 50%, #0a0c10 100%)',
  },
  errorCard: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorBtnPrimary: {
    background: '#00d084',
    color: '#0a0c10',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorBtnSecondary: {
    background: 'transparent',
    color: '#8b949e',
    border: '1px solid #30363d',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
}