"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips ADD INDEX created_at_idx (created_at);
      ALTER TABLE votes ADD INDEX created_at_idx (created_at);
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180531091919-clips_and_votes-created-at-index.js.map