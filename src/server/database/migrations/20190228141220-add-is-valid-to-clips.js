"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips ADD COLUMN is_valid BOOLEAN;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190228141220-add-is-valid-to-clips.js.map