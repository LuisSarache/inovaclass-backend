module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "admins", // nome da tabela no banco (opcional)
    timestamps: true,    // para criar createdAt, updatedAt (padrão true)
  });

  return Admin;
};
