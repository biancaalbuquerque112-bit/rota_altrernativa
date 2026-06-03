const express = require("express");
const router = express.Router();
const caronaController = require("../controllers/caronaController");
const auth = require("../middlewares/authMiddleware");

// todas as rotas de carona exigem login
router.use(auth);

router.get("/", caronaController.listar);
router.get("/criar", caronaController.exibirCriar);
router.post("/", caronaController.criar);

router.get("/:id", caronaController.detalhe);
router.get("/:id/editar", caronaController.exibirEditar);
router.post("/:id/editar", caronaController.editar);
router.post("/:id/deletar", caronaController.deletar);

module.exports = router;