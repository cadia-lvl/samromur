"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      ALTER TABLE user_clients DROP COLUMN has_downloaded;

      CREATE TABLE downloaders (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        locale_id SMALLINT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT now(),
        UNIQUE KEY email_locale (email, locale_id)
      );
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190228085830-downloaders.js.map