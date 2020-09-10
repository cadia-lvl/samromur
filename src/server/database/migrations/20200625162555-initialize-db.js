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

exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS user_clients (
      client_id CHAR(36) NOT NULL PRIMARY KEY,
      email VARCHAR(255) DEFAULT NULL,
      created_at DATETIME DEFAULT NOW(),
      has_login BOOLEAN DEFAULT FALSE NOT NULL,
      UNIQUE KEY email (email)
    );

    CREATE TABLE IF NOT EXISTS sentences (
      id VARCHAR(255) NOT NULL,
      text TEXT CHARACTER SET utf8 NOT NULL,
      is_used BOOLEAN DEFAULT FALSE NOT NULL,
      created_at DATETIME DEFAULT NOW(),
      clips_count INTEGER NOT NULL DEFAULT 0,
      source VARCHAR(255) CHARACTER SET utf8 NOT NULL DEFAULT "default",
      target_group VARCHAR(255) NOT NULL DEFAULT "adults",
      PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS clips (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      client_id CHAR(36) NOT NULL,
      path VARCHAR(255) NOT NULL,
      sentence TEXT CHARACTER SET utf8 NOT NULL,
      original_sentence_id VARCHAR(255) NOT NULL,
      gender VARCHAR(255),
      age VARCHAR(255),
      native_language VARCHAR(255),
      created_at DATETIME DEFAULT NOW(),
      is_valid BOOLEAN DEFAULT NULL,
      user_agent TEXT,
      sample_rate INTEGER DEFAULT NULL,
      duration INTEGER DEFAULT NULL,
      size INTEGER DEFAULT NULL,
      KEY original_sentence_id (original_sentence_id),
      CONSTRAINT clips_ibfk_1 FOREIGN KEY (original_sentence_id) REFERENCES sentences (id),
      CONSTRAINT clips_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id)
    );

    CREATE TABLE IF NOT EXISTS votes (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      clip_id BIGINT(20) UNSIGNED NOT NULL,
      is_valid BOOLEAN DEFAULT NULL,
      client_id CHAR(36) NOT NULL,
      created_at DATETIME DEFAULT NOW(),
      CONSTRAINT votes_ibfk_1 FOREIGN KEY (clip_id) REFERENCES clips (id),
      CONSTRAINT votes_ibfk_2 FOREIGN KEY (client_id) REFERENCES user_clients (client_id) 
    );

    CREATE TABLE IF NOT EXISTS consents (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      kennitala VARCHAR(10) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      permission BOOLEAN NOT NULL DEFAULT FALSE,
      uuid VARCHAR(255) DEFAULT NULL,
      UNIQUE KEY uuid (uuid)
    )
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
