const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importa os models no formato de função
const AdminModel = require('./admin');
const ProfessorModel = require('./professor');
const AlunoModel = require('./aluno');
const TurmaModel = require('./turma');
const MessageModel = require('./message');

// Inicializa cada model passando a instância do sequelize
const Admin = AdminModel(sequelize, DataTypes);
const Professor = ProfessorModel(sequelize, DataTypes);
const Aluno = AlunoModel(sequelize, DataTypes);
const Turma = TurmaModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);

// Associações (verifica se existe método associate no model)
if (Admin.associate) Admin.associate({ Professor, Aluno, Turma });
if (Professor.associate) Professor.associate({ Admin, Aluno, Turma });
if (Aluno.associate) Aluno.associate({ Admin, Professor, Turma });
if (Turma.associate) Turma.associate({ Admin, Professor, Aluno });

module.exports = {
  sequelize,
  Admin,
  Professor,
  Aluno,
  Turma,
  Message,
};
