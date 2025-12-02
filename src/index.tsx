import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { Header } from "./components/header/Header.tsx"
import { MainAplication } from "./components/main/Main.tsx"
import { Footer } from "./components/footer/Footer.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Header/>
     <MainAplication/>
     <Footer/>
  </StrictMode>,
)
