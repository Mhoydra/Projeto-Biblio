create DATABASE biblioverso;
USE biblioverso;

CREATE TABLE usuarios (
    -- Valores com a necessidade de preenchimento
    nomeUsuario VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, 
    senha VARCHAR(255) NOT NULL, -- Senha usará bcrypt no futuro
    telefone VARCHAR(20) UNIQUE,

    -- Valores auto preenchiveis
    ativo BOOLEAN DEFAULT TRUE,
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE criacoes (
    -- Valores com a necessidade de preenchimento
    nomeCriacao VARCHAR(100) NOT NULL,
    quantidadeTotal INT NOT NULL DEFAULT 0, 
    CHECK (quantidadeTotal >= 0), -- Precisa pegar quantia referente de criações
    visibilidade BOOLEAN DEFAULT FALSE, -- Referente a privado

    -- Valores auto preenchiveis
    idCriacao INT PRIMARY KEY AUTO_INCREMENT ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    idAutor INT NOT NULL, 
    FOREIGN KEY (idAutor) REFERENCES usuarios(idUsuario)
    ON DELETE CASCADE
);

-- Dados de usuario para preenchimento
INSERT INTO usuarios (nomeUsuario,email,senha,telefone) VALUES 
('Yuri','YuriMTetris@gmail.com','UFuhGFUJYf','0123456789'),
('Joel','joelDRM@gmail.com','bOlInHoDeChUvA','9876543210'),
('Vagante','MSWORD@gmail.com','EspadaDeOsso','238576344'),
('Malenia','hardcore@gmail.com','123','236242363'),
('Hollow Knight','RecepP@gmail.com','liL1iIlI1lIiI1lILl','754456234'),
('Pyrophinos','MewGenics@gmail.com','UyfgYFUyf','4522342344');

-- Dados da criação para preenchimento
INSERT INTO criacoes (nomeCriacao, idAutor) VALUES 
('48 leis da mira', 1),
('Como ser um espião, não conta para ninguém', 2),
('Five Nights at Freddys', 4),
('Como fazer um miojo', 4),
('Como jogar uno bem', 5),
('Instruções Elétricas', 3);