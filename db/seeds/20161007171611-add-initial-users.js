'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log('GO SPEEDRACER GOOO!');
    return queryInterface.bulkInsert('users', [
        {email: "aphrodite@olympus.org", name: "Aphrodite", created_at: Date.now(), updated_at: Date.now() },
        {email: "athena@olympus.org", name: "Athena", created_at: Date.now(), updated_at: Date.now() },
        {email: "zeus@olympus.org", name: "Zeus", created_at: Date.now(), updated_at: Date.now() },
        {email: "apollo@olympus.org", name: "Apollo", created_at: Date.now(), updated_at: Date.now() }
        ],{}
      );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete({tablename:'users'}, null, {});
  }
};