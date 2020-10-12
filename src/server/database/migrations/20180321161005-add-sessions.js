"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,
        expires    int(11) unsigned                 NOT NULL,
        data       text COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id)
      )
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180321161005-add-sessions.js.map