module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
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
          notEmpty: { msg: "O nome não pode ser vazio" },
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
      tableName: "admins",
      timestamps: true, // createdAt, updatedAt
      underscored: true, // nomes de colunas com underline (opcional)
    }
  );

  // Caso futuramente precise associar Admin a outras tabelas:
  Admin.associate = (models) => {
    // Exemplo: Admin.hasMany(models.Professor, { foreignKey: "admin_id" });
  };

  return Admin;
};
