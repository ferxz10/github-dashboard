import { useState } from 'react'
import { Search, Github, Zap, BarChart2, Code2, Activity } from 'lucide-react'
import { API_URL } from '../config.js'

const EXAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803', 'tj']

export default function SearchPage({ onSearch }) {
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = input.trim()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/user/${user}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'User not found')
      }
      onSearch(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExample = (name) => {
    setInput(name)
    setError('')
  }

  return (
    <div style={styles.page}>
      <div style={styles.grid} aria-hidden="true" />

      <div style={styles.hero}>
        <div style={styles.badge}>
          <Github size={14} />
          <span>GitHub Analytics</span>
        </div>

        <h1 style={styles.h1}>
          GitHub{' '}
          <span style={styles.accent}>Dashboard</span>
        </h1>
        <p style={styles.subtitle}>
          Enter any GitHub username and generate a complete visual analysis
          with real stats, trends and activity.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <Github size={20} style={styles.inputIcon} />
            <input
              style={styles.input}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              placeholder="username..."
              autoFocus
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={styles.btn(loading || !input.trim())}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                <>
                  <Search size={16} />
                  Analyze
                </>
              )}
            </button>
          </div>
          {error && <p style={styles.error}>{error}</p>}
        </form>

        <div style={styles.examples}>
          <span style={styles.examplesLabel}>Try with:</span>
          {EXAMPLES.map(name => (
            <button
              key={name}
              onClick={() => handleExample(name)}
              style={styles.chip}
            >
              @{name}
            </button>
          ))}
        </div>

        <div style={styles.features}>
          {FEATURES.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <f.Icon size={22} color={f.color} />
              <div>
                <p style={styles.featureTitle}>{f.title}</p>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  { Icon: Code2,     color: '#00d084', title: 'Languages',  desc: 'Technology distribution across your repos' },
  { Icon: BarChart2, color: '#58a6ff', title: 'Activity',   desc: 'Commits and events from the last 12 months' },
  { Icon: Zap,       color: '#bc8cff', title: 'Top Repos',  desc: 'Most popular projects by stars' },
  { Icon: Activity,  color: '#f78166', title: 'Trends',     desc: 'Event types and contributions' },
]

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,208,132,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,208,132,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  hero: {
    position: 'relative',
    maxWidth: '640px',
    width: '100%',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0,208,132,0.1)',
    border: '1px solid rgba(0,208,132,0.25)',
    color: '#00d084',
    fontSize: '12px',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '100px',
    marginBottom: '24px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 'clamp(2.4rem, 6vw, 4rem)',
    fontWeight: 700,
    color: '#e6edf3',
    lineHeight: 1.15,
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  accent: {
    color: '#00d084',
    fontFamily: "'JetBrains Mono', monospace",
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#8b949e',
    marginBottom: '40px',
    lineHeight: 1.7,
    maxWidth: '520px',
    margin: '0 auto 40px',
  },
  form: {
    width: '100%',
    marginBottom: '20px',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '10px',
    padding: '4px 4px 4px 16px',
    gap: '10px',
  },
  inputIcon: {
    color: '#8b949e',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e6edf3',
    fontSize: '1rem',
    fontFamily: "'JetBrains Mono', monospace",
    padding: '10px 0',
  },
  btn: (disabled) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: disabled ? '#21262d' : '#00d084',
    color: disabled ? '#484f58' : '#0a0c10',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    flexShrink: 0,
  }),
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #0a0c10',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  error: {
    marginTop: '10px',
    color: '#f78166',
    fontSize: '0.875rem',
    textAlign: 'left',
    paddingLeft: '4px',
  },
  examples: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  examplesLabel: {
    color: '#484f58',
    fontSize: '0.8rem',
  },
  chip: {
    background: '#161b22',
    border: '1px solid #21262d',
    color: '#8b949e',
    padding: '3px 10px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    textAlign: 'left',
  },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: '#161b22',
    border: '1px solid #21262d',
    borderRadius: '10px',
    padding: '16px',
  },
  featureTitle: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#e6edf3',
    marginBottom: '2px',
  },
  featureDesc: {
    fontSize: '0.78rem',
    color: '#8b949e',
    lineHeight: 1.5,
  },
}