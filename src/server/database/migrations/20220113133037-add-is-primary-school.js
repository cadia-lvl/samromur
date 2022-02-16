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
            institutions 
        ADD COLUMN is_primary_school TINYINT(1) NOT NULL DEFAULT 0;
  `);
};

exports.down = function () {
    return null;
};

exports._meta = {
    version: 1,
};
