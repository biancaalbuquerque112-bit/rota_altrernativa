const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Rota = require("./Rota");
const Carona = require("./Carona");

// ── Associações ──────────────────────────────────────────────────
Usuario.hasMany(Carona, { foreignKey: "usuarioId", as: "motorista" });
Carona.belongsTo(Usuario, { foreignKey: "usuarioId", as: "motorista" });

Usuario.hasMany(Rota, { foreignKey: "usuarioId" });
Rota.belongsTo(Usuario, { foreignKey: "usuarioId" });

Rota.hasMany(Carona, { foreignKey: "rotaId" });
Carona.belongsTo(Rota, { foreignKey: "rotaId" });

// ── Sincroniza tabelas com o banco ───────────────────────────────
// alter: true atualiza colunas sem apagar dados existentes
sequelize.sync({ alter: true })
  .then(() => console.log("Tabelas sincronizadas."))
  .catch((err) => console.error("Erro ao sincronizar tabelas:", err));

module.exports = { sequelize, Usuario, Rota, Carona };