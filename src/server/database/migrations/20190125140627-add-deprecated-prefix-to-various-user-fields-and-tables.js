"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      RENAME TABLE users TO deprecated_users;
      
      ALTER TABLE user_clients
        CHANGE COLUMN accent deprecated_accent VARCHAR(255),
        CHANGE COLUMN bucket deprecated_bucket VARCHAR(255),
        CHANGE COLUMN sso_id deprecated_sso_id VARCHAR(255);
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190125140627-add-deprecated-prefix-to-various-user-fields-and-tables.js.map