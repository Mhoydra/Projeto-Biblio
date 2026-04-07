console.log("renderer carregou")

function mostrarTela(nome){

document.querySelectorAll(".tela").forEach(t=>t.classList.remove("ativa"))

document.getElementById(nome)?.classList.add("ativa")

}

document.querySelectorAll(".sidebar button").forEach(botao=>{

botao.addEventListener("click",()=>{

mostrarTela(botao.dataset.tela)

})

})

document.addEventListener("DOMContentLoaded",()=>{

carregarLivros()
carregarUsuarios()
carregarEmprestimos()

})

/* LIVROS */

async function carregarLivros(){

const livros = await window.api.listarLivros()

const tabela = document.getElementById("listaLivros")

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
    </tr>
    `
})
}

async function removerLivro(id){

await window.api.removerLivro(id)

carregarLivros()

}

function editarLivro(id,titulo,autor,isbn,total,disp){

document.getElementById("livro_id").value=id
document.getElementById("titulo").value=titulo
document.getElementById("autor").value=autor
document.getElementById("isbn").value=isbn
document.getElementById("quantidade_total").value=total
document.getElementById("quantidade_disponivel").value=disp

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

}else{

await window.api.criarLivro(livro)

}

e.target.reset()

carregarLivros()

})

/* USUARIOS */

async function carregarUsuarios(){

const usuarios=await window.api.listarUsuarios()

const tabela=document.getElementById("listaUsuarios")

tabela.innerHTML=""

usuarios.forEach(u=>{

tabela.innerHTML+=`
<tr>
<td>${u.id}</td>
<td>${u.nome}</td>
<td>${u.email}</td>
<td>${u.telefone}</td>

<td>

<button onclick="editarUsuario(${u.id},'${u.nome}','${u.email}','${u.telefone}')">
Editar
</button>

<button onclick="removerUsuario(${u.id})">
Remover
</button>

</td>
</tr>
`

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

}else{

await window.api.criarUsuario(usuario)

}

e.target.reset()

carregarUsuarios()

})

/* EMPRESTIMOS */

async function carregarEmprestimos(){

const emprestimos=await window.api.listarEmprestimos()

const tabela=document.getElementById("listaEmprestimos")

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
</tr>
`

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


    const btnFechar = document.getElementById('btn-fechar');
    const btnMinimizar = document.getElementById('btn-minimizar');
    const btnMaximizar = document.getElementById('btn-maximizar');

    if (btnFechar){
        btnFechar.addEventListener('click', () => {
            window.electronAPI.fecharJanela();
        });
    }

    if (btnMinimizar){
        btnMinimizar.addEventListener('click', () => {
        window.electronAPI.minimizarJanela();
        });
    }

    if (btnMaximizar){
        btnMaximizar.addEventListener('click', () => {
            window.electronAPI.maximizarJanela();
        });
    }

    window.electronAPI.onMaximized(() => {
        btnMaximizar.textContent = '❐';
    });

    window.electronAPI.onRestored(() => {
        btnMaximizar.textContent = '☐';
    });