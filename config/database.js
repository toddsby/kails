var database = {
  development: {
    username: process.env.DATABASE_USERNAME_DEV || 'drew',
    password: process.env.DATABASE_PASSWORD_DEV || 'mypass1234',
    database: process.env.DATABASE_NAME_DEV || 'koa-kails',
    host: process.env.DATABASE_HOST_DEV || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 6,
      min: 2,
      idle: 10000
    },
    migrationStorageTableName: 'migrations',
    seederStorage: 'sequelize',
    seederStorageTableName: 'seeds'
  },
  test: {
    username: process.env.DATABASE_USERNAME_TEST || 'kails_tester',
    password: process.env.DATABASE_PASSWORD_TEST || 'kails_tester',
    database: process.env.DATABASE_NAME_TEST || 'kails_test',
    host: process.env.DATABASE_HOST_TEST || '127.0.0.1',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  },
  production: {
    username: process.env.DATABASE_USERNAME_PRO,
    password: process.env.DATABASE_PASSWORD_PRO,
    database: process.env.DATABASE_NAME_PRO,
    host: process.env.DATABASE_HOST_PRO,
    dialect: 'postgres',
    pool: {
      max: 10,
      min: 5,
      idle: 30000
    }
  }
};

module.exports = database;