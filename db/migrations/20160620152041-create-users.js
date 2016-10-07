var customDataType = require('../../app/lib/timestamp.datatype');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password_digest: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('users');
  }
};
