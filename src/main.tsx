import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './provider/auth.provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { BoardProvider } from './provider/board.provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
    <BoardProvider >
        <App />
    </BoardProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
