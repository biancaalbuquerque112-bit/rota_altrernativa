const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/config/database");

const authRoutes = require("./src/routes/authRoutes");
const rotaRoutes = require("./src/routes/rotaRoutes");
const caronaRoutes = require("./src/routes/caronaRoutes");

const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


sequelize.authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar:", err);
  });

app.get("/", (req, res) => {
  res.render("index");
});


// Rotas
app.use("/", authRoutes);
app.use("/rotas", rotaRoutes);
app.use("/caronas", caronaRoutes);

app.get("/teste", (req, res) => {
  res.send("Funcionando!");
});


app.listen(4000, () => {
  console.log("Servidor rodando em http://localhost:4000");
});

setInterval(() => {
  console.log("Servidor ativo...");
}, 10000);