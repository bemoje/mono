import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return <h1>Hello from a single HTML file!</h1>
}

createRoot(document.getElementById('root')!).render(<App />)
