const express = require("express");
const router = express.Router();
const rotaController = require("../controllers/rotaController");
const auth = require("../middlewares/authMiddleware");

// todas as rotas exigem login
router.use(auth);

router.get("/", rotaController.listar);
router.get("/criar", rotaController.exibirCriar);
router.post("/", rotaController.criar);

router.get("/:id/editar", rotaController.exibirEditar);
router.post("/:id/editar", rotaController.editar);
router.post("/:id/deletar", rotaController.deletar);

module.exports = router;