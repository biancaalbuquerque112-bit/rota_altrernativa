const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// ── GET /login ──────────────────────────────────────────────────
exports.exibirLogin = (req, res) => {
  res.render("login", { erro: null });
};
// ── POST /login ─────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.render("login", { erro: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.render("login", { erro: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
    res.redirect("/caronas");
  } catch (err) {
    console.error(err);
    res.render("login", { erro: "Erro interno. Tente novamente." });
  }
};

// ── GET /cadastro ───────────────────────────────────────────────
exports.exibirCadastro = (req, res) => {
  res.render("cadastro", { erro: null });
};

// ── POST /cadastro ──────────────────────────────────────────────
exports.cadastro = async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo } = req.body;

    const jaExiste = await Usuario.findOne({ where: { email } });
    if (jaExiste) {
      return res.render("cadastro", { erro: "E-mail já cadastrado." });
    }

    const hash = bcrypt.hashSync(senha, 10);
    await Usuario.create({ nome, email, senha: hash, telefone, tipo });

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.render("cadastro", { erro: "Erro ao criar conta. Tente novamente." });
  }
};

// ── GET /logout ─────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};