const connection = require('../config/db');

function listarUsuarios(req, res) {
    connection.query('SELECT * FROM usuarios WHERE ativo = 1', (err, results) => {

        //se erro
        if (err) {
            return res.status(500).json({
                erro: 'erro ao buscar usuarios no banco'
            });
        }

        //retorna os resultados encontrados
        res.json(results);
    })  
};

function buscarPorIdUsuarios(req, res) {
    const id = parseInt(req.params.id);
    
    //executa SQL com filtro

    connection.query(
        'SELECT * FROM usuarios WHERE id = ? AND ativo = true',
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar usuario'
                });
            }

            //se nao encontrar nenhuma tarefa
            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Usuario não encontrada'
                })
            }

            res.json(results[0]);
        }
    );
};

function criarUsuario(req, res){
    const { nome, email, telefone, ativo } = req.body;

    //comando SQL para inserir dados no BD
    const sql = 'INSERT INTO usuarios (nome, email, telefone, ativo, created_at) VALUES (?, ?, ?, ?, NOW())';

    //executa o insert
    connection.query(
        sql,
        [nome, email, telefone, ativo],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao criar usuário'
                });
            }

            if (novoNome.trim() === '') {
                return res.status(400).json({
                    erro: 'O nome não pode ser vazio'
                });
            }


            //retorna a tarefa criada

            res.status(201).json({
                id: result.insertId,
                nome,
                email,
                telefone,
                ativo
            });
        }
    )
};

function atualizarUsuario(req, res) {
    const id = parseInt(req.params.id);
    const { nome, email, telefone, ativo } = req.body;

    connection.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [id],
        (err, results) => {
            //se houver erro na consulta
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar usuario no banco'
                });
            }

            //se não encontrou tarefa com o id
            if (results.length == 0) {
                return res.status(404).json ({
                    erro: 'usuario não encontrado'
                });
            }
            //pega os dados da tarefa encontrada
            const usuarioAtual = results[0];

            const novoNome = nome !== undefined ? nome : usuarioAtual.nome;
            const novoEmail = email !== undefined ? email : usuarioAtual.email;
            const novoTelefone = telefone !== undefined ? telefone : usuarioAtual.telefone;
            const novoAtivo = ativo !== undefined ? ativo : usuarioAtual.ativo;

            if (novoNome.trim() === '') {
                return res.status(400).json({
                    erro: 'O nome não pode ser vazio'
                });
            }

            //executar o UPDATE no BD
            connection.query(
                'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, ativo = ? WHERE id = ?', [novoNome, novoEmail, novoTelefone, novoAtivo, id], (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            erro: 'Erro ao atualizar usuario'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            erro: 'usuario não encontrado para atualizar'
                        });
                    }

                    res.json({
                        id,
                        nome: novoNome,
                        email: novoEmail,
                        telefone: novoTelefone,
                        ativo: novoAtivo,
                    });
        });
                
    });
};

function removerUsuario(req, res) {
    const id = parseInt(req.params.id);

    connection.query(
        'UPDATE usuarios SET ativo = false WHERE id = ? AND ativo = true',
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao apagar usuário'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado ou já removido'
                });
            }

            res.json({
                mensagem: 'Usuário removido com sucesso'
            });
        });
};

module.exports = { listarUsuarios, buscarPorIdUsuarios, criarUsuario, atualizarUsuario, removerUsuario};