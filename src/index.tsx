import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { Header } from "./components/header/Header"
import { MainAplication } from "./components/main/Main"
import { Footer } from "./components/footer/Footer"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Header/>
     <MainAplication/>
     <Footer/>
  </StrictMode>,
)
