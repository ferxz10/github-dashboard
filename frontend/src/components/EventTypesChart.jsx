import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const EVENT_LABELS = {
  PushEvent:'📤 Push', CreateEvent:'✨ Create', PullRequestEvent:'🔀 Pull Request',
  IssuesEvent:'🐛 Issues', ForkEvent:'🍴 Fork', WatchEvent:'⭐ Watch',
  IssueCommentEvent:'💬 Comments', DeleteEvent:'🗑 Delete',
  PullRequestReviewEvent:'👀 PR Review', ReleaseEvent:'🚀 Release',
}

const COLORS = ['#00d084','#58a6ff','#bc8cff','#f78166','#e3b341','#79c0ff']

export default function EventTypesChart({ data }) {
  if (!data || Object.keys(data).length === 0)
    return <div style={styles.empty}>no event data</div>

  const entries = Object.entries(data).slice(0, 6)
  const labels  = entries.map(([k]) => EVENT_LABELS[k] || k.replace('Event',''))
  const values  = entries.map(([,v]) => v)

  const chartData = {
    labels,
    datasets: [{ data: values, backgroundColor: COLORS.map(c => c+'cc'), borderColor: COLORS, borderWidth: 1, borderRadius: 5, borderSkipped: false }]
  }

  const options = {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0d1117', borderColor: '#30363d', borderWidth: 1, titleColor: '#e6edf3', bodyColor: '#8b949e', padding: 10, callbacks: { label: (ctx) => ` ${ctx.raw} Events` } }
    },
    scales: {
      x: { grid: { color: 'rgba(33,38,45,0.8)' }, ticks: { color: '#484f58', font: { size: 10 } }, border: { display: false }, beginAtZero: true },
      y: { grid: { display: false }, ticks: { color: '#8b949e', font: { size: 11 } }, border: { display: false } }
    }
  }

  return <div style={{ height: '220px' }}><Bar data={chartData} options={options} /></div>
}

const styles = {
  empty: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#484f58', fontSize: '0.875rem' }
}