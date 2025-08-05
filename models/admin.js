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
        type: DataTypes.STRING(100), // limite de tamanho
        allowNull: false,
        validate: {
          notEmpty: { msg: "O nome não pode ser vazio" },
          len: { args: [3, 100], msg: "O nome deve ter entre 3 e 100 caracteres" },
        },
      },
      email: {
        type: DataTypes.STRING(150),
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
      timestamps: true,
      underscored: true,
      defaultScope: {
        attributes: { exclude: ["senha"] }, // não retorna senha por padrão
      },
      scopes: {
        withPassword: { attributes: {} }, // inclui senha quando quiser
      },
    }
  );

  Admin.associate = (models) => {
    // Exemplo de associação futura:
    // Admin.hasMany(models.Professor, { foreignKey: "admin_id" });
  };

  return Admin;
};
