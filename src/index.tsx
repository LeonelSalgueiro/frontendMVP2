import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { Header } from "./components/header/header.tsx"
import { Main } from './components/main/main.tsx'
import { Footer } from "./components/footer/footer.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Header/>
     <Main/>
     <Footer/>
  </StrictMode>,
)
