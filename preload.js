const { contextBridge, ipcRenderer } = require("electron")

const API = "http://localhost:3000"

contextBridge.exposeInMainWorld("api", {

    fecharJanela: () => ipcRenderer.send('fechar'),
    minimizarJanela: () => ipcRenderer.send('minimizar'),
    maximizarJanela: () => ipcRenderer.send('maximizar'),

    onMaximized: (callback) => ipcRenderer.on('window-maximized', callback),
    onRestored: (callback) => ipcRenderer.on('window-restored', callback),

    // LOGIN
    loginUsuario: async (dados) => {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        return res.json()
    },

    // USUARIOS
    criarUsuario: async (usuario) => {
        const res = await fetch(`${API}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        })
        return res.json()
    },

    listarUsuarios: async () => {
        const res = await fetch(`${API}/usuarios`)
        return res.json()
    },

    atualizarUsuario: async (id, usuario) => {
        const res = await fetch(`${API}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        })
        return res.json()
    },

    removerUsuario: async (id) => {
        await fetch(`${API}/usuarios/${id}`, { method: "DELETE" })
    },

    // LIVROS
    listarLivros: async () => {
        const res = await fetch(`${API}/livros`)
        return res.json()
    },

    criarLivro: async (livro) => {
        const res = await fetch(`${API}/livros`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        })
        return res.json()
    },

    atualizarLivro: async (id, livro) => {
        const res = await fetch(`${API}/livros/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        })
        return res.json()
    },

    removerLivro: async (id) => {
        await fetch(`${API}/livros/${id}`, { method: "DELETE" })
    },

    // EMPRESTIMOS
    listarEmprestimos: async () => {
        const res = await fetch(`${API}/emprestimos`)
        return res.json()
    },

    criarEmprestimo: async (emprestimo) => {
        const res = await fetch(`${API}/emprestimos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emprestimo)
        })
        return res.json()
    },

    devolverLivro: async (id) => {
        await fetch(`${API}/emprestimos/${id}`, { method: "PUT" })
    }
})