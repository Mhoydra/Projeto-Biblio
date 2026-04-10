const BASE = window.env.API_URL // vem do preload
async function request(method, path, body = null) {
const options = { method, headers: { 'Content-Type': 'application/json' } }
if (body) options.body = JSON.stringify(body)
const response = await fetch(`${BASE}${path}`, options)
const data = await response.json()
if (!response.ok) throw new Error(data.mensagem || data.erro)
return data
}
export const livrosAPI = {
listar: () => request('GET', '/livros'),
criar: (dados) => request('POST', '/livros', dados),
remover: (id) => request('DELETE', `/livros/${id}`)
}