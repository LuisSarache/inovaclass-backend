// models/message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    autor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    updatedAt: false
  });

  return Message;
};
