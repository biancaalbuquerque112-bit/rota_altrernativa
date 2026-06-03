const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rota = sequelize.define("Rota", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  origem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distancia: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = Rota;