import axios from "axios"
type ListaCache = {
  loading: boolean
  loaded: boolean
  options: any[]
}
const cache: Record<string, ListaCache> = {}
export const getLista = async (campo: string, force = false) => {
  if (!cache[campo]) cache[campo] = { loading: false, loaded: false, options: [] }
  if (!force && (cache[campo].loading || cache[campo].loaded)) return cache[campo] // Evita doble fetch
  cache[campo].loading = true
  const res = await axios.get("/api/listas", { params: { campo } })
  cache[campo] = { loading: false, loaded: true, options: res.data?.data ?? [] }
  return cache[campo]
}
export const resetLista = (campo: string) => {
  if (!cache[campo]) return
  cache[campo] = { loading: false, loaded: false, options: [] } // Limpia cache
}
export const getListaSync = (campo: string) => cache[campo]