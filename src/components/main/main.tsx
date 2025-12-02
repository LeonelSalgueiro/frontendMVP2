import "./main.css"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"
import { useState } from "react"

type ExposedResult = {
  found?: boolean
  count?: number
  items?: string[]
  raw?: any
  Error?: string
}

const API_BASE = import.meta.env.VITE_EXPOSED_API || "https://api.xposedornot.com"

export function Main() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExposedResult | null>(null)

  function flattenBreaches(raw: unknown): string[] {
    if (!raw) return []
    if (Array.isArray(raw)) {
      return raw.flat(Infinity).filter((v) => typeof v === "string")
    }
    // sometimes API might return an object with nested arrays
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
    setResult(null)
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
        setResult({ found: false, count: 0, items: [], raw: data })
        return
      }

      const names = flattenBreaches((data as any).breaches ?? [])
      setResult({ found: names.length > 0, count: names.length, items: names, raw: data })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("Error when checking email:", err)
      setError(message || "Error when querying the API")
    } finally {
      setLoading(false)
    }
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

        <div className="result_area">
          {error && <div className="error">{error}</div>}

          {result && result.found && result.items && result.items.length > 0 && (
            <div className="result_card">
              <h3>Email-related leaks</h3>
              <p>Number of occurrences: {result.count}</p>
              <ul>
                {result.items.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {result && result.found === false && (
            <div className="result_card">
              <h3>No leaks found</h3>
              <p>We found no public records of leaks for this email address.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
