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
    ADD COLUMN is_super_user BOOLEAN DEFAULT FALSE NOT NULL;
  `);
};

exports.down = async function (db) {
  return db.runSql(`
    ALTER TABLE
      user_clients
    DROP COLUMN is_super_user
  `);
};

exports._meta = {
  "version": 1
};
