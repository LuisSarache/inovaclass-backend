module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define("Professor", {
    nome: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    senha: DataTypes.STRING
  });
  return Professor
  };
