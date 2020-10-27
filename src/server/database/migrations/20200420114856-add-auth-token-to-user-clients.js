"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
        ALTER TABLE user_clients ADD COLUMN auth_token TEXT;
      `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20200420114856-add-auth-token-to-user-clients.js.map