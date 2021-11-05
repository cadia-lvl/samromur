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
            CREATE TABLE IF NOT EXISTS institutions (
                id VARCHAR(45) NOT NULL,
                name VARCHAR(255) NOT NULL,
                size VARCHAR(45) NOT NULL,
                email VARCHAR(255) NOT NULL,
                contact VARCHAR(255) NOT NULL,
                is_used TINYINT(1) NOT NULL DEFAULT 1,
                created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE INDEX name_UNIQUE (name ASC)
            );
  `);
};

exports.down = function () {
    return null;
};

exports._meta = {
    version: 1,
};
