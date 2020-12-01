'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async function (db) {
    return db.runSql(`
    ALTER TABLE
      user_clients
    ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL,
    ADD COLUMN reset_password_token_expires VARCHAR(255) DEFAULT NULL;
  `);
};

exports.down = async function (db) {
    return db.runSql(`
    ALTER TABLE
      user_clients
    DROP COLUMN reset_password_token,
    DROP COLUMN reset_password_token_expires;
  `);
};

exports._meta = {
    version: 1,
};
