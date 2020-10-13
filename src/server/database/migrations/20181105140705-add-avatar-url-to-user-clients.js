"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients ADD COLUMN avatar_url TEXT;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20181105140705-add-avatar-url-to-user-clients.js.map