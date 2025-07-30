const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['aluno', 'docente'], required: true }
});

module.exports = mongoose.model('User', userSchema);
