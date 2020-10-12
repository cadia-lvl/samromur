"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE clips ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE sentences ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE user_clients ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT now();
      ALTER TABLE votes ADD COLUMN created_at DATETIME DEFAULT now();
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180118135749-add-timestamps.js.map