"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE sentences ADD INDEX text_idx (text(300));
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180517084308-sentences-text-index.js.map