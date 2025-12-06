import { useState, useEffect } from "react"

export type ExposedResult = {
  found?: boolean
  count?: number
  items?: string[]
  raw?: any
  Error?: string
  id: string | number
  email?: string
}

const API_BASE = import.meta.env.VITE_EXPOSED_API || "https://api.xposedornot.com"

export function useBreachManager() {
  const [results, setResults] = useState<ExposedResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carrega histórico ao iniciar
  useEffect(() => {
    loadHistory();
  }, [])

  async function loadHistory() {
    try {
      const res = await fetch('http://localhost:5000/breaches');
      const data = await res.json();
      
      const history = data.map((item: any) => ({
        id: item.id,
        email: item.email,
        found: item.found,
        count: item.count,
        items: item.items,
        raw: null
      }));
      
      setResults(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }

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
    } catch { }
    return []
  }

  // Recebe apenas a string do email. O evento (e) fica no componente visual.
  async function checkEmail(email: string) {
    setError(null)
    if (!email) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      // 1. Busca na API externa
      const endpoint = `${API_BASE}/v1/check-email/${encodeURIComponent(email)}`
      const res = await fetch(endpoint, { method: "GET" })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Error ${res.status}: ${text}`)
      }

      const data = await res.json()
      
      let found = false;
      let count = 0;
      let names: string[] = [];

      if (data && (data as any).Error === "Not found") {
         found = false;
      } else {
         names = flattenBreaches((data as any).breaches ?? [])
         found = names.length > 0;
         count = names.length;
      }

      // 2. Salva no Backend
      const payload = {
        email: email,
        found: found,
        count: count,
        items: names
      };

      let savedId;
      try {
        const saveRes = await fetch('http://localhost:5000/breaches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (saveRes.ok) {
          const savedData = await saveRes.json();
          savedId = savedData.id; 
        }
      } catch (backendErr) {
        console.error("Erro ao salvar no backend:", backendErr);
      }

      const newResult: ExposedResult = {
        found: found,
        count: count,
        items: names,
        raw: data,
        id: savedId || Date.now().toString(),
        email: email
      }
      
      setResults(prev => [...prev, newResult])

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error("Error when checking email:", err)
      setError(message || "Error when querying the API")
    } finally {
      setLoading(false)
    }
  }

  async function deleteItem(id: string | number) {
     if(!confirm("Tem certeza que deseja deletar?")) return;

    try {
      const response = await fetch(`http://localhost:5000/breaches/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResults(results.filter(r => r.id !== id));
      } else {
        alert("Erro ao deletar no servidor.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  }

  async function editItem(id: string | number) {
    const newEmail = prompt("Digite o novo email para verificar e atualizar:");
    if (!newEmail) return;

    try {
      const endpoint = `${API_BASE}/v1/check-email/${encodeURIComponent(newEmail)}`;
      const apiRes = await fetch(endpoint);
      
      if (!apiRes.ok) {
        alert("Erro ao verificar o novo email na API externa.");
        return;
      }

      const apiData = await apiRes.json();
      
      let found = false;
      let count = 0;
      let names: string[] = [];

      if (apiData && (apiData as any).Error === "Not found") {
         found = false;
      } else {
         names = flattenBreaches((apiData as any).breaches ?? []);
         found = names.length > 0;
         count = names.length;
      }

      const payload = {
        email: newEmail,
        found: found,
        count: count,
        items: names
      };

      const response = await fetch(`http://localhost:5000/breaches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setResults(results.map(r => 
          r.id === id ? { 
            ...r, 
            email: newEmail,
            found: found,
            count: count,
            items: names
          } : r
        ));
      } else {
          alert("Erro ao salvar as alterações no banco de dados.");
      }
    } catch (error) {
      console.error("Erro no processo de edição:", error);
      alert("Erro de conexão ao tentar editar.");
    }
  }

  return {
    results,
    loading,
    error,
    checkEmail,
    deleteItem,
    editItem
  }
}