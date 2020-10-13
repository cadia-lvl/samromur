"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    await db.runSql(`
      ALTER TABLE user_clients ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
      ALTER TABLE sentences ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
      ALTER TABLE clips ADD COLUMN bucket ENUM ('train', 'dev', 'test') DEFAULT 'train';
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180221154147-add-bucket-to-user_clients-and-sentences.js.map