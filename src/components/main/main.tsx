import "./main.css"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"

export function Main() {
 
  return (
    <main>
      <div className="container">
          <form>
              <div className="email_input">
                <img src={MagnifyingIcon} alt="" />
                <input type="email" placeholder="Enter your email to verify..." required />
              </div>
              <button>
                Verify
              </button>
          </form>
      </div>
    </main>
  )
}
