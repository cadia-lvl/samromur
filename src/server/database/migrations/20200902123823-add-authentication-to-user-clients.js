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
    ADD COLUMN email_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN confirm_id VARCHAR(255) DEFAULT NULL,
    ADD COLUMN password CHAR(128) DEFAULT NULL,
    ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;
  `);
};

exports.down = async function (db) {
  return db.runSql(`
    ALTER TABLE
      user_clients
    DROP COLUMN email_confirmed,
    DROP COLUMN confirm_id,
    DROP COLUMN password,
    DROP COLUMN is_admin;
  `);
};

exports._meta = {
  "version": 1
};
