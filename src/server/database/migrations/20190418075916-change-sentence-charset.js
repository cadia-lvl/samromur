"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE sentences MODIFY text TEXT CHARSET utf8mb4 NOT NULL;
      ALTER TABLE clips MODIFY sentence TEXT CHARSET utf8mb4 NOT NULL;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190418075916-change-sentence-charset.js.map