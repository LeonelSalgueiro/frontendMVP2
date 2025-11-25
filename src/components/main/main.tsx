import "./main.css"
import MagnifyingIcon from "../../assets/icons/magnifying-glass.svg"
import { useState } from "react"

type ExposedResult = {
  found?: boolean
  count?: number
  items?: string[]
  // raw response fields (optional)
  breaches?: string[][]
  Error?: string
  [key: string]: unknown
}

const API_BASE = import.meta.env.VITE_EXPOSED_API || "https://api.xposedornot.com"
const USE_MOCK = (import.meta.env.VITE_USE_MOCK === 'true')

export function Main() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExposedResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!email) {
      setError("Por favor insira um email válido.")
      return
    }

    // Se estivermos em modo mock (desenvolvimento sem backend), simula uma resposta
    if (USE_MOCK) {
      setLoading(true)
      // Simula latência de rede
      await new Promise((r) => setTimeout(r, 700))
      const mockData: ExposedResult = email.includes("leak")
        ? { found: true, count: 2, items: ["MockLeakDB (2023-01-01)", "OtherLeak (2022-05-10)"] }
        : { found: false, count: 0, items: [] }
      setResult(mockData)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // API xposedornot usa GET no endpoint /v1/check-email/[email]
      const endpoint = `${API_BASE}/v1/check-email/${encodeURIComponent(email)}`
      const res = await fetch(endpoint, {
        method: "GET",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Erro ${res.status}: ${text}`)
      }

      const data = await res.json()

      // Parse according to docs: either { "Error": "Not found" } or { "breaches": [ [..], [..] ] }
      const d = data as Record<string, unknown>
      if (d && "Error" in d && typeof d.Error === "string" && d.Error === "Not found") {
        setResult({ found: false, count: 0, items: [], Error: d.Error })
      } else if (d && "breaches" in d && Array.isArray(d.breaches)) {
        const rawBreaches = d.breaches as unknown[]
        const items: string[] = []
        for (const b of rawBreaches) {
          if (Array.isArray(b)) {
            for (const x of b) {
              items.push(String(x))
            }
          } else {
            items.push(String(b))
          }
        }
        setResult({ found: items.length > 0, count: items.length, items, breaches: rawBreaches as string[][] })
      } else {
        // Fallback: put raw data into result for inspection
        setResult({ found: false, count: 0, items: [], ...(d || {}) })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      // Log completo para facilitar debug no console do navegador (ex.: CORS, failed to fetch, DNS, etc.)
      console.error("Erro ao consultar API xposedornot:", err)
      setError(message || "Erro ao consultar a API")
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
              {loading ? "Verificando..." : "Verify"}
            </button>
          </form>

          <div className="result_area">
            {error && <div className="error">{error}</div>}

            {result && (
              <div className="result_card">
                {/* Exemplo de interpretação do resultado. Ajuste conforme o formato real retornado pela API */}
                {result.found ? (
                  <>
                    <h3>Vazamento encontrado</h3>
                    <p>Foram encontradas {result.count ?? "?"} ocorrências para {email}.</p>
                    {result.items && Array.isArray(result.items) && (
                      <ul>
                        {result.items.map((it: unknown, idx: number) => (
                          <li key={idx}>{JSON.stringify(it)}</li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <h3>Nenhum vazamento encontrado</h3>
                    <p>Não encontramos registros públicos de vazamento para este email.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }
