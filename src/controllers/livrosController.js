const connection = require('../config/db');

function listarLivros(req, res) {
    connection.query(`SELECT 
        livros.id,
        livros.titulo,
        livros.autor,
        livros.isbn,
        livros.quantidade_total,
        livros.quantidade_disponivel,
        livros.created_at
        FROM livros
        WHERE ativo = true`,
        (err, results) => { 

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar livros no banco'
                });
            }

            res.json(results);
        }
    );
}


function buscarPorIdLivros(req, res) {
    const id = parseInt(req.params.id);
    
    //executa SQL com filtro

    connection.query(`SELECT 
        livros.id,
        livros.titulo,
        livros.autor,
        livros.isbn,
        livros.quantidade_total,
        livros.quantidade_disponivel,
        livros.created_at
        FROM livros
        WHERE ativo = true`,
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar livro'
                });
            }

            //se nao encontrar nenhuma tarefa
            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Livro não encontrado'
                })
            }

            res.json(results[0]);
        }
    );
};

function criarLivro(req, res){
    const { titulo, autor, isbn, quantidade_total, quantidade_disponivel } = req.body;

    //comando SQL para inserir dados no BD
    const sql = 'INSERT INTO livros (titulo, autor, isbn, quantidade_total, quantidade_disponivel, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

    //executa o insert
    connection.query(
        sql,
        [titulo, autor, isbn, quantidade_total, quantidade_disponivel],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao criar livro'
                });
            }

            //retorna a tarefa criada

            res.status(201).json({
                id: result.insertId,
                titulo,
                autor,
                isbn,
                quantidade_total,
                quantidade_disponivel
            });
        }
    )
};

function atualizarLivro(req, res) {
    const id = parseInt(req.params.id);
    const { titulo, autor, isbn, quantidade_total, quantidade_disponivel } = req.body;

    connection.query(
        'SELECT * FROM livros WHERE id = ? AND ativo = true',
        [id],
        (err, results) => {
            //se houver erro na consulta
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar livro no banco'
                });
            }

            //se não encontrou tarefa com o id
            if (results.length == 0) {
                return res.status(404).json ({
                    erro: 'livro não encontrado'
                });
            }
            //pega os dados da tarefa encontrada
            const livroAtual = results[0];

            const novoTitulo = titulo !== undefined ? titulo : livroAtual.titulo;
            const novoAutor = autor !== undefined ? autor : livroAtual.autor;
            const novoIsbn = isbn !== undefined ? isbn : livroAtual.isbn;
            const novoQuantidade_total = quantidade_total !== undefined ? quantidade_total : livroAtual.quantidade_total;
            const novoQuantidade_disponivel = quantidade_disponivel !== undefined ? quantidade_disponivel : livroAtual.quantidade_disponivel;

            if (novoTitulo.trim() === '') {
                return res.status(400).json({
                    erro: 'O titulo não pode ser vazio'
                });
            }

            if (novoQuantidade_disponivel > novoQuantidade_total) {
                return res.status(400).json({
                    erro: "Quantidade disponível não pode ser maior que a quantidade total"
                });
            }

            //executar o UPDATE no BD
            connection.query(
                'UPDATE livros SET titulo = ?, autor = ?, isbn = ?, quantidade_total = ?, quantidade_disponivel = ? WHERE id = ?', [novoTitulo, novoAutor, novoIsbn, novoQuantidade_total, novoQuantidade_disponivel, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            erro: 'Erro ao atualizar livro'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            erro: 'livro não encontrado para atualizar'
                        });
                    }

                    res.json({
                        id,
                        titulo: novoTitulo,
                        autor: novoAutor,
                        isbn: novoIsbn,
                        quantidade_total: novoQuantidade_total,
                        quantidade_disponivel: novoQuantidade_disponivel,
                    });
        });
    });
};

function removerLivro(req, res) {
    const id = parseInt(req.params.id);

    connection.query(
        'UPDATE livros SET ativo = false WHERE id = ? AND ativo = true',
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: "Erro ao remover livro"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    erro: 'Livro não encontrado ou já removido'
                });
            }

            res.json({
                mensagem: "Livro removido do catálogo"
            });
        }
    );
}

module.exports = { listarLivros, buscarPorIdLivros, criarLivro, atualizarLivro, removerLivro};