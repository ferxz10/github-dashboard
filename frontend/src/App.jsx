import { useState } from 'react'
import SearchPage from './components/SearchPage.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [username, setUsername] = useState(null)

  const handleSearch = (user) => setUsername(user)
  const handleBack   = ()     => setUsername(null)

  return (
    <div style={{ minHeight: '100vh' }}>
      {!username
        ? <SearchPage onSearch={handleSearch} />
        : <Dashboard username={username} onBack={handleBack} />
      }
    </div>
  )
}