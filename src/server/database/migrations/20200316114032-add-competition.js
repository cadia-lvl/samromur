"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
        ALTER TABLE clips
        ADD institution VARCHAR(255) DEFAULT NULL,
        ADD division VARCHAR(255) DEFAULT NULL;
      `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20200316114032-add-competition.js.map