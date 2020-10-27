"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
        ALTER TABLE clips ADD COLUMN user_agent TEXT;
      `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190522114029-add-user-agent.js.map