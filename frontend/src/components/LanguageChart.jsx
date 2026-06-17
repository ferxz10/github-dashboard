import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', Python:'#3572A5',
  Java:'#b07219', Go:'#00ADD8', Rust:'#dea584', C:'#555555',
  'C++':'#f34b7d', 'C#':'#178600', Ruby:'#701516', PHP:'#4F5D95',
  Swift:'#F05138', Kotlin:'#A97BFF', Dart:'#00B4AB', HTML:'#e34c26',
  CSS:'#563d7c', Shell:'#89e051', Vue:'#41b883', Svelte:'#ff3e00',
}

const FALLBACK = ['#00d084','#58a6ff','#bc8cff','#f78166','#e3b341','#79c0ff','#d2a8ff','#ff7b72']

export default function LanguageChart({ languages }) {
  if (!languages || Object.keys(languages).length === 0)
    return <div style={styles.empty}><p style={{fontSize:'2rem'}}>🔍</p><p style={{color:'#484f58'}}>no language detected</p></div>

  const entries = Object.entries(languages).slice(0, 10)
  const total   = entries.reduce((s, [, v]) => s + v, 0)
  const labels  = entries.map(([k]) => k)
  const values  = entries.map(([, v]) => v)
  const colors  = labels.map((l, i) => LANG_COLORS[l] || FALLBACK[i % FALLBACK.length])

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors,
      borderColor: '#161b22',
      borderWidth: 3,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#8b949e', font: { size: 12 }, boxWidth: 10, padding: 10, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: '#0d1117', borderColor: '#30363d', borderWidth: 1,
        titleColor: '#e6edf3', bodyColor: '#8b949e', padding: 10,
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} repos (${((ctx.raw/total)*100).toFixed(1)}%)` }
      }
    },
  }

  return (
    <div>
      <div style={{ height: '220px', position: 'relative' }}>
        <Doughnut data={data} options={options} />
      </div>
      <div style={styles.bar}>
        {entries.slice(0,7).map(([lang, count], i) => (
          <div key={lang} style={{ ...styles.barSegment, width: `${(count/total*100).toFixed(0)}%`, background: LANG_COLORS[lang] || FALLBACK[i%FALLBACK.length] }} title={`${lang}: ${(count/total*100).toFixed(0)}%`} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  bar: { display: 'flex', height: '4px', borderRadius: '2px', overflow: 'hidden', marginTop: '16px', gap: '1px' },
  barSegment: { height: '100%', minWidth: '2px', borderRadius: '1px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' },
}