"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
          ALTER TABLE sentences
          ADD age VARCHAR(255) NOT NULL DEFAULT "adults";
        `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20200427000001-add-age-groups-to-sentences.js.map