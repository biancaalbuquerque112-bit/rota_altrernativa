const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "759012",
  database: "rota_alternativa"
});

db.connect((erro) => {
  if (erro) {
    console.log("Erro ao conectar:", erro);
    return;
  }

  console.log("Conectado ao MySQL");
});

app.post("/contato", (req, res) => {
  const { nome, email, telefone, destino, mensagem } = req.body;

  const sql = `
    INSERT INTO contatos 
    (nome, email, telefone, destino, mensagem)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, telefone, destino, mensagem], (erro) => {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao salvar no banco" });
    }

    res.json({ mensagem: "Dados enviados com sucesso!" });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});