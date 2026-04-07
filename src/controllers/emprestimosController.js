const connection = require('../config/db');

function listarEmprestimos(req, res) {
    connection.query(
        `SELECT 
        emprestimos.id,
        usuarios.nome AS usuario,
        livros.titulo AS livro,
        emprestimos.data_emprestimo,
        emprestimos.data_prevista_devolucao,
        emprestimos.data_devolucao,
        emprestimos.status
        FROM emprestimos
        JOIN usuarios ON emprestimos.usuario_id = usuarios.id
        JOIN livros ON emprestimos.livro_id = livros.id`,
        
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar empréstimos no banco'
                });
            }

            res.json(results);
        }
    );
}

function buscarPorIdEmprestimos(req, res) {
    const id = parseInt(req.params.id);

    connection.query(
        `SELECT 
        emprestimos.id,
        usuarios.nome AS usuario,
        livros.titulo AS livro,
        emprestimos.data_emprestimo,
        emprestimos.data_prevista_devolucao,
        emprestimos.data_devolucao,
        emprestimos.status
        FROM emprestimos
        JOIN usuarios ON emprestimos.usuario_id = usuarios.id
        JOIN livros ON emprestimos.livro_id = livros.id
        WHERE emprestimos.id = ?`,
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar empréstimo'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Empréstimo não encontrado'
                });
            }

            res.json(results[0]);
        }
    );
}



function criarEmprestimo(req, res){
    const { data_prevista_devolucao, status, livro_id, usuario_id } = req.body;

    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao iniciar a transação' });
        }

        // verifica usuario
        connection.query(
            'SELECT ativo FROM usuarios WHERE id = ?',
            [usuario_id],
            (err, usuarios) => {

                if (err || usuarios.length === 0) {
                    return connection.rollback(() => {
                        res.status(400).json({ erro: 'Usuário não encontrado' });
                    });
                }

                if (!usuarios[0].ativo) {
                    return connection.rollback(() => {
                        res.status(400).json({ erro: 'Usuário está inativo' });
                    });
                }

                // verifica livro
                connection.query(
                    'SELECT quantidade_disponivel FROM livros WHERE id = ? AND ativo = true',
                    [livro_id],
                    (err, livros) => {

                        if (err || livros.length === 0) {
                            return connection.rollback(() => {
                                res.status(400).json({ erro: 'Livro não encontrado' });
                            });
                        }

                        if (livros[0].quantidade_disponivel === 0) {
                            return connection.rollback(() => {
                                res.status(400).json({ erro: 'Livro indisponível' });
                            });
                        }

                        // cria empréstimo
                        connection.query(
                            `INSERT INTO emprestimos 
                            (data_emprestimo, data_prevista_devolucao, status, livro_id, usuario_id)
                            VALUES (NOW(), ?, ?, ?, ?)`,
                            [data_prevista_devolucao, status || 'ativo', livro_id, usuario_id],
                            (err, result) => {

                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ erro: 'Erro ao criar empréstimo' });
                                    });
                                }

                                // atualiza estoque
                                connection.query(
                                    'UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?',
                                    [livro_id],
                                    (err) => {

                                        if (err) {
                                            return connection.rollback(() => {
                                                res.status(500).json({ erro: 'Erro ao atualizar estoque' });
                                            });
                                        }

                                        connection.commit(err => {

                                            if (err) {
                                                return connection.rollback(() => {
                                                    res.status(500).json({ erro: 'Erro ao finalizar transação' });
                                                });
                                            }

                                            res.status(201).json({
                                                id: result.insertId,
                                                livro_id,
                                                usuario_id,
                                                data_prevista_devolucao,
                                                status: status || 'ativo'
                                            });

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    });
}

function registrarDevolucao(req, res) {
    const id = parseInt(req.params.id);

    connection.query(
        'SELECT * FROM emprestimos WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    erro: 'Erro ao buscar emprestimo no banco'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Empréstimo não encontrado'
                });
            }

            const emprestimoAtual = results[0];

            if (emprestimoAtual.status === "devolvido") {
                return res.status(400).json({
                    erro: "Este empréstimo já foi devolvido"
                });
            }

            connection.beginTransaction(err => {

                if (err) {
                    return res.status(500).json({
                        erro: 'Erro ao iniciar transação'
                    });
                }

                connection.query(
                    'UPDATE emprestimos SET data_devolucao = NOW(), status = "devolvido" WHERE id = ?',
                    [id],
                    (err, result) => {

                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({
                                    erro: 'Erro ao registrar devolução'
                                });
                            });
                        }

                        connection.query(
                            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?',
                            [emprestimoAtual.livro_id],
                            (err) => {

                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).json({
                                            erro: 'Erro ao atualizar estoque'
                                        });
                                    });
                                }

                                connection.commit(err => {

                                    if (err) {
                                        return connection.rollback(() => {
                                            res.status(500).json({
                                                erro: 'Erro ao finalizar transação'
                                            });
                                        });
                                    }

                                    res.json({
                                        mensagem: "Livro devolvido com sucesso."
                                    });

                                });

                            }
                        );

                    }
                );

            });

        }
    );
}

function listarEmprestimoAtrasado(req, res) {

    connection.query(
        `SELECT emprestimos.id, usuarios.nome AS usuario, livros.titulo AS livro, emprestimos.data_prevista_devolucao
        FROM emprestimos
        JOIN usuarios ON emprestimos.usuario_id = usuarios.id
        JOIN livros ON emprestimos.livro_id = livros.id 
        WHERE emprestimos.status = 'ativo'
        AND emprestimos.data_prevista_devolucao < CURDATE()`,
        
        (err, results) => {
            
            if (err) {
                return res.status(500).json({
                    erro: "Erro ao listar emprestimos atrasados"
                });
            }
        
            res.json(results);
        }
    );
}

module.exports = { listarEmprestimos, buscarPorIdEmprestimos, criarEmprestimo, registrarDevolucao, listarEmprestimoAtrasado};