"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE custom_goals (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        client_id CHAR(36) NOT NULL,
        type ENUM('speak', 'listen', 'both') NOT NULL,
        days_interval TINYINT UNSIGNED NOT NULL,
        amount SMALLINT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT now(),
        FOREIGN KEY (client_id) REFERENCES user_clients (client_id),
        UNIQUE (client_id)
      );
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20190320130113-custom-goals.js.map