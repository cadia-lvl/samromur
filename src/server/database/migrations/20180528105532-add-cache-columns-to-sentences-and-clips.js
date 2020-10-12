"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips
        ADD COLUMN needs_votes BOOLEAN DEFAULT TRUE,
        ADD INDEX needs_votes_idx (needs_votes);
      
      ALTER TABLE sentences
        ADD COLUMN clips_count INT DEFAULT 0,
        ADD INDEX clips_count_idx (clips_count);
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180528105532-add-cache-columns-to-sentences-and-clips.js.map