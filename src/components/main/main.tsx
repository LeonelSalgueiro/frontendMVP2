import "./main.css"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"
import Trash from "../../assets/icons/trash.svg"
import Pencil from "../../assets/icons/pencil.svg"
import { useState } from "react"

type ExposedResult = {
  found?: boolean
  count?: number
  items?: string[]
  raw?: any
  Error?: string
  id: string
  email?: string
}

const API_BASE = import.meta.env.VITE_EXPOSED_API || "https://api.xposedornot.com"

export function MainAplication() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ExposedResult[]>([])

  function flattenBreaches(raw: unknown): string[] {
    if (!raw) return []
    if (Array.isArray(raw)) {
      return raw.flat(Infinity).filter((v) => typeof v === "string")
    }
    try {
      const asAny = raw as any
      if (asAny && typeof asAny === "object") {
        const values = Object.values(asAny)
        return values.flat(Infinity).filter((v) => typeof v === "string")
      }
    } catch {
      // fallback
    }
    return []
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const endpoint = `${API_BASE}/v1/check-email/${encodeURIComponent(email)}`
      console.debug("Requesting check-email endpoint:", endpoint)
      const res = await fetch(endpoint, { method: "GET" })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error ${res.status}: ${text}`)
      }

      const data = await res.json()
      console.debug("check-email response:", data)

      if (data && (data as any).Error === "Not found") {
        const newResult: ExposedResult = { 
          found: false, 
          count: 0, 
          items: [], 
          raw: data,
          id: Date.now().toString(),
          email: email 
        }
        setResults([...results, newResult])
        return
      }

      const names = flattenBreaches((data as any).breaches ?? [])
      const newResult: ExposedResult = {
        found: names.length > 0,
        count: names.length,
        items: names,
        raw: data,
        id: Date.now().toString(),
        email: email
      }
      setResults([...results, newResult])
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("Error when checking email:", err)
      setError(message || "Error when querying the API")
    } finally {
      setLoading(false)
    }
  }

  function handleDelete(id: string) {
    setResults(results.filter(r => r.id !== id))
  }

  function handleEdit(id: string) {
    console.log("Editar card com ID:", id)
  }

  return (
    <main>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="email_input">
            <img src={MagnifyingIcon} alt="" />
            <input
              type="email"
              placeholder="Enter your email to verify..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Verify"}
          </button>
        </form>
      </div>

      <div className="result_area">
        {error && <div className="error">{error}</div>}

        {results.map((res) => (
          <div key={res.id} className="result_card">
            <div className="card_header">
              <div>
                <h3>
                  {res.found ? "Email-related leaks" : "No leaks found"}
                </h3>
                <p className="email_display">{res.email}</p>
              </div>
              <div className="card_actions">
                <button 
                  className="edit_btn" 
                  onClick={() => handleEdit(res.id)}
                  title="Edit"
                >
                  <img src={Pencil} alt="" />
                </button>
                <button 
                  className="delete_btn" 
                  onClick={() => handleDelete(res.id)}
                  title="Delete"
                >
                  <img src={Trash} alt="" />
                </button>
              </div>
            </div>

            {res.found && res.items && res.items.length > 0 ? (
              <>
                <p>Number of occurrences: {res.count}</p>
                <ul>
                  {res.items.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>We found no public records of leaks for this email address.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
