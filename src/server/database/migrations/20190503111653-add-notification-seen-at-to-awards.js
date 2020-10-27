"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE awards ADD COLUMN notification_seen_at TIMESTAMP NULL DEFAULT NULL;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190503111653-add-notification-seen-at-to-awards.js.map