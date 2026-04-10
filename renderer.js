console.log("renderer carregou")


function mostrarTela(nome){
    document.querySelectorAll(".tela").forEach(t=>t.classList.remove("ativa"))
    document.getElementById(nome)?.classList.add("ativa")
}

document.addEventListener("DOMContentLoaded",()=>{

    // TROCA DE TELAS
    document.querySelectorAll("[data-tela]").forEach(btn => {
        btn.addEventListener("click", () => {
            mostrarTela(btn.dataset.tela)
        })
    })

    // LOGIN
    
    document.getElementById("logar")?.addEventListener("click", async (e) => {
    e.preventDefault()

    console.log("CLICOU LOGIN")

    const email = document.getElementById("emailLogin").value
    const senha = document.getElementById("senhaLogin").value

    const erro = document.getElementById("erroLogin")
    erro.style.display = "none"

    if (!email || !senha) {
        erro.textContent = "Preencha todos os campos"
        erro.style.display = "block"
        return
    }

    const res = await window.api.loginUsuario({ email, senha })

    if (res && res.sucesso){
        document.getElementById("sidebar").style.display = "block"
        mostrarTela("perfil")
    } else {
        erro.textContent = "Email ou senha inválidos"
        erro.style.display = "block"
    }
})


    // CADASTRO
    document.getElementById("cadastrar")?.addEventListener("click", async () => {
        const nome = document.getElementById("nomeUsuarioCadastro").value
        const email = document.getElementById("emailCadastro").value
        const senha = document.getElementById("senhaCadastro").value
        const telefone = document.getElementById("telefoneCadastro").value
        const res = await window.api.criarUsuario({
            nome, email, senha, telefone
        })

        if (res.sucesso){
            alert("Cadastro realizado com sucesso!")
            mostrarTela("login")
        } else {
            alert(res.erro)
        }
    })

    // CARREGAMENTOS INICIAIS
    carregarLivros()
    carregarUsuarios()
    carregarEmprestimos()

    // BOTÕES DA JANELA
    const btnFechar = document.getElementById('btn-fechar');
    const btnMinimizar = document.getElementById('btn-minimizar');
    const btnMaximizar = document.getElementById('btn-maximizar');

    if (btnFechar){
        btnFechar.addEventListener('click', () => {
            window.api.fecharJanela();
        });
    }

    if (btnMinimizar){
        btnMinimizar.addEventListener('click', () => {
            window.api.minimizarJanela();
        });
    }

    if (btnMaximizar){
        btnMaximizar.addEventListener('click', () => {
            window.api.maximizarJanela();
        });
    }

    window.api.onMaximized(() => {
        btnMaximizar.textContent = '❐';
    });

    window.api.onRestored(() => {
        btnMaximizar.textContent = '☐';
    });

})

    // LIVROS

async function carregarLivros(){
    const livros = await window.api.listarLivros()
    const tabela = document.getElementById("listaLivros")

    if (!tabela) return

    tabela.innerHTML=""

    livros.forEach(l=>{
        tabela.innerHTML+=` 
        <tr>
        <td>${l.id}</td>
        <td>${l.titulo}</td>
        <td>${l.autor}</td>
        <td>${l.quantidade_disponivel}</td>
        <td>
        <button onclick="editarLivro(${l.id},'${l.titulo}','${l.autor}','${l.isbn}',${l.quantidade_total},${l.quantidade_disponivel})">
        Editar
        </button>
        <button onclick="removerLivro(${l.id})">
        Remover
        </button>
        </td>
        </tr>`
    })
}

async function removerLivro(id){
    await window.api.removerLivro(id)
    carregarLivros()
}

function editarLivro(id,titulo,autor,isbn,total,disp){
    document.getElementById("livro_id").value=id
    titulo.value=titulo
    autor.value=autor
    isbn.value=isbn
    quantidade_total.value=total
    quantidade_disponivel.value=disp
}

document.getElementById("formLivro")?.addEventListener("submit",async e=>{
    e.preventDefault()

    const id=document.getElementById("livro_id").value

    const livro={
        titulo:titulo.value,
        autor:autor.value,
        isbn:isbn.value,
        quantidade_total:quantidade_total.value,
        quantidade_disponivel:quantidade_disponivel.value
    }

    if(id){
        await window.api.atualizarLivro(id,livro)
    } else {
        await window.api.criarLivro(livro)
    }

    e.target.reset()
    carregarLivros()
})

    // USUARIOS

async function carregarUsuarios(){
    const usuarios=await window.api.listarUsuarios()
    const tabela=document.getElementById("listaUsuarios")

    if (!tabela) return

    tabela.innerHTML=""

    usuarios.forEach(u=>{
        tabela.innerHTML+=`
        <tr>
        <td>${u.id}</td>
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.telefone}</td>
        <td>
        <button onclick="editarUsuario(${u.id},'${u.nome}','${u.email}','${u.telefone}')">Editar</button>
        <button onclick="removerUsuario(${u.id})">Remover</button>
        </td>
        </tr>`
    })
}

async function removerUsuario(id){
    await window.api.removerUsuario(id)
    carregarUsuarios()
}

function editarUsuario(id,nome,email,telefone){
    document.getElementById("usuario_id").value=id
    nomeUsuario.value=nome
    emailUsuario.value=email
    telefoneUsuario.value=telefone
}

document.getElementById("formUsuario")?.addEventListener("submit",async e=>{
    e.preventDefault()

    const id=document.getElementById("usuario_id").value

    const usuario={
        nome:nomeUsuario.value,
        email:emailUsuario.value,
        telefone:telefoneUsuario.value,
        ativo:true
    }

    if(id){
        await window.api.atualizarUsuario(id,usuario)
    } else {
        await window.api.criarUsuario(usuario)
    }

    e.target.reset()
    carregarUsuarios()
})

    // EMPRESTIMOS
    
async function carregarEmprestimos(){
    const emprestimos=await window.api.listarEmprestimos()
    const tabela=document.getElementById("listaEmprestimos")

    if (!tabela) return

    tabela.innerHTML=""

    emprestimos.forEach(e=>{
        tabela.innerHTML+=`
        <tr>
        <td>${e.id}</td>
        <td>${e.usuario}</td>
        <td>${e.livro}</td>
        <td>${e.data_prevista_devolucao}</td>
        <td>${e.status}</td>
        <td>${e.data_devolucao}</td>
        <td>
        ${e.status==="ativo"
        ?`<button onclick="devolverLivro(${e.id})">Devolver</button>`
        :""}
        </td>
        </tr>`
    })
}

async function devolverLivro(id){
    await window.api.devolverLivro(id)
    carregarEmprestimos()
}

document.getElementById("formEmprestimo")?.addEventListener("submit",async e=>{
    e.preventDefault()

    const emprestimo={
        usuario_id:usuario_id_emprestimo.value,
        livro_id:livro_id_emprestimo.value,
        data_prevista_devolucao:data_prevista_devolucao.value
    }

    await window.api.criarEmprestimo(emprestimo)

    e.target.reset()
    carregarEmprestimos()
})