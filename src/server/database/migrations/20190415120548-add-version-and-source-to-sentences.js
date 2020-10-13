"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE sentences
        ADD COLUMN version TINYINT UNSIGNED NOT NULL DEFAULT 0,
        ADD COLUMN source TEXT NULL DEFAULT NULL;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190415120548-add-version-and-source-to-sentences.js.map