import "./main.css"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"

export function Main() {
 
  return (
    <main>
      <div className="container">
          <form>
              <div className="email_input">
                <img src={MagnifyingIcon} alt="" />
                <input type="email" placeholder="Digite seu email para verificar..." required />
              </div>
              <button>
                Verificar
              </button>
          </form>
      </div>
    </main>
  )
}
