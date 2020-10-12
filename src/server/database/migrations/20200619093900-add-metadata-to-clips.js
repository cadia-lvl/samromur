"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE
        clips
      ADD COLUMN status TEXT DEFAULT NULL,
      ADD COLUMN empty BOOLEAN DEFAULT FALSE,
      ADD COLUMN sample_rate INTEGER DEFAULT NULL,
      ADD COLUMN duration INTEGER DEFAULT NULL,
      ADD COLUMN size INTEGER DEFAULT NULL
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20200619093900-add-metadata-to-clips.js.map