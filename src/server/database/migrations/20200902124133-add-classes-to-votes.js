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
  db.runSql(`
    ALTER TABLE
      votes
    ADD COLUMN is_super BOOLEAN DEFAULT FALSE NOT NULL,
    ADD COLUMN is_unsure BOOLEAN DEFAULT NULL;
  `);
};

exports.down = async function (db) {
  return db.runSql(`
    ALTER TABLE
      votes
    DROP COLUMN is_super,
    DROP COLUMN is_unsure;
  `);
};

exports._meta = {
  "version": 1
};
