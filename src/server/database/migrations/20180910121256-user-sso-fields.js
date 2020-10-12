"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients
        ADD COLUMN sso_id VARCHAR(255) UNIQUE,
        ADD COLUMN username TEXT NOT NULL DEFAULT '',
        ADD COLUMN basket_token TEXT;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180910121256-user-sso-fields.js.map