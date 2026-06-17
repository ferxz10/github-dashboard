export default function StatCard({ label, value, color, icon }) {
    const formatted = value >= 1000
      ? (value / 1000).toFixed(1) + 'k'
      : value?.toString() ?? '0'
  
    return (
      <div style={styles.card}>
        <div style={styles.icon}>{icon}</div>
        <p style={styles.value(color)}>{formatted}</p>
        <p style={styles.label}>{label}</p>
      </div>
    )
  }
  
  const styles = {
    card: {
      background: '#161b22',
      border: '1px solid #21262d',
      borderRadius: '10px',
      padding: '20px 16px',
      textAlign: 'center',
    },
    icon: { fontSize: '1.4rem', marginBottom: '8px' },
    value: (color) => ({
      fontSize: '1.75rem', fontWeight: 700, color,
      fontFamily: "'JetBrains Mono', monospace",
      lineHeight: 1.2, marginBottom: '4px',
    }),
    label: {
      fontSize: '0.75rem', color: '#8b949e', fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    },
  }