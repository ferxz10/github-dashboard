import { Star, GitFork, ExternalLink } from 'lucide-react'

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', Python:'#3572A5',
  Java:'#b07219', Go:'#00ADD8', Rust:'#dea584', 'C++':'#f34b7d',
  'C#':'#178600', Ruby:'#701516', PHP:'#4F5D95', Swift:'#F05138',
  Kotlin:'#A97BFF', HTML:'#e34c26', CSS:'#563d7c', Shell:'#89e051', Vue:'#41b883',
}

export default function RepoCard({ repo, index }) {
  const langColor = LANG_COLORS[repo.language] || '#8b949e'

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span>📦</span>
        <a href={repo.url} target="_blank" rel="noopener noreferrer" style={styles.repoName}>
          {repo.name}
        </a>
        <a href={repo.url} target="_blank" rel="noopener noreferrer" style={styles.extLink}>
          <ExternalLink size={13} />
        </a>
      </div>

      {repo.description && <p style={styles.description}>{repo.description}</p>}

      {repo.topics.length > 0 && (
        <div style={styles.topics}>
          {repo.topics.map(t => <span key={t} style={styles.topic}>{t}</span>)}
        </div>
      )}

      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          {repo.language && (
            <span style={styles.lang}>
              <span style={{ ...styles.langDot, background: langColor }} />
              {repo.language}
            </span>
          )}
        </div>
        <div style={styles.footerRight}>
          <span style={styles.stat}><Star size={13} /> {repo.stars}</span>
          <span style={styles.stat}><GitFork size={13} /> {repo.forks}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  header: { display: 'flex', alignItems: 'center', gap: '8px' },
  repoName: { flex: 1, color: '#58a6ff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  extLink: { color: '#484f58', textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center' },
  description: { color: '#8b949e', fontSize: '0.82rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  topics: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  topic: { background: 'rgba(88,166,255,0.1)', color: '#58a6ff', border: '1px solid rgba(88,166,255,0.2)', padding: '2px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 500 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '6px' },
  footerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  footerRight: { display: 'flex', gap: '12px' },
  lang: { display: 'flex', alignItems: 'center', gap: '6px', color: '#8b949e', fontSize: '0.78rem' },
  langDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  stat: { display: 'flex', alignItems: 'center', gap: '4px', color: '#8b949e', fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace" },
}