"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE IF NOT EXISTS user_client_locale_buckets (
        client_id CHAR(36) NOT NULL,
        locale_id SMALLINT UNSIGNED NOT NULL,
        bucket ENUM ('train', 'dev', 'test') DEFAULT 'train',
        PRIMARY KEY (client_id, locale_id),
        FOREIGN KEY (client_id) REFERENCES user_clients(client_id),
        FOREIGN KEY (locale_id) REFERENCES locales(id)
      );
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180503112435-user_client-locale-bucket.js.map