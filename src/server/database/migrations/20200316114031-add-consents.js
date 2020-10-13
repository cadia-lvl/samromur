"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE IF NOT EXISTS consents (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        kennitala VARCHAR(10) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        permission BOOLEAN NOT NULL DEFAULT FALSE,
        uuid VARCHAR(255) DEFAULT NULL,
        UNIQUE KEY uuid (uuid)
      );
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20200316114031-add-consents.js.map