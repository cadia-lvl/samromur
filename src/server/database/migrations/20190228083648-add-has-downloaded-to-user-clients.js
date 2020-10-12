"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients
        ADD COLUMN has_downloaded BOOLEAN DEFAULT FALSE;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190228083648-add-has-downloaded-to-user-clients.js.map