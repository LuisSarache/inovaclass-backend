const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // usa conexão já criada

// Importa os models usando a mesma instância sequelize
const Admin = require("./admin")(sequelize, DataTypes);
const Professor = require("./professor")(sequelize, DataTypes);
const Aluno = require("./aluno")(sequelize, DataTypes);
const Turma = require("./turma")(sequelize, DataTypes);

// Define associações, se existirem
if (Professor.associate) Professor.associate({ Admin, Aluno, Turma });
if (Aluno.associate) Aluno.associate({ Admin, Professor, Turma });
if (Turma.associate) Turma.associate({ Admin, Professor, Aluno });

// Exporta para o resto da aplicação
module.exports = {
  sequelize,
  Admin,
  Professor,
  Aluno,
  Turma,
};
