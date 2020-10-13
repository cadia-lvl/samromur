"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE user_client_accents (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        locale_id SMALLINT(5) UNSIGNED NOT NULL,
        accent VARCHAR(255) NOT NULL,
        UNIQUE KEY client_locale (client_id, locale_id),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        FOREIGN KEY (locale_id) REFERENCES locales (id)
      );
    `);
};
//# sourceMappingURL=20180602125529-user-client-accents.js.map