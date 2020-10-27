"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips ADD INDEX sentence_idx (sentence(300));
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180518122522-clips-sentence-index.js.map