import axios from "axios"

type ListaCache = {
  loading: boolean
  loaded: boolean
  options: any[]
}

const cache: Record<string, ListaCache> = {}

export const getLista = async (campo: string) => {
  if (!cache[campo]) cache[campo] = { loading: false, loaded: false, options: [] }
  if (cache[campo].loading || cache[campo].loaded) return cache[campo] // Bloquea doble fetch
  cache[campo].loading = true
  const res = await axios.get("/api/listas", { params: { campo } })
  cache[campo] = { loading: false, loaded: true, options: res.data?.data ?? [] }
  return cache[campo]
}

export const getListaSync = (campo: string) => cache[campo]
