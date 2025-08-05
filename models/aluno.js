// src/models/aluno.js

module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define(
    "Aluno",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome do aluno não pode ser vazio" },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: { msg: "Informe um e-mail válido" },
        },
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "alunos",  // nome da tabela
      timestamps: true,
      underscored: true,
    }
  );

  // Caso queira adicionar associações depois:
  Aluno.associate = (models) => {
    // Exemplo:
    // Aluno.belongsTo(models.Turma, { foreignKey: "turma_id" });
  };

  return Aluno;
};
