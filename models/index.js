const { DataTypes } = require("sequelize");
require("dotenv").config();
const { sequelize } = require("../config/database");

// Inicializa a conexão com Sequelize usando variáveis do .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql", // mysql, postgres, sqlite
    logging: false, // false para não poluir o console
  }
);

// Importa os models
const Admin = require("./admin")(sequelize, DataTypes);
const Professor = require("./professor")(sequelize, DataTypes);
const Aluno = require("./aluno")(sequelize, DataTypes);
const Turma = require("./turma")(sequelize, DataTypes);

// Definir associações entre models (se existirem)
if (Professor.associate) Professor.associate({ Admin, Aluno, Turma });
if (Aluno.associate) Aluno.associate({ Admin, Professor, Turma });
if (Turma.associate) Turma.associate({ Admin, Professor, Aluno });

// Exporta para usar em qualquer lugar
module.exports = {
  sequelize,
  Sequelize,
  Admin,
  Professor,
  Aluno,
  Turma,
};
