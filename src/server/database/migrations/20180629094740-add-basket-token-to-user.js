"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE users
        ADD COLUMN basket_token TEXT;
    `);
};
//# sourceMappingURL=20180629094740-add-basket-token-to-user.js.map