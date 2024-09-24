module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false, // Disables createdAt and updatedAt
    }
  );
  return user;
};
