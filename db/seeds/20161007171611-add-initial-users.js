'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log('GO SPEEDRACER GOOO!');
    return 
      queryInterface.bulkInsert('users', [
        {email: "aphrodite@olympus.org", name: "Aphrodite", passwordDigest: '', createdAt: Date.now(), updatedAt: Date.now() },
        {email: "athena@olympus.org", name: "Athena", passwordDigest: '', createdAt: Date.now(), updatedAt: Date.now() },
        {email: "zeus@olympus.org", name: "Zeus", passwordDigest: '', createdAt: Date.now(), updatedAt: Date.now() },
        {email: "apollo@olympus.org", name: "Apollo", passwordDigest: '', createdAt: Date.now(), updatedAt: Date.now() }
        ],{}
      );
  },

  down: function (queryInterface, Sequelize) {
    return 
    queryInterface.bulkDelete({tablename:'users'}, null, {});
  }
};