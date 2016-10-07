var customDataType = require('../../app/lib/timestamp.datatype');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('articles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      created_at: {
        type: customDataType.TIMESTAMP
      },
      updated_at: {
        type: customDataType.TIMESTAMP
      }
    }, {
      underscored: true
    });
  },

  down: function (queryInterface, _Sequelize) {
    return queryInterface.dropTable('articles');
  }
};
