const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// Gera token JWT para o usuário
exports.gerarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Verifica se o e-mail já está cadastrado
exports.emailDisponivel = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });
  return !usuario;
};

// Valida credenciais e retorna o usuário ou null
exports.validarCredenciais = async (email, senha) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) return null;

  const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
  if (!senhaCorreta) return null;

  return usuario;
};