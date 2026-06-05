"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Scenes", {
      id:        { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name:      { type: Sequelize.STRING, allowNull: false, defaultValue: "Escena sin titulo" },
      data:      { type: Sequelize.JSONB, allowNull: false, defaultValue: { elements: [] } },
      userId:    {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: "Users", key: "id" }, onUpdate: "CASCADE", onDelete: "CASCADE"
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Scenes");
  }
};
