const { Carona, Rota, Usuario } = require("../models");

// ── GET /caronas ────────────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const caronas = await Carona.findAll({
      include: [
        { model: Usuario, as: "motorista", attributes: ["id", "nome", "telefone"] },
        { model: Rota, attributes: ["origem", "destino", "distancia"] },
      ],
      order: [["horario", "ASC"]],
    });

    res.render("caronas/index", { caronas, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar caronas.");
  }
};

// ── GET /caronas/criar ──────────────────────────────────────────
exports.exibirCriar = async (req, res) => {
  try {
    const rotas = await Rota.findAll({ where: { usuarioId: req.usuario.id } });
    res.render("caronas/criar", { rotas, erro: null, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar formulário.");
  }
};

// ── POST /caronas ───────────────────────────────────────────────
exports.criar = async (req, res) => {
  try {
    const { rotaId, vagas, horario } = req.body;

    await Carona.create({
      usuarioId: req.usuario.id,
      rotaId,
      vagas,
      horario,
      status: "ativa",
    });

    res.redirect("/caronas");
  } catch (err) {
    console.error(err);
    const rotas = await Rota.findAll({ where: { usuarioId: req.usuario.id } });
    res.render("caronas/criar", {
      rotas,
      erro: "Erro ao criar carona. Verifique os dados.",
      usuario: req.usuario,
    });
  }
};

// ── GET /caronas/:id ────────────────────────────────────────────
exports.detalhe = async (req, res) => {
  try {
    const carona = await Carona.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: "motorista", attributes: ["id", "nome", "telefone"] },
        { model: Rota, attributes: ["origem", "destino", "distancia"] },
      ],
    });

    if (!carona) return res.status(404).send("Carona não encontrada.");

    res.render("caronas/detalhe", { carona, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar carona.");
  }
};

// ── GET /caronas/:id/editar ─────────────────────────────────────
exports.exibirEditar = async (req, res) => {
  try {
    const carona = await Carona.findByPk(req.params.id);

    if (!carona) return res.status(404).send("Carona não encontrada.");
    if (carona.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    const rotas = await Rota.findAll({ where: { usuarioId: req.usuario.id } });
    res.render("caronas/editar", { carona, rotas, erro: null, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar formulário.");
  }
};

// ── POST /caronas/:id/editar ────────────────────────────────────
exports.editar = async (req, res) => {
  try {
    const carona = await Carona.findByPk(req.params.id);

    if (!carona) return res.status(404).send("Carona não encontrada.");
    if (carona.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    const { rotaId, vagas, horario, status } = req.body;
    await carona.update({ rotaId, vagas, horario, status });

    res.redirect("/caronas");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar carona.");
  }
};

// ── POST /caronas/:id/deletar ───────────────────────────────────
exports.deletar = async (req, res) => {
  try {
    const carona = await Carona.findByPk(req.params.id);

    if (!carona) return res.status(404).send("Carona não encontrada.");
    if (carona.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    await carona.destroy();
    res.redirect("/caronas");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar carona.");
  }
};