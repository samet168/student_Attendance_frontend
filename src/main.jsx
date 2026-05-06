import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoute from './routes/AppRoute'
import "./index.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoute />
  </StrictMode>,
)