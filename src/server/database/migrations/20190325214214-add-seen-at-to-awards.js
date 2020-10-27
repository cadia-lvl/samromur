"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE awards ADD COLUMN seen_at TIMESTAMP NULL DEFAULT NULL;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190325214214-add-seen-at-to-awards.js.map