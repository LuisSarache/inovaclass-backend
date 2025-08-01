// syncDb.js
const sequelize = require('./config/database'); // ajuste o caminho se necessário
const { ChatMessage } = require('./models/chatmessageModel'); // só para garantir que o model está carregado

(async () => {
  try {
    await sequelize.sync({ alter: true }); // altera as tabelas conforme o model atual
    console.log('Banco de dados atualizado com sucesso!');
    process.exit(0); // termina o processo
  } catch (error) {
    console.error('Erro ao atualizar banco:', error);
    process.exit(1);
  }
})();
