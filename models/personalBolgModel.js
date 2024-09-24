module.exports = (sequelize, Sequelize) => {
  const blog = sequelize.define(
    "personal_blogs",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      author: {
        type: Sequelize.STRING,
      },
      blogContent: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING, // Store the image path or URL
      },
    },
    {
      timestamps: false, // Disables createdAt and updatedAt
    }
  );
  return blog;
};
