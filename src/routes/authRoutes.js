const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.exibirLogin);
router.post("/login", authController.login);

router.get("/cadastro", authController.exibirCadastro);
router.post("/cadastro", authController.cadastro);

router.get("/logout", authController.logout);

module.exports = router;