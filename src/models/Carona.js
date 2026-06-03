const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carona = sequelize.define("Carona", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rotaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vagas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  horario: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("ativa", "concluida", "cancelada"),
    defaultValue: "ativa",
  },
});

module.exports = Carona;