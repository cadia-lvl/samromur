"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients ADD COLUMN avatar_clip_url TEXT;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190522114028-add-avatar-clip-url-to-user-client.js.map