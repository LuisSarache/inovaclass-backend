const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importa models
const Admin = require('./admin')(sequelize, DataTypes);
const Professor = require('./professor')(sequelize, DataTypes);
const Aluno = require('./aluno')(sequelize, DataTypes);
const Turma = require('./turma')(sequelize, DataTypes);

// Associações
if (Professor.associate) Professor.associate({ Admin, Aluno, Turma });
if (Aluno.associate) Aluno.associate({ Admin, Professor, Turma });
if (Turma.associate) Turma.associate({ Admin, Professor, Aluno });

module.exports = {
  sequelize,
  Admin,
  Professor,
  Aluno,
  Turma
};
