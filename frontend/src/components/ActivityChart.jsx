import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const MONTHS = {'01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun','07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic'}

export default function ActivityChart({ data }) {
  if (!data || data.length === 0)
    return <div style={styles.empty}>No recent activity data</div>

  const labels = data.map(d => { const [,m] = d.month.split('-'); return MONTHS[m] || m })
  const values = data.map(d => d.count)
  const maxVal = Math.max(...values)

  const bgColors = values.map(v => {
    const r = maxVal > 0 ? v / maxVal : 0
    if (r > 0.75) return 'rgba(0,208,132,0.85)'
    if (r > 0.4)  return 'rgba(0,208,132,0.55)'
    if (r > 0.1)  return 'rgba(0,208,132,0.3)'
    return 'rgba(0,208,132,0.1)'
  })

  const chartData = {
    labels,
    datasets: [{ label: 'Events', data: values, backgroundColor: bgColors, borderRadius: 5, borderSkipped: false }]
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1117', borderColor: '#30363d', borderWidth: 1,
        titleColor: '#e6edf3', bodyColor: '#8b949e', padding: 10,
        callbacks: { title: (i) => data[i[0].dataIndex].month, label: (ctx) => ` ${ctx.raw} Public events` }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(33,38,45,0.8)' }, ticks: { color: '#484f58', font: { size: 11 } }, border: { display: false } },
      y: { grid: { color: 'rgba(33,38,45,0.8)' }, ticks: { color: '#484f58', font: { size: 11 } }, border: { display: false }, beginAtZero: true }
    },
  }

  const total = values.reduce((a,b) => a+b, 0)
  const peak  = labels[values.indexOf(maxVal)]

  return (
    <div>
      <div style={styles.meta}>
        <span style={styles.metaItem}><span style={{...styles.dot, background:'#00d084'}} />Total: <strong style={{color:'#00d084'}}>{total}</strong></span>
        <span style={styles.metaItem}><span style={{...styles.dot, background:'#58a6ff'}} />Mes pico: <strong style={{color:'#58a6ff'}}>{peak}</strong></span>
      </div>
      <div style={{ height: '200px' }}><Bar data={chartData} options={options} /></div>
    </div>
  )
}

const styles = {
  meta: { display: 'flex', gap: '20px', marginBottom: '16px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#8b949e' },
  dot: { display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%' },
  empty: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#484f58', fontSize: '0.875rem' },
}