"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients
        ADD COLUMN visible BOOLEAN DEFAULT FALSE,
        ADD COLUMN skip_submission_feedback BOOLEAN DEFAULT FALSE;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180927134400-user-client-visible-and-skip-submission-feedback.js.map