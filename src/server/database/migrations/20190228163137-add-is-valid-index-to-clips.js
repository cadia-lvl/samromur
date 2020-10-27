"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips ADD INDEX is_valid_idx (is_valid);
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190228163137-add-is-valid-index-to-clips.js.map