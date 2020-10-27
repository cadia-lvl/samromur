"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients ADD COLUMN has_login BOOLEAN DEFAULT FALSE;
      
      UPDATE user_clients SET has_login = sso_id IS NOT NULL;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20181123102419-change-user-clients-sso-id-to-has-login.js.map