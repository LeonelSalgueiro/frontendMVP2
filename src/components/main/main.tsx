import "./main.css"
import { useState } from "react"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"
import { BreachCard } from "./BreachCard"
import { useBreachManager } from "../../hooks/useBreachManager"

export function MainAplication() {
  // Estado local apenas para controlar o que está escrito no input
  const [emailInput, setEmailInput] = useState("")
  
  // Trazendo a lógica, estados de loading e dados do Hook
  const { results, loading, error, checkEmail, deleteItem, editItem } = useBreachManager()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Chama a função do hook passando apenas o texto
    checkEmail(emailInput)
  }

  return (
    <main>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          {/* --- Início da Área do Input --- */}
          <div className="email_input">
            <img src={MagnifyingIcon} alt="Search" />
            <input
              type="email"
              placeholder="Enter your email to verify..."
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Verify"}
          </button>
          {/* --- Fim da Área do Input --- */}
        </form>
      </div>

      <div className="result_area">
        {/* Exibe erro se houver */}
        {error && <div className="error">{error}</div>}

        {/* Renderiza a lista usando o componente separado */}
        {results.map((res) => (
          <BreachCard 
            key={res.id} 
            data={res} 
            onEdit={editItem} 
            onDelete={deleteItem} 
          />
        ))}
      </div>
    </main>
  )
}