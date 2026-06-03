const { Rota, Usuario } = require("../models");

// ── GET /rotas ──────────────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const rotas = await Rota.findAll({
      where: { usuarioId: req.usuario.id },
      order: [["createdAt", "DESC"]],
    });

    res.render("rotas/index", { rotas, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao listar rotas.");
  }
};

// ── GET /rotas/criar ────────────────────────────────────────────
exports.exibirCriar = (req, res) => {
  res.render("rotas/criar", { erro: null, usuario: req.usuario });
};

// ── POST /rotas ─────────────────────────────────────────────────
exports.criar = async (req, res) => {
  try {
    const { origem, destino, distancia } = req.body;

    await Rota.create({
      usuarioId: req.usuario.id,
      origem,
      destino,
      distancia: distancia || null,
    });

    res.redirect("/rotas");
  } catch (err) {
    console.error(err);
    res.render("rotas/criar", {
      erro: "Erro ao criar rota. Verifique os dados.",
      usuario: req.usuario,
    });
  }
};

// ── GET /rotas/:id/editar ───────────────────────────────────────
exports.exibirEditar = async (req, res) => {
  try {
    const rota = await Rota.findByPk(req.params.id);

    if (!rota) return res.status(404).send("Rota não encontrada.");
    if (rota.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    res.render("rotas/editar", { rota, erro: null, usuario: req.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar rota.");
  }
};

// ── POST /rotas/:id/editar ──────────────────────────────────────
exports.editar = async (req, res) => {
  try {
    const rota = await Rota.findByPk(req.params.id);

    if (!rota) return res.status(404).send("Rota não encontrada.");
    if (rota.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    const { origem, destino, distancia } = req.body;
    await rota.update({ origem, destino, distancia });

    res.redirect("/rotas");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar rota.");
  }
};

// ── POST /rotas/:id/deletar ─────────────────────────────────────
exports.deletar = async (req, res) => {
  try {
    const rota = await Rota.findByPk(req.params.id);

    if (!rota) return res.status(404).send("Rota não encontrada.");
    if (rota.usuarioId !== req.usuario.id) return res.status(403).send("Sem permissão.");

    await rota.destroy();
    res.redirect("/rotas");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar rota.");
  }
};